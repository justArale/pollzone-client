import React from "react";
import "../components/HomePage.css";

function HomePage() {
  return (
    <div className="homePageWrapper">
      <div className="cover"></div>
      <h1 className="headerDescription">
        Simple polls to engage with your commuity
      </h1>
      <div className="boxWrapper">
        <div className="box">
          <h3 className="boxHeader">For Creators</h3>
          <p className="boxDescription">
            As a creator you can engage with your audience and make them
            participate in your decisions.
          </p>
          <div></div>
          <button className="button buttonLarge">Create a poll</button>
        </div>

        <div className="box">
          <h3 className="boxHeader">For Fans</h3>
          <p className="boxDescription">
            As a fan you can be an active part in the process of creators and
            projects you like.
          </p>
          <div></div>
          <button className="button buttonLarge">Start Voting</button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
