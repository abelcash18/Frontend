import "./about.scss";

function About() {
  return (
    <div className="aboutPage">
      <div className="container">
        <h1>About Our Real Estate Service</h1>
        <p className="lead">
          We connect buyers, sellers and renters with quality properties across
          the region. Our mission is to make property search simple, transparent
          and enjoyable for everyone — whether you are looking for your first
          home, an investment property or a rental.
        </p>

        <section className="mission">
          <h2>Our Mission</h2>
          <p>
            To provide a modern, user-friendly platform where listings are
            verified and presented with clarity so users can make confident
            decisions. We blend local expertise with technology to deliver
            reliable property discovery and market insights.
          </p>
        </section>

        <section className="values">
          <h2>What We Value</h2>
          <ul>
            <li>Transparency & trust</li>
            <li>User-first design</li>
            <li>Accurate listings & fast support</li>
          </ul>
        </section>

        <section className="cta">
          <h2>Get Started</h2>
          <p>
            Browse listings, save your favorites, and contact agents directly.
            If you’re an agent, create an account to list your properties and
            reach more customers.
          </p>
        </section>
      </div>
    </div>
  );
}

export default About;
