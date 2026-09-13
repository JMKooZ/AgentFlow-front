import api from "./axios";

export const getMyAgents = async() => {
    const response = await api.get("/agents");
    return response.data;
};

export const getAgent = async(agentId) => {
    console.log(agentId);
    const response = await api.get(`/agents/${agentId}`);
    return response.data;
};

export const createAgent = async({
    name,
    description,
    systemPrompt,
    tools,
}) => {
    const response = await api.post("/agents", {
        name,
        description,
        systemPrompt,
        tools,
    });
    return response.data;
};

export const updateAgent = async(
    agentId, { name, description, systemPrompt, tools },
) => {
    const response = await api.put(`/agents/${agentId}`, {
        name,
        description,
        systemPrompt,
        tools,
    });
    return response.data;
};

export const deleteAgent = async(agentId) => {
    const response = await api.delete(`/agents/${agentId}`);
    return response.data;
};

export const executeAgent = async(agentId, message) => {
    const response = await api.post(`/agents/${agentId}/execute`, { message });
    return response.data;
};