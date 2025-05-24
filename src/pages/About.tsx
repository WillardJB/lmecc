import "../styles/About.css";

const About = () => {
  return (
    <section id="about" className="about-section" data-aos="fade-up">
      <div className="about-container">
        <div className="about-header">
          <h2 className="about-title">About Lingayen Municipal Employees Credit Cooperative</h2>
          <div className="title-underline"></div>
        </div>
        
        <div className="mission-vision-section">
          <div className="mission-vision-cards">
            <div className="about-text-card mission-card">
              <div className="card-inner">
                <div className="mission-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
                    <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"/>
                  </svg>
                </div>
                <h3 className="card-title">Our Mission</h3>
                <p className="card-text">
                  Lingayen Municipal Employees Credit Cooperative (LMECC) is dedicated to providing
                  excellent financial services to our members, promoting savings and responsible loans.
                  We foster community growth through education and support.
                </p>
                <div className="features-list">
                  <div className="feature-item">
                    <span className="feature-dot mission-dot"></span>
                    <span>Excellent Financial Services</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-dot mission-dot"></span>
                    <span>Promote Savings & Responsible Loans</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-dot mission-dot"></span>
                    <span>Community Growth & Education</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="about-text-card vision-card">
              <div className="card-inner">
                <div className="vision-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                </div>
                <h3 className="card-title">Our Vision</h3>
                <p className="card-text">
                  To be the leading credit cooperative in Pangasinan, empowering every member
                  with innovative financial solutions and fostering a prosperous, financially
                  literate community that thrives through mutual cooperation and shared success.
                </p>
                <div className="features-list">
                  <div className="feature-item">
                    <span className="feature-dot vision-dot"></span>
                    <span>Leading Credit Cooperative in Pangasinan</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-dot vision-dot"></span>
                    <span>Innovative Financial Solutions</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-dot vision-dot"></span>
                    <span>Financially Literate Community</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="about-content">
          
          <div className="about-image-card">
            <div className="image-frame">
              <img
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80"
                alt="LMECC Office"
                className="about-img"
              />
              <div className="image-overlay">
                <div className="overlay-content">
                  <h4>LMECC Office</h4>
                  <p>Serving our community with pride</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-number">500+</div>
            <div className="stat-label">Active Members</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">15+</div>
            <div className="stat-label">Years of Service</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">₱50M+</div>
            <div className="stat-label">Total Assets</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;