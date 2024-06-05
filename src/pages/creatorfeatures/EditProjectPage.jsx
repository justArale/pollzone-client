import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/auth.context";
import "../../components/editCreateProject.css";
import deleteIcon from "../../assets/icons/delete.svg";
import addIcon from "../../assets/icons/add.svg";
import selectIcon from "../../assets/icons/select.svg";
import fileUploadService from "../../service/file-upload.service";

const API_URL = import.meta.env.VITE_API_URL;

const DEFAULT_PROJECT_FORM_VALUES = {
  title: "",
  description: "",
  image: "",
  options: [{ _id: "", title: "", image: "", description: "" }],
  creator: "",
  timeCount: 1,
  startDate: "",
  inProgress: false,
};

function EditProjectPage() {
  const { user } = useContext(AuthContext);
  const { creatorId, projectId } = useParams();
  const [formValues, setFormValues] = useState(DEFAULT_PROJECT_FORM_VALUES);
  const [errorMessage, setErrorMessage] = useState("");
  const [optionsToDelete, setOptionsToDelete] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role && user._id) {
      fetchProjectData();
    }
  }, [user]);

  const fetchProjectData = async () => {
    const storedToken = localStorage.getItem("authToken");
    try {
      const response = await axios.get(
        `${API_URL}/api/creators/${creatorId}/projects/${projectId}?populate=options`,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );
      const projectData = response.data;
      setFormValues((prevValues) => ({
        ...prevValues,
        ...projectData,
        startDate: new Date(projectData.startDate).toISOString().slice(0, 16),
        options: projectData.options.length
          ? projectData.options
          : [{ _id: "", title: "", image: "", description: "" }],
      }));
    } catch (error) {
      const errorDescription =
        error.response?.data?.message || "An error occurred";
      setErrorMessage(errorDescription);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleUploadOptionImage = async (file) => {
    try {
      setLoading(true);
      const fileUrl = await fileUploadService.uploadPollOptionImage(file);
      setLoading(false);
      return fileUrl;
    } catch (error) {
      console.error("Error uploading option image:", error);
      setLoading(false);
    }
  };

  const handleOptionImageChange = (index, file) => {
    if (file) {
      handleUploadOptionImage(file).then((fileUrl) => {
        const newOptions = [...formValues.options];
        newOptions[index].image = fileUrl;
        setFormValues((prevValues) => ({
          ...prevValues,
          options: newOptions,
        }));
      });
    }
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...formValues.options];
    newOptions[index] = {
      ...newOptions[index],
      [field]: value,
    };
    setFormValues((prevValues) => ({
      ...prevValues,
      options: newOptions,
    }));
  };

  const addOption = () => {
    setFormValues((prevValues) => ({
      ...prevValues,
      options: [
        ...prevValues.options,
        { _id: "", title: "", image: "", description: "" },
      ],
    }));
  };

  const removeOption = (index) => {
    const optionId = formValues.options[index]._id;
    if (optionId) {
      setOptionsToDelete((prevOptions) => [...prevOptions, optionId]);
    }
    const newOptions = formValues.options.filter((_, i) => i !== index);
    setFormValues((prevValues) => ({
      ...prevValues,
      options: newOptions,
    }));
  };

  const deleteOptions = async () => {
    const storedToken = localStorage.getItem("authToken");
    const deletePromises = optionsToDelete.map((optionId) =>
      axios.delete(
        `${API_URL}/api/creators/${creatorId}/projects/${projectId}/options/${optionId}`,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      )
    );
    await Promise.all(deletePromises);
  };

  const updateOptions = async () => {
    const storedToken = localStorage.getItem("authToken");
    const updatePromises = formValues.options.map(async (option) => {
      if (option._id) {
        return axios.put(
          `${API_URL}/api/creators/${creatorId}/projects/${projectId}/options/${option._id}`,
          option,
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        );
      } else {
        const newOptionResponse = await axios.post(
          `${API_URL}/api/creators/${creatorId}/projects/${projectId}/options`,
          option,
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        );
        option._id = newOptionResponse.data._id;
        return newOptionResponse;
      }
    });
    await Promise.all(updatePromises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedToken = localStorage.getItem("authToken");
    try {
      const localStartDate = new Date(formValues.startDate);
      const utcStartDate = localStartDate.toISOString();
      await deleteOptions();
      await updateOptions();
      await axios.put(
        `${API_URL}/api/creators/${creatorId}/projects/${projectId}`,
        {
          ...formValues,
          startDate: utcStartDate,
          options: formValues.options.map((option) => option._id),
        },
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );
      navigate(`/projects/${creatorId}/${projectId}`, {
        state: { refresh: true },
      });
    } catch (error) {
      const errorDescription =
        error.response?.data?.message || "An error occurred";
      setErrorMessage(errorDescription);
    }
  };

  const isPlaceholderVisible = formValues.description === "";

  return (
    <div className="">
      <form onSubmit={handleSubmit} className="">
        <div className="containerCreatePage">
          <div className="editProfilWrapper">
            <h2 className="pageTitle">Update Project</h2>
            <div className="inputBox">
              <label htmlFor="title" className="label secondaryColor">
                Title
              </label>
              <input
                type="text"
                placeholder="My new poll ..."
                id="title"
                name="title"
                value={formValues.title}
                onChange={handleInputChange}
                required
                className={`body inputFrame ${
                  isPlaceholderVisible ? "secondaryColor" : ""
                }`}
              />
            </div>
            <div className="inputBox">
              <label htmlFor="description" className="label secondaryColor">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Why are you asking this ..."
                value={formValues.description}
                onChange={handleInputChange}
                required
                className={`body inputFrame ${
                  isPlaceholderVisible ? "secondaryColor" : ""
                }`}
              />
            </div>
            <div className="inputBox">
              <label htmlFor="timeCount" className="label secondaryColor">
                Time to vote
              </label>
              <div className="numberInputWrapper">
                <input
                  type="number"
                  id="timeCount"
                  name="timeCount"
                  value={formValues.timeCount}
                  onChange={handleInputChange}
                  min="1"
                  required
                  className="body inputFrame "
                />
                <img
                  src={selectIcon}
                  alt="-"
                  className="selectIcon"
                  // onClick={handleIconClick}
                />
              </div>
            </div>
          </div>

          <div className="optionInputBoxWrapper">
            <h3 className="sectionTitle">Voting Options</h3>

            <div className="optionBoxWrapper">
              {formValues.options.map((option, index) => (
                <div key={index} className="optionBox">
                  <div className="optionInputBox">
                    <label
                      htmlFor={`title-${index}`}
                      className="label secondaryColor"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="Option Title"
                      value={option.title}
                      onChange={(e) =>
                        handleOptionChange(index, "title", e.target.value)
                      }
                      required
                      className={`body inputFrame optionInput ${
                        isPlaceholderVisible ? "secondaryColor" : ""
                      }`}
                    />
                  </div>
                  <div className="optionInputBox">
                    <label
                      htmlFor={`description-${index}`}
                      className="label secondaryColor"
                    >
                      Description
                    </label>
                    <textarea
                      placeholder="Option Description"
                      value={option.description}
                      onChange={(e) =>
                        handleOptionChange(index, "description", e.target.value)
                      }
                      required
                      className={`body inputFrame optionInput ${
                        isPlaceholderVisible ? "secondaryColor" : ""
                      }`}
                    />
                  </div>
                  <div className="optionInputBox">
                    <label
                      htmlFor={`image-${index}`}
                      className="label secondaryColor"
                    >
                      Image (optional)
                    </label>
                    <div className="optionImageBox contentAligner">
                      <div className="editAvatar">
                        <div className="optionImageContainer">
                          {option.image ? (
                            <div>
                              <img
                                src={option.image}
                                alt="Uploaded Image"
                                className="optionImageCard"
                              />
                            </div>
                          ) : (
                            <div className="optionImageCard"></div>
                          )}
                        </div>
                        <div className="profilEditButtonsSmall">
                          <input
                            type="file"
                            onChange={(e) =>
                              handleOptionImageChange(index, e.target.files[0])
                            }
                            className="hidden-file-input"
                            id={`file-upload-${index}`}
                          />
                          <label
                            htmlFor={`file-upload-${index}`}
                            className="button buttonPrimarySmall buttonFontReverse buttonFont"
                          >
                            Upload Image
                          </label>
                          <button
                            type="button"
                            className="button buttonSecondarySmall buttonFont"
                            onClick={() => handleOptionImageChange(index, null)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="buttonContainer">
                    <button
                      type="button"
                      className="button awareButtonSmall buttonFont buttonFontReverse"
                      onClick={() => removeOption(index)}
                    >
                      <img src={deleteIcon} alt="-" className="addIcon" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <button
                type="button"
                onClick={addOption}
                className="button buttonPrimarySmall buttonFontReverse buttonFont"
              >
                <img src={addIcon} alt="+" className="addIcon" />
                <span>Add Option</span>
              </button>
            </div>
          </div>
          <div className="alignWidth">
            <h3 className="sectionTitle">Schedule Voting</h3>
            <div className="inputBox">
              <label htmlFor="startDate" className="label secondaryColor">
                When should your voting start?
              </label>
              <input
                type="datetime-local"
                id="startDate"
                name="startDate"
                value={formValues.startDate}
                onChange={handleInputChange}
                required
                className={`body inputFrame  ${
                  isPlaceholderVisible ? "secondaryColor" : ""
                }`}
              />
            </div>
          </div>

          <div className="profilEditButtonsSmall profilEditButtonsLarge">
            <button
              type="submit"
              className="button buttonPrimaryLarge buttonFontReverse buttonFont"
            >
              Update Project
            </button>
          </div>
        </div>
      </form>
      {errorMessage && <div className="errorMessage">{errorMessage}</div>}
    </div>
  );
}

export default EditProjectPage;
