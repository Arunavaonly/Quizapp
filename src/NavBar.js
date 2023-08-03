import React from "react";
import star from "./star.png";
import "@fontsource/ubuntu/500.css"; // Specify weight
import "@fontsource/ubuntu/700.css"; // Specify weight

export default function NavBar(prop) {
  return (
    <div className="nav">
      <div className="left-content">
        <button className="refresh" type="button" onClick={() => window.location.reload()}>
          New Quiz
        </button>
        <p className="level">
          <img className="star" src={star} alt="star" />
          <strong>Level {prop.level}</strong>
        </p>
      </div>
      <div className="right-content">
        <p className="info">
          <strong>
            Difficulty: {prop.difficulty} | Question Type: {prop.type}
          </strong>
        </p>
      </div>
    </div>
  );
}
