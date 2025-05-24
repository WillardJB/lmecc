import React from "react";
import "../styles/Team.css";

const Team: React.FC = () => {
  return (
    <section id="team" className="section team-section">
      <h2>Our Team</h2>
      <div className="team-members">
        <div className="member-card">
          <img src="/placeholder.jpg" alt="Chairperson" />
          <h3>Jane Doe</h3>
          <p>Chairperson</p>
        </div>
        <div className="member-card">
          <img src="/placeholder.jpg" alt="Secretary" />
          <h3>John Smith</h3>
          <p>Secretary</p>
        </div>
        <div className="member-card">
          <img src="/placeholder.jpg" alt="Treasurer" />
          <h3>Mary Johnson</h3>
          <p>Treasurer</p>
        </div>
      </div>
    </section>
  );
};

export default Team;
