import api from "./axios";
import { getAccessToken } from "../utils/token";

export const getConversations = async (agentId) => {
  const response = await api.get(`/agents/${agentId}/conversations`);

  return response.data;
};

export const createConversation = async (agentId, title) => {
  const response = await api.post(`/agents/${agentId}/conversations`, {
    title,
  });

  return response.data;
};

export const deleteConversation = async (agentId, conversationId) => {
  const response = await api.delete(
    `/agents/${agentId}/conversations/${conversationId}`,
  );

  return response.data;
};

export const getMessages = async (conversationId) => {
  const response = await api.get(`/conversations/${conversationId}/messages`);

  return response.data;
};

export const sendMessage = async (conversationId, content) => {
  const response = await api.post(`/conversations/${conversationId}/messages`, {
    content,
  });

  return response.data;
};

/**
 * SSE 스트리밍으로 메시지를 보내고, 토큰이 도착할 때마다 onChunk로 전달한다.
 * axios는 스트리밍 응답을 다루기 번거로워서, fetch + ReadableStream을 직접 사용한다.
 * 백엔드는 `event: chunk` (data: 텍스트 조각) 를 여러 번 보내다가 `event: complete`로 끝낸다.
 */
export const streamMessage = async (
  conversationId,
  content,
  { onChunk, onComplete, onError } = {},
) => {
  try {
    const accessToken = getAccessToken();

    const response = await fetch(
      `/api/conversations/${conversationId}/messages/stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ content }),
      },
    );

    if (!response.ok || !response.body) {
      throw new Error(`스트리밍 요청 실패 (status: ${response.status})`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");

      let boundary;

      // SSE 이벤트는 빈 줄("\n\n")로 구분된다.
      while ((boundary = buffer.indexOf("\n\n")) !== -1) {
        const rawEvent = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);

        let eventType = "message";
        const dataLines = [];

        for (const line of rawEvent.split("\n")) {
          if (line.startsWith("event:")) {
            eventType = line.slice(6).trim();
          } else if (line.startsWith("data:")) {
            // "data:" 뒤에 공백 한 칸이 있으면 제거 (SSE 관례)
            dataLines.push(line.slice(5).replace(/^ /, ""));
          }
        }

        // 원본 텍스트에 개행이 있었다면 data: 줄이 여러 개로 나뉘어 오므로 다시 합침
        const data = dataLines.join("\n");

        if (eventType === "chunk") {
          onChunk?.(data);
        } else if (eventType === "complete") {
          onComplete?.();
        }
      }
    }
  } catch (error) {
    onError?.(error);
  }
};