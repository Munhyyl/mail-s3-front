import apiClient1 from "./apiClient1";

// Файл байршуулах
export const uploadFile = async (file, folder = "") => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    if (folder) {
      formData.append("folder", folder);
    }

    const response = await apiClient1.post("/api/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Файл байршуулах үед алдаа гарлаа:", error);
    throw error;
  }
};

// Файлын жагсаалт авах
export const listFiles = async (folder = "") => {
  try {
    const response = await apiClient1.get(
      `/api/files/list?folder=${encodeURIComponent(folder)}`
    );
    return response.data;
  } catch (error) {
    console.error("Файлын жагсаалт авах үед алдаа гарлаа:", error);
    throw error;
  }
};

// Файл татаж авах
export const downloadFile = async (key) => {
  try {
    // URL-ийг / аар таслаж folder ба filename авах
    const parts = key.split("/");
    const filename = parts.pop();
    const folder = parts.join("/");

    const response = await apiClient1.get(
      `/api/files/${encodeURIComponent(folder)}/${encodeURIComponent(
        filename
      )}`,
      {
        responseType: "blob",
      }
    );

    return response.data;
  } catch (error) {
    console.error("Файл татах үед алдаа гарлаа:", error);
    throw error;
  }
};

// Файлын метадата авах
export const getFileMetadata = async (key) => {
  try {
    // URL-ийг / аар таслаж folder ба filename авах
    const parts = key.split("/");
    const filename = parts.pop();
    const folder = parts.join("/");

    const response = await apiClient1.get(
      `/api/files/metadata/${encodeURIComponent(folder)}/${encodeURIComponent(
        filename
      )}`
    );
    return response.data;
  } catch (error) {
    console.error("Файлын мэдээлэл авах үед алдаа гарлаа:", error);
    throw error;
  }
};

// Файл устгах
export const deleteFile = async (key) => {
  try {
    // URL-ийг / аар таслаж folder ба filename авах
    const parts = key.split("/");
    const filename = parts.pop();
    const folder = parts.join("/");

    const response = await apiClient1.delete(
      `/api/files/${encodeURIComponent(folder)}/${encodeURIComponent(filename)}`
    );
    return response.data;
  } catch (error) {
    console.error("Файл устгах үед алдаа гарлаа:", error);
    throw error;
  }
};
export const listFolders = async () => {
  try {
    const response = await apiClient1.get("/api/files/folders");
    return response.data;
  } catch (error) {
    console.error("Фолдеруудын жагсаалт авах үед алдаа гарлаа:", error);
    throw error;
  }
};
