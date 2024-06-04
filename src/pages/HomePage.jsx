import React from "react";
import "../components/HomePage.css";

function HomePage({ handleLoginClick }) {
  return (
    <div className="homePageWrapper">
      <div className="cover"></div>
      <h1 className="headerDescription pageTitle">
        Simple polls to engage with your community
      </h1>
      <div className="boxWrapper">
        <div className="box">
          <h3 className="sectionTitle">For Creators</h3>
          <p className="bodyLarge secondaryColor">
            As a creator you can engage with your audience and make them
            participate in your decisions.
          </p>
          <div></div>
          <button
            className="button buttonPrimaryLarge buttonFont buttonFontReverse"
            onClick={handleLoginClick}
          >
            Create a poll
          </button>
        </div>

        <div className="box">
          <h3 className="sectionTitle">For Fans</h3>
          <p className="bodyLarge secondaryColor">
            As a fan you can be an active part in the process of creators and
            projects you like.
          </p>
          <div></div>
          <button
            className="button buttonPrimaryLarge buttonFont buttonFontReverse"
            onClick={handleLoginClick}
          >
            Start Voting
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
