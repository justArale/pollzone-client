import React from "react";
import error from "../assets/images/404.png";
import "../components/ErrorPage.css";

function ErrorPage() {
  return (
    <div className="errorPage">
      <h1>Oops, Wrong Turn ...</h1>
      <img src={error} className="errorImage" />
      <p className="errorDescription">
        Looks like you've wandered off the beaten path. Our team is working to
        get you back on track and find what you're looking for.
      </p>
      <button className="button buttonLarge">Back To Home</button>
    </div>
  );
}

export default ErrorPage;
