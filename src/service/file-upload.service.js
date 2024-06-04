import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5005",
});

// Function to upload avatar
const uploadAvatar = async (file) => {
  try {
    const fileData = new FormData();
    fileData.append("file", file);
    const res = await api.post("/api/upload-avatar", fileData);
    return res.data.fileUrl;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Function to upload option-image
const uploadPollOptionImage = async (file) => {
  try {
    const fileData = new FormData();
    fileData.append("file", file);
    const res = await api.post("/api/upload-option-image", fileData);
    return res.data.fileUrl;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default {
  uploadAvatar,
  uploadPollOptionImage,
};
