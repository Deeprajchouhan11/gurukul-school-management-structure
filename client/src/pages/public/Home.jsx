import { Link } from 'react-router-dom';
import {
  GraduationCap, BookOpen, Users, Award, Shield, Heart,
  ArrowRight, CheckCircle, Star, Quote, Play, Sparkles,
  TrendingUp, Library, FlaskConical, Bus, Laptop, Trophy,
  User, UserCheck
} from 'lucide-react';

export default function Home() {
  return (
    <>
      {/* HERO with school image */}
      <section className="hero">
        <div className="hero-bg">
          <img src="/images/school-hero.jpg" alt="Gurukul Campus" />
          <div className="hero-bg-overlay" />
        </div>

        <div className="hero-inner">
          <div className="hero-content">
            <span className="hero-badge">
              <Sparkles size={14} /> Admissions Open 2026–27
            </span>
            <h1>
              Shaping Bright Minds for a <span>Brighter Tomorrow</span>
            </h1>
            <p>
              Welcome to Gurukul English Medium School — where tradition meets
              modern education. We nurture curiosity, creativity, and character
              in every child.
            </p>
            <div className="hero-actions">
              <Link to="/about" className="btn-hero-primary">
                Discover More <ArrowRight size={16} />
              </Link>
              <Link to="/contact" className="btn-hero-secondary">
                <Play size={16} /> Schedule a Visit
              </Link>
            </div>

            <div className="hero-stats">
              <div><strong>20+</strong><span>Years of Excellence</span></div>
              <div><strong>1200+</strong><span>Happy Students</span></div>
              <div><strong>68+</strong><span>Expert Teachers</span></div>
            </div>
          </div>
        </div>

        {/* Floating badges on image */}
        <div className="hero-floating-badges">
          <div className="hero-float-card top-right">
            <div className="hfc-icon green"><Award size={20} /></div>
            <div>
              <strong>Best School 2025</strong>
              <span>Award Winner</span>
            </div>
          </div>
          <div className="hero-float-card bottom-left">
            <div className="hfc-icon blue"><CheckCircle size={20} /></div>
            <div>
              <strong>100% Result</strong>
              <span>Every Year</span>
            </div>
          </div>
        </div>
      </section>

      {/* TRUSTED BY */}
      <section className="trust-section">
        <p>Trusted by 1200+ parents across Maharashtra</p>
        <div className="trust-logos">
          <span><GraduationCap size={18} /> CBSE Affiliated</span>
          <span><Trophy size={18} /> State Rank Holder</span>
          <span><Laptop size={18} /> Smart Classrooms</span>
          <span><Bus size={18} /> GPS Transport</span>
          <span><Library size={18} /> Digital Library</span>
        </div>
      </section>

      {/* ABOUT */}
      <section className="landing-about">
        <div className="section-inner two-col">
          <div className="col-visual">
            <div className="about-image">
              <img src="/images/school-hero.jpg" alt="Gurukul Campus" className="about-img" />
              <div className="about-accent-card">
                <strong>20+</strong>
                <span>Years of Trust</span>
              </div>
            </div>
          </div>
          <div className="col-content">
            <span className="eyebrow">About Gurukul</span>
            <h2>Where Every Child is a <span>Future Leader</span></h2>
            <p>
              At Gurukul, we believe education goes beyond textbooks. Our holistic
              approach combines academic excellence with moral values, creativity,
              and life skills to prepare students for the real world.
            </p>
            <ul className="feature-list">
              <li><CheckCircle size={18} /> CBSE affiliated curriculum</li>
              <li><CheckCircle size={18} /> Smart digital classrooms</li>
              <li><CheckCircle size={18} /> Expert & caring faculty</li>
              <li><CheckCircle size={18} /> Focus on sports & arts</li>
            </ul>
            <Link to="/about" className="btn-hero-primary">
              Learn More <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="landing-features">
        <div className="section-inner">
          <div className="section-head">
            <span className="eyebrow">Why Choose Us</span>
            <h2>Everything Your Child Needs to <span>Succeed</span></h2>
            <p>Comprehensive facilities and programs designed for holistic development.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon blue"><GraduationCap size={26} /></div>
              <h3>Quality Education</h3>
              <p>CBSE curriculum with experienced faculty and personalized attention.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon green"><Library size={26} /></div>
              <h3>Digital Library</h3>
              <p>5000+ books and digital resources available for all students.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon gold"><Users size={26} /></div>
              <h3>Small Class Sizes</h3>
              <p>Maximum 30 students per class for individual attention.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon purple"><Shield size={26} /></div>
              <h3>Safe Campus</h3>
              <p>CCTV surveillance, GPS buses, and trained security staff.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon red"><Heart size={26} /></div>
              <h3>Sports & Arts</h3>
              <p>Cricket, football, music, dance, and painting for all-round growth.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon teal"><Award size={26} /></div>
              <h3>Award Winning</h3>
              <p>Recognized as one of the best schools in Nanded region.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FACILITIES STRIP */}
      <section className="facilities-strip">
        <div className="section-inner">
          <div className="facilities-strip-grid">
            <div className="fs-item">
              <div className="fs-icon"><FlaskConical size={22} /></div>
              <div>
                <h4>Science Labs</h4>
                <p>Physics · Chemistry · Biology</p>
              </div>
            </div>
            <div className="fs-item">
              <div className="fs-icon"><Laptop size={22} /></div>
              <div>
                <h4>Computer Lab</h4>
                <p>50+ modern systems</p>
              </div>
            </div>
            <div className="fs-item">
              <div className="fs-icon"><Bus size={22} /></div>
              <div>
                <h4>Safe Transport</h4>
                <p>GPS tracked buses</p>
              </div>
            </div>
            <div className="fs-item">
              <div className="fs-icon"><Trophy size={22} /></div>
              <div>
                <h4>Sports Ground</h4>
                <p>Cricket · Football · Athletics</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="landing-testimonials">
        <div className="section-inner">
          <div className="section-head">
            <span className="eyebrow">Testimonials</span>
            <h2>What Parents <span>Say About Us</span></h2>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <Quote size={26} className="quote-icon" />
              <p>"Gurukul has transformed my daughter. The teachers genuinely care about every child's progress."</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <User size={20} />
                </div>
                <div>
                  <strong>Rajesh Patil</strong>
                  <span>Parent of Class 8 Student</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <Quote size={26} className="quote-icon" />
              <p>"The online portal makes it so easy to track my son's attendance, fees, and results. Truly modern school."</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <UserCheck size={20} />
                </div>
                <div>
                  <strong>Priya Deshmukh</strong>
                  <span>Parent of Class 10 Student</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <Quote size={26} className="quote-icon" />
              <p>"Excellent faculty and infrastructure. My kids love going to school every day. Highly recommended!"</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <User size={20} />
                </div>
                <div>
                  <strong>Amit Kulkarni</strong>
                  <span>Parent of Class 6 Student</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <div className="section-inner cta-inner">
          <div>
            <h2>Ready to Enroll Your Child?</h2>
            <p>Join the Gurukul family today. Admissions open for 2026–27 academic year.</p>
          </div>
          <div className="cta-actions">
            <Link to="/contact" className="btn-hero-primary">
              Apply Now <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn-hero-secondary-light">
              Parent Login
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}