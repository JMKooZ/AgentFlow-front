import api from "./axios";

export const getDocuments = async () => {
    const response = await api.get("/knowledge-documents");

    return response.data;
};

export const uploadDocument = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/knowledge-documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
};

export const deleteDocument = async (documentId) => {
    const response = await api.delete(`/knowledge-documents/${documentId}`);

    return response.data;
};