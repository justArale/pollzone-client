import React from "react";

function Footer() {
  return (
    <div className="footer">
      <h2 className="bodyLink">
        <span className="primaryColor">PollZone</span> made by{" "}
        <a href="https://github.com/justArale" target="_blank">
          {" "}
          <span className="primaryColor">Arale </span>
        </a>
        &{" "}
        <a href="https://github.com/annagy07" target="_blank">
          <span className="primaryColor">Annagy</span>
        </a>
      </h2>
    </div>
  );
}

export default Footer;
