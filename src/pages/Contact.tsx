import React, { useState } from 'react';
import { Send, Mail, User, MessageCircle, CheckCircle } from 'lucide-react';
import '../styles/Contact.css';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
      }, 3000);
    }, 1500);
  };

  return (
    <section id="contact" className="contact-section">
      {/* Background decorative elements */}
      <div className="background-decorations">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
      </div>

      <div className="contact-container">
        {/* Header Section */}
        <div className="contact-header">
          <h2 className="contact-title">Get In Touch</h2>
          <p className="contact-subtitle">
            Have a project in mind? Let's collaborate and bring your ideas to life. 
            We'd love to hear from you and discuss how we can help.
          </p>
        </div>

        <div className="contact-content">
          {/* Contact Info Cards */}
          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon mail-icon">
                <Mail className="icon" />
              </div>
              <h3 className="info-title">Email Us</h3>
              <p className="info-text">willardjohn12345@gmail.com</p>
            </div>

            <div className="info-card">
              <div className="info-icon response-icon">
                <MessageCircle className="icon" />
              </div>
              <h3 className="info-title">Quick Response</h3>
              <p className="info-text">We typically respond within 24 hours</p>
            </div>

            <div className="info-card">
              <div className="info-icon personal-icon">
                <User className="icon" />
              </div>
              <h3 className="info-title">Personal Touch</h3>
              <p className="info-text">Every message gets our personal attention</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="form-container">
            <div className="form-card">
              <div className="form-background"></div>
              
              <div className="form-content">
                {!isSubmitted ? (
                  <div className="contact-form">
                    <div className="form-row">
                      <div className="input-group">
                        <User className="input-icon" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your Name"
                          required
                          className="form-input"
                        />
                      </div>
                      
                      <div className="input-group">
                        <Mail className="input-icon" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Your Email"
                          required
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="input-group textarea-group">
                      <MessageCircle className="textarea-icon" />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us about your project or ask us anything..."
                        rows={6}
                        required
                        className="form-textarea"
                      />
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="submit-button"
                    >
                      {isLoading ? (
                        <>
                          <div className="loading-spinner"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="send-icon" />
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="success-message">
                    <div className="success-icon">
                      <CheckCircle className="check-icon" />
                    </div>
                    <h3 className="success-title">Message Sent!</h3>
                    <p className="success-text">
                      Thank you for reaching out. We'll get back to you soon!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;