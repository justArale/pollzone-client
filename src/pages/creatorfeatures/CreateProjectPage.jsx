import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/auth.context";
import "../../components/CreateNewProject.css";
import deleteIcon from "../../assets/icons/delete.svg";
import addIcon from "../../assets/icons/add.svg";

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

      // Step 1: Create the project
      const projectResponse = await axios.post(
        `${API_URL}/api/creators/${currentUser._id}/projects`,
        {
          title: formValues.title,
          description: formValues.description,
          image: formValues.image,
          creator: formValues.creator,
          timeCount: formValues.timeCount,
          startDate: utcStartDate,
          inProgress: formValues.inProgress,
        },
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );

      const projectId = projectResponse.data._id;

      // Step 2: Create options and associate them with the project
      await Promise.all(
        formValues.options.map((option) =>
          axios.post(
            `${API_URL}/api/creators/${formValues.creator}/projects/${projectId}/options`,
            {
              title: option.title,
              description: option.description,
              image: option.image, // Include the image URL
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
      const errorDescription =
        error.response?.data?.message || "An error occurred";
      setErrorMessage(errorDescription);
    }
  };

  return (
    <div className="containerCreatePage">
      <h2 className="headlineCreateProject">New Project</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="formGroup">
          <label htmlFor="title" className="label">
            Title
          </label>
          <input
            type="text"
            placeholder="    My poll / collection / voting is called..."
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
            placeholder="    What do you want people to know about your poll?"
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
            placeholder="    What should be the front Image of your poll?"
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
                placeholder="    Option Title"
                value={option.title}
                onChange={(e) =>
                  handleOptionChange(index, "title", e.target.value)
                }
                required
                className="input"
              />
              <input
                type="text"
                placeholder="    Option Image URL"
                value={option.image}
                onChange={(e) =>
                  handleOptionChange(index, "image", e.target.value)
                }
                className="input"
              />
              <textarea
                placeholder="    Option Description"
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
                  className="button buttonSmall buttonDelete removeButton"
                  onClick={() => removeOption(index)}
                >
                  <img src={deleteIcon} alt="-" className="addIcon"/>
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
          <div >
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
            Create Project
          </button>
        </div>
      </form>
      {errorMessage && <div className="errorMessage">{errorMessage}</div>}
    </div>
  );
}

export default CreateProjectPage;
