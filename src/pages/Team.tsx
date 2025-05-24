import "../styles//Team.css";

const Team = () => {
  return (
    <section id="team" className="team-section">
      <div className="container">
        <h2 className="section-title">Our Team</h2>
        
        {/* Organizational Chart Structure */}
        <div className="org-chart">
          {/* Top Level - Chairperson */}
          <div className="chart-level level-1">
            <div className="member-card chairperson">
              <div className="member-image">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format" 
                  alt="John Doe"
                  className="avatar-image"
                />
              </div>
              <div className="member-info">
                <h3 className="member-name">John Doe</h3>
                <p className="member-role">Chairperson</p>
                <div className="member-details">
                  <span className="department">Executive</span>
                </div>
              </div>
            </div>
          </div>

          {/* Connection Line */}
          <div className="connection-line vertical-line"></div>
          <div className="connection-hub"></div>
          <div className="connection-line horizontal-line"></div>

          {/* Second Level - Secretary & Treasurer */}
          <div className="chart-level level-2">
            <div className="member-card secretary">
              <div className="member-image">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format" 
                  alt="John Smith"
                  className="avatar-image"
                />
              </div>
              <div className="member-info">
                <h3 className="member-name">John Smith</h3>
                <p className="member-role">Secretary</p>
                <div className="member-details">
                  <span className="department">Operations</span>
                </div>
              </div>
            </div>

            <div className="member-card treasurer">
              <div className="member-image">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format" 
                  alt="Mary Johnson"
                  className="avatar-image"
                />
              </div>
              <div className="member-info">
                <h3 className="member-name">Mary Johnson</h3>
                <p className="member-role">Treasurer</p>
                <div className="member-details">
                  <span className="department">Finance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;