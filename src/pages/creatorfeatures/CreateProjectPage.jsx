import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/auth.context";

const API_URL = import.meta.env.VITE_API_URL;

const DEFAULT_PROJECT_FORM_VALUES = {
  title: "",
  description: "",
  image: "",
  options: [{ title: "", image: "", description: "" }],
  creator: "",
  timeCount: 1,
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
    console.log("Updated options:", newOptions); // Debugging statement
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
    console.log("Form values on submit:", formValues); // Debugging statement

    try {
      // Step 1: Create the project
      const projectResponse = await axios.post(
        `${API_URL}/api/creators/${currentUser._id}/projects`,
        {
          title: formValues.title,
          description: formValues.description,
          image: formValues.image,
          creator: formValues.creator,
          timeCount: formValues.timeCount,
          inProgress: formValues.inProgress,
        },
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );

      const projectId = projectResponse.data._id;
      console.log("Project created:", projectResponse.data);

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
      console.error("Error details:", error.response || error);
      const errorDescription =
        error.response?.data?.message || "An error occurred";
      setErrorMessage(errorDescription);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Create Project</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="title" style={styles.label}>
            What's your new project's name?
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formValues.title}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="description" style={styles.label}>
            How would you describe it?
          </label>
          <textarea
            id="description"
            name="description"
            value={formValues.description}
            onChange={handleInputChange}
            required
            style={styles.textarea}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="image" style={styles.label}>
            Here, you can paste the URL to a header image:
          </label>
          <input
            type="text"
            id="image"
            name="image"
            value={formValues.image}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>
        <h3>Voting Options</h3>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Here, you can add as many options as you like:
          </label>
          {formValues.options.map((option, index) => (
            <div key={index} style={styles.optionGroup}>
              <input
                type="text"
                placeholder="Option Title"
                value={option.title}
                onChange={(e) =>
                  handleOptionChange(index, "title", e.target.value)
                }
                required
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Option Image URL"
                value={option.image}
                onChange={(e) =>
                  handleOptionChange(index, "image", e.target.value)
                }
                style={styles.input}
              />
              <textarea
                placeholder="Option Description"
                value={option.description}
                onChange={(e) =>
                  handleOptionChange(index, "description", e.target.value)
                }
                required
                style={styles.textarea}
              />
              <button
                type="button"
                onClick={() => removeOption(index)}
                style={styles.removeButton}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addOption} style={styles.addButton}>
            Add Option
          </button>
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="timeCount" style={styles.label}>
            For how long can your fans vote? (in days)
          </label>
          <select
            id="timeCount"
            name="timeCount"
            value={formValues.timeCount}
            onChange={handleInputChange}
            style={styles.input}
          >
            {[1, 2, 3, 5, 7, 14, 21, 28].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            <input
              type="checkbox"
              name="inProgress"
              checked={formValues.inProgress}
              onChange={(e) =>
                setFormValues((prevValues) => ({
                  ...prevValues,
                  inProgress: e.target.checked,
                }))
              }
              style={styles.checkbox}
            />
            Release immediately after creating
          </label>
        </div>
        <button type="submit" style={styles.submitButton}>
          Create Project
        </button>
      </form>
      {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    marginBottom: "5px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "8px",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "8px",
    boxSizing: "border-box",
    minHeight: "100px",
  },
  optionGroup: {
    marginBottom: "15px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  addButton: {
    padding: "10px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  removeButton: {
    padding: "10px",
    backgroundColor: "grey",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  submitButton: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  errorMessage: {
    color: "red",
    marginTop: "10px",
  },
  checkbox: {
    marginRight: "5px",
  },
};

export default CreateProjectPage;
