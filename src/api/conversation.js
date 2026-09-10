import api from "./axios";

export const getConversations = async(agentId) => {
    const response = await api.get(`/agents/${agentId}/conversations`);
    return response.data;
};

export const createConversation = async(agentId, title) => {
    const response = await api.post(`/agents/${agentId}/conversations`, {
        title,
    });
    return response.data;
};

export const deleteConversation = async(agentId, conversationId) => {
    const response = await api.delete(
        `/agents/${agentId}/conversations/${conversationId}`,
    );
    return response.data;
};

export const getMessages = async(conversationId) => {
    const response = await api.get(`/conversations/${conversationId}/messages`);
    return response.data;
};

export const sendMessage = async(conversationId, content) => {
    const response = await api.post(`/conversations/${conversationId}/messages`, {
        content,
    });
    return response.data;
};