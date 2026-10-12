import {
  CheckCircle, Target, Eye, Heart, GraduationCap, Library, FlaskConical,
  Laptop, Trophy, Bus, Building2, Users, Sparkles
} from 'lucide-react';

const FACILITIES = [
  { icon: GraduationCap, title: 'Smart Classrooms', desc: 'Digital boards, projectors, and AC classrooms', color: 'blue' },
  { icon: Library,       title: 'Library',          desc: '5000+ books and digital resources',           color: 'green' },
  { icon: FlaskConical,  title: 'Science Labs',     desc: 'Modern physics, chemistry, biology labs',     color: 'purple' },
  { icon: Laptop,        title: 'Computer Lab',     desc: '50+ computers with high-speed internet',      color: 'gold' },
  { icon: Trophy,        title: 'Playground',       desc: 'Large sports ground with cricket, football',  color: 'red' },
  { icon: Bus,           title: 'Transport',        desc: 'GPS-tracked school buses across Nanded',      color: 'teal' },
  { icon: Building2,     title: 'Auditorium',       desc: '500-seat auditorium for events & seminars',   color: 'blue' },
  { icon: Users,         title: 'Counselling',      desc: 'Trained counsellors for student wellbeing',   color: 'green' },
];

export default function About() {
  return (
    <div className="page-about">
      {/* HERO */}
      <section className="inner-hero">
        <div className="section-inner">
          <span className="eyebrow"><Sparkles size={12} /> About Us</span>
          <h1>Building <span>Character,</span> Creating <span>Leaders</span></h1>
          <p>
            Founded in 2005, Gurukul English Medium School has been a beacon of
            academic excellence in Nanded for over two decades.
          </p>
        </div>
      </section>

      {/* STORY */}
      <section className="about-story">
        <div className="section-inner two-col">
          <div className="col-visual">
            <div className="story-image">
              <img src="/images/school-hero.jpg" alt="Gurukul Campus" />
            </div>
          </div>
          <div className="col-content">
            <span className="eyebrow">Our Story</span>
            <h2>Two Decades of <span>Excellence</span></h2>
            <p>
              What started as a small school with 40 students has grown into one
              of Nanded's most trusted educational institutions with over 1200
              students and 68 dedicated faculty members.
            </p>
            <p>
              Our philosophy is simple — every child is unique and deserves an
              environment that nurtures their individual talents while instilling
              strong moral values.
            </p>
            <div className="story-stats">
              <div><strong>1200+</strong><span>Students</span></div>
              <div><strong>68+</strong><span>Teachers</span></div>
              <div><strong>20+</strong><span>Years</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION VISION VALUES */}
      <section className="mvv-section">
        <div className="section-inner">
          <div className="mvv-grid">
            <div className="mvv-card">
              <div className="mvv-icon"><Target size={26} /></div>
              <h3>Our Mission</h3>
              <p>To provide quality education that empowers students to become confident, compassionate, and capable global citizens.</p>
            </div>
            <div className="mvv-card">
              <div className="mvv-icon"><Eye size={26} /></div>
              <h3>Our Vision</h3>
              <p>To be the most trusted educational institution in the region, known for academic excellence and character building.</p>
            </div>
            <div className="mvv-card">
              <div className="mvv-icon"><Heart size={26} /></div>
              <h3>Our Values</h3>
              <p>Integrity, Respect, Curiosity, Excellence, and Compassion guide everything we do at Gurukul.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FACILITIES */}
      <section className="facilities-section">
        <div className="section-inner">
          <div className="section-head">
            <span className="eyebrow">Our Facilities</span>
            <h2>World-Class <span>Infrastructure</span></h2>
          </div>

          <div className="facilities-grid">
            {FACILITIES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div className="facility-card" key={i}>
                  <div className={`facility-icon-svg ${f.color}`}>
                    <Icon size={28} strokeWidth={2} />
                  </div>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}