import { Outlet } from 'react-router-dom';
import LandingHeader from './LandingHeader.jsx';
import LandingFooter from './LandingFooter.jsx';
import './landing.css';

export default function LandingLayout() {
  return (
    <div className="landing-page">
      <LandingHeader />
      <main className="landing-main">
        <Outlet />
      </main>
      <LandingFooter />
    </div>
  );
}