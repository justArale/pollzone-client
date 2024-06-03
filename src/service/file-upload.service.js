import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5005",
});

// Upload avatar
const uploadAvatar = async (file) => {
  try {
    const fileData = new FormData();
    fileData.append("image", file);
    const res = await api.post("/api/upload-avatar", fileData);
    return res.data.fileUrl;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Upload poll-option-image
const uploadPollOptionImage = async (file) => {
  try {
    const fileData = new FormData();
    fileData.append("image", file);
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
