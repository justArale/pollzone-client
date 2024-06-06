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
  oldPassword: "",
  newPassword: "",
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
        oldPassword: "",
        newPassword: "",
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

  const handleCancel = () => {
    navigate("/profile");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedToken = localStorage.getItem("authToken");

    try {
      if (formValues.oldPassword && formValues.newPassword) {
        // Send request to change password
        await axios.put(
          `${API_URL}/api/${user.role}/${user._id}/change-password`,
          {
            oldPassword: formValues.oldPassword,
            newPassword: formValues.newPassword,
          },
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        );

        // Clear password fields
        setFormValues((prevValues) => ({
          ...prevValues,
          oldPassword: "",
          newPassword: "",
        }));

        // Update user context and fetch updated user data
        await authenticateUser();
        await fetchUserData();
        navigate("/profile");
      } else {
        // If oldPassword or newPassword is not provided, update user data directly
        await axios.put(`${API_URL}/api/${user.role}/${user._id}`, formValues, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        // Navigate to profile page
        navigate("/profile");
      }
    } catch (error) {
      const errorDescription =
        error.response?.data?.message || "An error occurred";
      setErrorMessage(errorDescription);
    }
  };
  const isPlaceholderVisible = formValues.description === "";

  return (
    <div className="editProfilPage">
      <div className="editProfilWrapper">
        <h2 className="pageTitle">Edit Profile</h2>
        {errorMessage && <p className="errorMessage">{errorMessage}</p>}

        <form onSubmit={handleSubmit} className="editSpacer">
          <div className="editAvatar">
            {formValues.image && (
              <div>
                <img
                  src={formValues.image}
                  alt="Uploaded Avatar"
                  className="profilEditCard"
                />
              </div>
            )}
            <div className="profilEditButtonsSmall">
              <input
                type="file"
                accept="image/png, image/jpg, image/jpeg, image/gif, image/webm"
                onChange={handleAvatarChange}
                className="hidden-file-input"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="button buttonPrimarySmall buttonFontReverse buttonFont"
              >
                Upload new picture
              </label>
              <button className="button buttonSecondarySmall buttonFont">
                Remove
              </button>
            </div>
          </div>
          <div className="inputBoxWrapper">
            <div className="inputBox">
              <label htmlFor="name" className="label secondaryColor">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                className="body inputFrame"
                placeholder="Your name"
              />
            </div>

            {user.role === "creators" && (
              <>
                <div className="inputBox">
                  <label htmlFor="description" className="label secondaryColor">
                    Description:
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formValues.description}
                    onChange={handleInputChange}
                    className={`body inputFrame ${
                      isPlaceholderVisible ? "secondaryColor" : ""
                    }`}
                    placeholder="Some words about you..."
                  />
                </div>
                <div className="inputBox">
                  <label htmlFor="category" className="label secondaryColor">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formValues.category}
                    onChange={handleInputChange}
                    className="body inputFrame"
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
            <div className="inputBox">
              <label className="label secondaryColor">Website:</label>
              {formValues.socialMedia.map((link, index) => (
                <div key={index}>
                  <input
                    type="text"
                    rows="1"
                    value={link}
                    onChange={(e) =>
                      handleSocialMediaChange(index, e.target.value)
                    }
                    className={`body inputFrame website ${
                      isPlaceholderVisible ? "secondaryColor" : ""
                    }`}
                    placeholder="Link your Website"
                  />
                </div>
              ))}
            </div>
            <div className="inputBox">
              <label htmlFor="oldPassword" className="label secondaryColor">
                Old Password:
              </label>
              <input
                type="password"
                id="oldPassword"
                name="oldPassword"
                value={formValues.oldPassword}
                onChange={handleInputChange}
                className="body inputFrame"
                placeholder="*****"
              />
            </div>
            <div className="inputBox">
              <label htmlFor="newPassword" className="label secondaryColor">
                New Password:
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formValues.newPassword}
                onChange={handleInputChange}
                className="body inputFrame"
                placeholder="*****"
              />
            </div>
          </div>
        </form>
      </div>
      <div className="profilEditButtonsSmall profilEditButtonsLarge">
        <button
          type=""
          className="button buttonSecondaryLarge buttonFont"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          type="submit"
          className="button buttonPrimaryLarge buttonFontReverse buttonFont"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default ProfileEditPage;
