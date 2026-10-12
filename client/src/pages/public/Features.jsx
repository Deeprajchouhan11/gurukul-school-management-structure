import {
  GraduationCap, Shield, Bus, BookOpen, CreditCard, Users,
  MessageCircle, FileSpreadsheet, Bell, CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FEATURES = [
  { icon: GraduationCap, title: 'Student Management', desc: 'Complete student records, admission, transfers, and profiles in one place.' },
  { icon: Users, title: 'Teacher Portal', desc: 'Attendance marking, homework assignment, and exam management.' },
  { icon: BookOpen, title: 'Digital Library', desc: 'Issue and return books with automatic fine calculation.' },
  { icon: CreditCard, title: 'Online Fee Payment', desc: 'UPI, NetBanking, Card and QR code payments with instant receipts.' },
  { icon: FileSpreadsheet, title: 'Exams & Results', desc: 'Create exams, enter marks, and generate PDF report cards.' },
  { icon: Bell, title: 'Notices & Announcements', desc: 'Send notices to students, parents, and teachers instantly.' },
  { icon: Bus, title: 'GPS Bus Tracking', desc: 'Live bus location for parents with route and ETA info.' },
  { icon: MessageCircle, title: 'Teacher-Parent Chat', desc: 'Direct WhatsApp communication between parents and teachers.' },
  { icon: Shield, title: 'Role-Based Access', desc: 'Separate dashboards for Admin, Teacher, Student, Parent, Accountant.' },
];

export default function Features() {
  return (
    <div className="page-features">
      <section className="inner-hero">
        <div className="section-inner">
          <span className="eyebrow">Features</span>
          <h1>Everything Your School <span>Needs</span></h1>
          <p>
            A complete school management system built for modern educational institutions.
          </p>
        </div>
      </section>

      <section className="features-detail">
        <div className="section-inner">
          <div className="features-detail-grid">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div className="feature-detail-card" key={i}>
                  <div className="fd-icon"><Icon size={24} /></div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="landing-cta">
        <div className="section-inner cta-inner">
          <div>
            <h2>Ready to Experience Gurukul?</h2>
            <p>Log in to your account or contact us for a demo.</p>
          </div>
          <div className="cta-actions">
            <Link to="/login" className="btn-hero-primary">Login Now</Link>
            <Link to="/contact" className="btn-hero-secondary-light">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}