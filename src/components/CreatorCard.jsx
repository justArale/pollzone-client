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
    const formattedDate = date.toLocaleDateString("en-US", options);

    // Get the day with the suffix
    const day = date.getDate();
    const suffix =
      day === 1 || day === 21 || day === 31
        ? "st"
        : day === 2 || day === 22
        ? "nd"
        : day === 3 || day === 23
        ? "rd"
        : "th";

    return `${formattedDate} ${day}${suffix}, ${date.getFullYear()}`;
  }

  function formatTime(date) {
    // Get the time in 12h format with AM/PM
    const time = date.toLocaleDateString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${time}`;
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
