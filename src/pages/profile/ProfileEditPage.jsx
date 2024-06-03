import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/auth.context";
import "../../components/ProfileEditPage.css";
import fileUploadService from "../../service/file-upload.service";

const API_URL = import.meta.env.VITE_API_URL;

const DEFAULT_USER_FORM_VALUES = {
  name: "",
  image: "",
  description: "",
  category: "",
  socialMedia: [""],
};

function ProfileEditPage() {
  const [formValues, setFormValues] = useState(DEFAULT_USER_FORM_VALUES);
  const { user, authenticateUser } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    const storedToken = localStorage.getItem("authToken");
    try {
      const response = await axios.get(
        `${API_URL}/api/${user.role}/${user._id}`,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );
      setFormValues({
        name: response.data.name || "",
        image: response.data.image || "",
        description: response.data.description || "",
        category: response.data.category || "",
        socialMedia:
          response.data.socialMedia && response.data.socialMedia.length
            ? response.data.socialMedia
            : [""],
      });
    } catch (error) {
      const errorDescription =
        error.response?.data?.message || "An error occurred";
      setErrorMessage(errorDescription);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleUploadAvatar = async (file) => {
    try {
      setLoading(true);
      const fileUrl = await fileUploadService.uploadAvatar(file);
      setLoading(false);
      return fileUrl;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleUploadAvatar(file).then((fileUrl) => {
        setFormValues((prevValues) => ({
          ...prevValues,
          image: fileUrl,
        }));
      });
    }
  };

  const handleSocialMediaChange = (index, value) => {
    const newSocialMedia = [...formValues.socialMedia];
    newSocialMedia[index] = value;
    setFormValues((prevValues) => ({
      ...prevValues,
      socialMedia: newSocialMedia,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedToken = localStorage.getItem("authToken");

    try {
      await axios.put(`${API_URL}/api/${user.role}/${user._id}`, formValues, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      await authenticateUser(); // Update user context
      await fetchUserData(); // Fetch updated user data
      navigate("/profile");
    } catch (error) {
      const errorDescription =
        error.response?.data?.message || "An error occurred";
      setErrorMessage(errorDescription);
    }
  };

  return (
    <div className="formContainer">
      <h2 className="headlineCreateProject">Edit Profile</h2>
      {errorMessage && <p className="errorMessage">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="form">
        <div className="formGroup">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formValues.name}
            onChange={handleInputChange}
            className="input"
          />
        </div>
        <div className="formGroup">
          <h2>Upload Avatar</h2>
          <input type="file" onChange={handleAvatarChange} />
          {formValues.image && (
            <div>
              <p>Uploaded Avatar:</p>
              <img src={formValues.image} alt="Uploaded Avatar" />
            </div>
          )}
        </div>
        {user.role === "creators" && (
          <>
            <div className="formGroup">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={formValues.description}
                onChange={handleInputChange}
                className="textarea"
              />
            </div>
            <div className="formGroup">
              <label htmlFor="category">What's your niche?</label>
              <select
                id="category"
                name="category"
                value={formValues.category}
                onChange={handleInputChange}
                className="input"
              >
                <option value="" disabled>
                  Choose category
                </option>
                {[
                  "Music",
                  "Sports",
                  "Art",
                  "Gaming",
                  "Beauty",
                  "Culinary",
                  "Travel",
                  "Fitness",
                  "Film & Video",
                  "Audio & Podcasts",
                ].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
        <div className="formGroup">
          <label>Link to other platforms:</label>
          {formValues.socialMedia.map((link, index) => (
            <div key={index}>
              <input
                type="text"
                value={link}
                onChange={(e) => handleSocialMediaChange(index, e.target.value)}
                className="input"
              />
            </div>
          ))}
        </div>
        <button type="submit" className="button buttonLarge submitButton">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default ProfileEditPage;
