import { Link } from "react-router-dom";
import "./about.scss";

function About() {
    return (
        <div className="aboutPage">
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="heroContent">
                        <h1 className="heroTitle">
                            Transforming Real Estate
                            <span className="gradientText"> Experiences</span>
                        </h1>
                        <p className="heroSubtitle">
                            We're redefining how people find, buy, and sell properties through 
                            innovative technology and personalized service.
                        </p>
                        <div className="heroStats">
                            <div className="stat">
                                <span className="statNumber">500+</span>
                                <span className="statLabel">Properties Listed</span>
                            </div>
                            <div className="stat">
                                <span className="statNumber">50+</span>
                                <span className="statLabel">Expert Agents</span>
                            </div>
                            <div className="stat">
                                <span className="statNumber">95%</span>
                                <span className="statLabel">Client Satisfaction</span>
                            </div>
                            <div className="stat">
                                <span className="statNumber">24/7</span>
                                <span className="statLabel">Support</span>
                            </div>
                        </div>
                    </div>
                    <div className="heroVisual">
                        <img src="/about-hero.jpg" alt="Modern real estate" className="heroImage" />
                        <div className="floatingCard">
                            <div className="cardIcon">🏠</div>
                            <h4>Find Your Dream Home</h4>
                            <p>Curated properties matching your preferences</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="mission">
                <div className="container">
                    <div className="sectionHeader">
                        <h2>Our Mission</h2>
                        <p>Driving innovation in real estate through technology and trust</p>
                    </div>
                    <div className="missionGrid">
                        <div className="missionCard">
                            <div className="missionIcon">🎯</div>
                            <h3>Precision Matching</h3>
                            <p>Advanced algorithms that understand your preferences and match you with properties that truly fit your needs and lifestyle.</p>
                        </div>
                        <div className="missionCard">
                            <div className="missionIcon">🛡️</div>
                            <h3>Verified Listings</h3>
                            <p>Every property is thoroughly vetted to ensure accuracy, authenticity, and up-to-date information for confident decision-making.</p>
                        </div>
                        <div className="missionCard">
                            <div className="missionIcon">⚡</div>
                            <h3>Instant Updates</h3>
                            <p>Real-time notifications for new listings, price changes, and market trends to keep you ahead in your property search.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="values">
                <div className="container">
                    <div className="sectionHeader">
                        <h2>Our Core Values</h2>
                        <p>The principles that guide everything we do</p>
                    </div>
                    <div className="valuesGrid">
                        <div className="valueItem">
                            <div className="valueNumber">01</div>
                            <h3>Transparency First</h3>
                            <p>Clear pricing, honest property details, and open communication. No hidden fees, no surprises.</p>
                        </div>
                        <div className="valueItem">
                            <div className="valueNumber">02</div>
                            <h3>User-Centric Design</h3>
                            <p>Every feature is built with your experience in mind. Simple, intuitive, and powerful tools for your property journey.</p>
                        </div>
                        <div className="valueItem">
                            <div className="valueNumber">03</div>
                            <h3>Quality Assurance</h3>
                            <p>Rigorous verification processes ensure every listing meets our high standards for accuracy and reliability.</p>
                        </div>
                        <div className="valueItem">
                            <div className="valueNumber">04</div>
                            <h3>Innovation Driven</h3>
                            <p>Constantly evolving our platform with the latest technology to provide you with the best real estate experience.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="team">
                <div className="container">
                    <div className="sectionHeader">
                        <h2>Meet Our Leadership</h2>
                        <p>Experienced professionals dedicated to your success</p>
                    </div>
                    <div className="teamGrid">
                        <div className="teamMember">
                            <div className="memberImage">
                                <img src="/team-member1.jpg" alt="Pastor Idowu Oviawe Gabriel" />
                            </div>
                            <h3>Pastor Idowu Oviawe Gabriel</h3>
                            <p className="memberRole">CEO & Founder</p>
                            <p className="memberBio">15+ years in real estate technology and customer experience innovation.</p>
                        </div>
                        <div className="teamMember">
                            <div className="memberImage">
                                <img src="/team-member2.jpg" alt="Mrs Doris Idowu Oviawe picture" />
                            </div> 32q  
                            <h3>Mrs Doris Idowu Oviawe</h3>
                            <p className="memberRole">Head of Operations</p>
                            <p className="memberBio">Expert in scaling platforms and ensuring seamless user experiences.</p>
                        </div>
                        <div className="teamMember">
                            <div className="memberImage">
                                <img src="/my.jpg" alt="Joseph picture" />
                            </div>
                            <h3>Joseph Abel Olayinka</h3>
                            <p className="memberRole">Lead Agent Relations</p>
                            <p className="memberBio">Connecting top-tier agents with motivated buyers and sellers.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta">
                <div className="container">
                    <div className="ctaContent">
                        <h2>Ready to Find Your Perfect Property?</h2>
                        <p>Join thousands of satisfied users who found their dream home through our platform.</p>
                        <div className="ctaButtons">
                            <Link to="/list" className="ctaButton primary">
                                Browse Properties
                            </Link>
                            <Link to="/register" className="ctaButton secondary">
                                Become an Agent
                            </Link>
                        </div>
                        <div className="trustIndicators">
                            <div className="trustItem">
                                <div className="trustIcon">⭐</div>
                                <span>Rated 4.9/5 by 2,000+ users</span>
                            </div>
                            <div className="trustItem">
                                <div className="trustIcon">🔒</div>
                                <span>Secure & trusted platform</span>
                            </div>
                            <div className="trustItem">
                                <div className="trustIcon">🚀</div>
                                <span>Fastest growing in the region</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default About;