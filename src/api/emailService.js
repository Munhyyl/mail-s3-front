import apiClient from "./apiClient";

export const sendEmail = async (to, subject, body, folder = null) => {
  const response = await apiClient.post("/api/emails/send", {
    to,
    subject,
    body,
    folder, // Optional field
  });
  return response.data;
};

export const sendDogPhotosEmail = async (to) => {
  const response = await apiClient.post("/api/emails/send-dog-photos", { to });
  return response.data;
};

// Шинээр нэмсэн функц - ямар ч хавтаснаас зураг илгээх
export const sendPhotosByFolder = async (to, folder) => {
  const response = await apiClient.post("/api/emails/send-photos", {
    to,
    folder,
  });
  return response.data;
};

export const getEmails = async () => {
  const response = await apiClient.get("/api/emails");
  return response.data;
};

export const searchEmails = async (query) => {
  const response = await apiClient.get(`/api/emails/search?query=${query}`);
  return response.data;
};
