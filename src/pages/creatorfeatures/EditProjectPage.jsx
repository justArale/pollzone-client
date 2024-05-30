import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/auth.context";
import "../../components/EditProjectPage.css"; // Import the CSS file
import deleteIcon from "../../assets/icons/delete.svg";
import addIcon from "../../assets/icons/add.svg";

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

  return (
    <div className="containerCreatePage">
      <h2 className="headlineCreateProject">Edit Project</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="formGroup">
          <label htmlFor="title" className="label">
            What's your project's name?
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formValues.title}
            onChange={handleInputChange}
            required
            className="input"
          />
        </div>
        <div className="formGroup">
          <label htmlFor="description" className="label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formValues.description}
            onChange={handleInputChange}
            required
            className="textarea"
          />
        </div>
        <div className="formGroup">
          <label htmlFor="image" className="label">
            Image URL
          </label>
          <input
            type="text"
            id="image"
            name="image"
            value={formValues.image}
            onChange={handleInputChange}
            className="input"
          />
        </div>
        <h3>Voting Options</h3>
        <div className="formGroup">
          <label className="label">
            You can add as many options as you like:
          </label>
          {formValues.options.map((option, index) => (
            <div key={index} className="optionGroup">
              <input
                type="text"
                placeholder="Option Title"
                value={option.title}
                onChange={(e) =>
                  handleOptionChange(index, "title", e.target.value)
                }
                required
                className="input"
              />
              <input
                type="text"
                placeholder="Option Image URL"
                value={option.image}
                onChange={(e) =>
                  handleOptionChange(index, "image", e.target.value)
                }
                className="input"
              />
              <textarea
                placeholder="Option Description"
                value={option.description}
                onChange={(e) =>
                  handleOptionChange(index, "description", e.target.value)
                }
                required
                className="textarea"
              />
              <div className="buttonContainer">
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="button buttonSmall buttonDelete removeButton"
                >
                  <img src={deleteIcon} alt="-" className="addIcon" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
          <div>
            <button
              type="button"
              onClick={addOption}
              className="button buttonSmall addButton"
            >
              <img src={addIcon} alt="+" className="addIcon" />
              <span>Add Option</span>
            </button>
          </div>
        </div>
        <h3>Schedule Voting</h3>
        <div className="formGroup">
          <label htmlFor="timeCount" className="label">
            For how long can your fans vote? (in hours)
          </label>
          <input
            type="number"
            id="timeCount"
            name="timeCount"
            value={formValues.timeCount}
            onChange={handleInputChange}
            min="1"
            required
            className="input"
          />
        </div>
        <div className="formGroup">
          <label htmlFor="startDate" className="label">
            When should your voting start?
          </label>
          <input
            type="datetime-local"
            id="startDate"
            name="startDate"
            value={formValues.startDate}
            onChange={handleInputChange}
            required
            className="input"
          />
        </div>
        <div className="submitButton">
          <button type="submit" className="button buttonLarge">
            Update Project
          </button>
        </div>
      </form>
      {errorMessage && <div className="errorMessage">{errorMessage}</div>}
    </div>
  );
}

export default EditProjectPage;
