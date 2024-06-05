import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import AllProjectsPage from "./pages/AllProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import AllCreatorsPage from "./pages/AllCreatorsPage";
import CreatorDetailPage from "./pages/CreatorDetailPage";
import UserProfilPage from "./pages/profile/UserProfilPage";
import ProfileEditPage from "./pages/profile/ProfileEditPage";
import DashboardPage from "./pages/DashboardPage";
import CreateProjectPage from "./pages/creatorfeatures/CreateProjectPage";
import EditProjectPage from "./pages/creatorfeatures/EditProjectPage";
import ErrorPage from "./pages/ErrorPage";

import IsPrivate from "./components/IsPrivate";
import IsAnon from "./components/IsAnon";

import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import Footer from "./components/Footer";

function App() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const handleLoginClick = () => {
    setIsLogin(true);
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
  };

  return (
    <div className="page">
      <Navbar
        isOverlayOpen={isOverlayOpen}
        handleLoginClick={handleLoginClick}
        handleCloseOverlay={handleCloseOverlay}
        isLogin={isLogin}
        setIsLogin={setIsLogin}
      />
      <div>
        <ToastContainer />
        <Routes>
          <Route
            path="/"
            element={<HomePage handleLoginClick={handleLoginClick} />}
          />
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
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
