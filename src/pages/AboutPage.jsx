import React from "react";
import "../components/AboutPage.css";

function AboutPage() {
  return (
    <div className="voteDetails">
      <h1 className="font40Bold">About PollZone</h1>
      <div className="aboutDescription">
        <p className="projectDescription">
          Welcome to PollZone! Our platform allows creators to launch their
          polls, collections, or projects and let fans decide which options
          should be elected or implemented.
        </p>
      </div>
      <div className="optionsContainer ">
        <div className=" aboutCard optionInfoBox">
          <h2 className="font24bold optionTitle">Our Journey</h2>
          <p className="projectDescription">
            PollZone is the brainchild of{" "}
            <a
              target="_blank"
              href="https://www.linkedin.com/in/anna-hartkopf/"
            >
              Annagy
            </a>{" "}
            and{" "}
            <a
              target="_blank"
              href="https://www.linkedin.com/in/s-kuechler-jr-fullstack-dev/"
            >
              Arale
            </a>
            , a culmination of not just our third project together, but our
            capstone project. We aimed to create a platform that would enable
            creators to interact and connect more effectively with their fans.
          </p>
        </div>
        <div className=" aboutCard optionInfoBox">
          <h2 className="font24bold optionTitle">Explore and Join Us!</h2>
          <p className="projectDescription">
            Feel free to explore different projects and creators to get a feel
            for our community. When you’re ready, sign up to get full access to
            all features.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
