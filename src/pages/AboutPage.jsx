import React from "react";
import "../components/AboutPage.css";

function AboutPage() {
  return (
    <div className="container">
      <h1 >About PollZone</h1>
      <p className="aboutPara">
        Welcome to PollZone! Our platform allows creators to launch their
        polls, collections or projects and let fans decide which options should be elected or
        implemented.
      </p>
      <h2 >For Fans</h2>
      <p className="aboutPara">
        As a fan, you can explore various projects, vote on your favorite
        options, and see a personalized dashboard with the polls and creators you’ve
        interacted with.
      </p>
      <h2>For Creators</h2>
      <p className="aboutPara">
        As a creator, you can create polls with multiple options, set voting
        timers, and view details on voting patterns. Your dashboard will show your active and completed projects,
        giving you all the tools you need to succeed.
      </p>
      <h2>Explore and Join Us!</h2>
      <p className="aboutPara">
        Feel free to explore different projects and creators to get a feel for
        our community. When you’re ready, sign up to get full access to all
        features.
      </p>
    </div>
  );
}

export default AboutPage;
