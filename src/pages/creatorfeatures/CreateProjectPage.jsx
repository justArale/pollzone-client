import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
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
  options: [{ title: "", image: "", description: "" }],
  creator: "",
  timeCount: 1,
  startDate: "",
  inProgress: false,
};

function CreateProjectPage() {
  const { user } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState({});
  const [formValues, setFormValues] = useState(DEFAULT_PROJECT_FORM_VALUES);
  const [errorMessage, setErrorMessage] = useState("");
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
      setCurrentUser(response.data);
    } catch (error) {
      const errorDescription =
        error.response?.data?.message || "An error occurred";
      setErrorMessage(errorDescription);
    }
  };

  useEffect(() => {
    if (user && user.role && user._id) {
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    if (currentUser._id) {
      setFormValues((prevValues) => ({
        ...prevValues,
        creator: currentUser._id,
      }));
    }
  }, [currentUser]);

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
    } else {
      const newOptions = [...formValues.options];
      newOptions[index].image = "";
      setFormValues((prevValues) => ({
        ...prevValues,
        options: newOptions,
      }));
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
        { title: "", image: "", description: "" },
      ],
    }));
  };

  const removeOption = (index) => {
    const newOptions = formValues.options.filter((_, i) => i !== index);
    setFormValues((prevValues) => ({
      ...prevValues,
      options: newOptions,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedToken = localStorage.getItem("authToken");

    try {
      // Convert local start date and time to UTC
      const localStartDate = new Date(formValues.startDate);
      const utcStartDate = localStartDate.toISOString();

      // Calculate end date based on timeCount in days
      const endDate = new Date(localStartDate);
      console.log("Initial startDate:", localStartDate); // Debugging log
      console.log("timeCount in days:", formValues.timeCount); // Debugging log
      endDate.setDate(endDate.getDate() + formValues.timeCount);
      const utcEndDate = endDate.toISOString();
      console.log("Calculated endDate:", endDate); // Debugging log

      // Step 1: Create the project
      const projectResponse = await axios.post(
        `${API_URL}/api/creators/${currentUser._id}/projects`,
        {
          title: formValues.title,
          description: formValues.description,
          image: formValues.image,
          creator: formValues.creator,
          timeCount: formValues.timeCount, // keep it as days
          startDate: utcStartDate,
          endDate: utcEndDate, // include endDate if needed
          inProgress: formValues.inProgress,
        },
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );

      console.log("Project created successfully:", projectResponse.data); // Debugging log

      const projectId = projectResponse.data._id;

      // Step 2: Create options and associate them with the project
      await Promise.all(
        formValues.options.map((option) =>
          axios.post(
            `${API_URL}/api/creators/${formValues.creator}/projects/${projectId}/options`,
            {
              title: option.title,
              description: option.description,
              image: option.image,
            },
            {
              headers: { Authorization: `Bearer ${storedToken}` },
            }
          )
        )
      );

      // Step 3: Redirect to the dashboard or appropriate page
      navigate("/dashboard");
    } catch (error) {
      console.log("Error creating project or options:", error); // Debugging log
      const errorDescription =
        error.response?.data?.message || "An error occurred";
      setErrorMessage(errorDescription);
    }
  };

  const isPlaceholderVisible = formValues.description === "";

  return (
    <div>
      <form onSubmit={handleSubmit} className="">
        <div className="containerCreatePage">
          <div className="editProfilWrapper">
            <h2 className="pageTitle">New Project</h2>
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
          </div>

          <div className="optionInputBoxWrapper">
            <h3 className="sectionTitle">Voting Options</h3>

            <div className="optionBoxWrapper">
              {formValues.options.map((option, index) => (
                <div key={index} className="optionBox">
                  <div className="optionInputBox">
                    <label htmlFor="title" className="label secondaryColor">
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
                      htmlFor="description"
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
                    <label htmlFor="image" className="label secondaryColor">
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
                            accept="image/png, image/jpg, image/jpeg, image/gif, image/webm"
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
                      <img
                        src={deleteIcon}
                        alt="deleteIcon"
                        className="addIcon"
                      />
                      Remove
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
                <img src={addIcon} alt="addIcon" className="addIcon" />
                Add Option
              </button>
            </div>
          </div>
          <div className="editProfilWrapper">
            <h3 className="sectionTitle">Schedule Voting</h3>
            <div className="inputBox">
              <label htmlFor="timeCount" className="label secondaryColor">
                Time to vote (in hours)
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
                <img src={selectIcon} alt="-" className="selectIcon" />
              </div>
            </div>
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
            <button className="button buttonSecondaryLarge buttonFont buttenNoDrop">
              Save for later
            </button>
            <button
              type="submit"
              className="button buttonPrimaryLarge buttonFontReverse buttonFont"
            >
              Publish Project
            </button>
          </div>
        </div>
      </form>
      {errorMessage && <div className="errorMessage">{errorMessage}</div>}
    </div>
  );
}

export default CreateProjectPage;
