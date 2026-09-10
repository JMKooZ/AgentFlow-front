import api from "./axios";

export const getMyFiles = async() => {
    const response = await api.get("/files");

    return response.data;
};

export const downloadFile = async(fileId, fileName) => {
    const response = await api.get(`/files/${fileId}/download`, {
        responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", fileName);

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
};