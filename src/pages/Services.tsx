
import "../styles/Services.css";

const services = [
  { title: "Loan Assistance", description: "Helping you with affordable loans." },
  { title: "Savings Program", description: "Secure and grow your savings." },
  { title: "Financial Literacy", description: "Workshops and seminars." },
  { title: "Emergency Loans", description: "Quick support in urgent times." },
];

const Services = () => {
  return (
    <section id="services" className="services-section" data-aos="fade-up">
      <h2>Our Services</h2>
      <div className="services-list">
        {services.map((service, index) => (
          <div key={index} className="service-card">
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
