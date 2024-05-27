import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import AllProjectsPage from "./pages/AllProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import AllCreatorsPage from "./pages/AllCreatorsPage";
import CreatorDetailPage from "./pages/CreatorDetailPage";
import SignUpPage from "./pages/SignUpPage";
import LogInPage from "./pages/LogInPage";
import UserProfilPage from "./pages/profile/UserProfilPage";
import ProfileEditPage from "./pages/profile/ProfileEditPage";
import DashboardPage from "./pages/DashboardPage";
import CreateProjectPage from "./pages/creatorfeatures/CreateProjectPage";
import EditProjectPage from "./pages/creatorfeatures/EditProjectPage";

import IsPrivate from "./components/IsPrivate";
import IsAnon from "./components/IsAnon";

function App() {
  return (
    <>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<AllProjectsPage />} />
          <Route
            path="/projects/:creatorId/:projectId"
            element={<ProjectDetailPage />}
          />
          <Route
            path="/projects/:creatorId/:projectId/edit"
            element={<EditProjectPage />}
          />
          <Route path="/creators" element={<AllCreatorsPage />} />
          <Route path="/creators/:creatorId/" element={<CreatorDetailPage />} />
          <Route
            path="/login"
            element={
              <IsAnon>
                <LogInPage />
              </IsAnon>
            }
          />
          <Route
            path="/signup"
            element={
              <IsAnon>
                <SignUpPage />
              </IsAnon>
            }
          />
          <Route
            path="/profile"
            element={
              <IsPrivate>
                <UserProfilPage />
              </IsPrivate>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <IsPrivate>
                <ProfileEditPage />
              </IsPrivate>
            }
          />
          <Route path="/projects/create" element={<CreateProjectPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
