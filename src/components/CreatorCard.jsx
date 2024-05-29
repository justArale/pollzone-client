import React from "react";
import { Link } from "react-router-dom";
import "./CreatorCard.css";

function CreatorCard({ currentProject }) {
  const startDate = new Date(currentProject.startDate);
  const endDate = new Date(
    startDate.getTime() + currentProject.timeCount * 3600000
  );

  function formatDate(date) {
    const options = {
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  }

  function formatTime(date) {
    // Get the time in 12-hour format with AM/PM
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  return (
    <div className="creatorCard">
      <img src={currentProject.creator.image} className="profilImageCard" />
      <div className="projectCreatorHeader">
        <h3 className="creatorHeader">
          <span className="spanElementCreator">By</span>
          <Link
            to={`/creators/${currentProject.creator._id}`}
            className="creatorName"
          >
            {currentProject.creator?.name}
          </Link>
        </h3>
        <p className="projectEndInfo">
          <span className="spanElementProjectEnd">Until</span>
          {formatDate(endDate)}
          <span className="spanElementProjectEnd">at</span>
          {formatTime(endDate)}
        </p>
      </div>
    </div>
  );
}

export default CreatorCard;
