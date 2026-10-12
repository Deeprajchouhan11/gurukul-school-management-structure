import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Clock } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.message) {
      return setError('Please fill all required fields');
    }
    // TODO: Connect to backend /contact endpoint
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({ name: '', email: '', phone: '', message: '' });
    }, 4000);
  };

  return (
    <div className="page-contact">
      <section className="inner-hero">
        <div className="section-inner">
          <span className="eyebrow">Contact Us</span>
          <h1>We'd Love to <span>Hear From You</span></h1>
          <p>Get in touch for admissions, queries, or a campus visit.</p>
        </div>
      </section>

      <section className="contact-section">
        <div className="section-inner">
          <div className="contact-grid">
            {/* Info */}
            <div className="contact-info">
              <div className="contact-card">
                <div className="ci-icon"><MapPin size={22} /></div>
                <div>
                  <h4>Visit Us</h4>
                  <p>Station Road, Nanded,<br />Maharashtra 431601, India</p>
                </div>
              </div>

              <div className="contact-card">
                <div className="ci-icon"><Phone size={22} /></div>
                <div>
                  <h4>Call Us</h4>
                  <p>+91 90000 00001<br />+91 90000 00002</p>
                </div>
              </div>

              <div className="contact-card">
                <div className="ci-icon"><Mail size={22} /></div>
                <div>
                  <h4>Email Us</h4>
                  <p>info@gurukul.edu<br />admissions@gurukul.edu</p>
                </div>
              </div>

              <div className="contact-card">
                <div className="ci-icon"><Clock size={22} /></div>
                <div>
                  <h4>Office Hours</h4>
                  <p>Mon – Sat: 8:00 AM – 5:00 PM<br />Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="contact-form-card">
              <h2>Send us a Message</h2>
              <p>Fill the form and our team will get back to you within 24 hours.</p>

              {sent && (
                <div className="login-success" style={{ marginBottom: 16 }}>
                  <CheckCircle size={14} style={{ display: 'inline', marginRight: 6 }} />
                  Message sent! We'll get back to you soon.
                </div>
              )}

              {error && <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>}

              <form onSubmit={submit} className="form-grid">
                <input name="name" placeholder="Your Full Name *" value={form.name} onChange={onChange} />
                <input name="email" type="email" placeholder="Email Address *" value={form.email} onChange={onChange} />
                <input name="phone" placeholder="Phone Number" value={form.phone} onChange={onChange} />
                <textarea name="message" placeholder="Your Message *" rows="5" value={form.message} onChange={onChange} />
                <button type="submit" className="btn-hero-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  <Send size={16} /> Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Map */}
          <div className="contact-map">
            <iframe
              title="Gurukul Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.5!2d77.3!3d19.15!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA5JzAwLjAiTiA3N8KwMTgnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="380"
              style={{ border: 0, borderRadius: 16 }}
              allowFullScreen=""
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
}