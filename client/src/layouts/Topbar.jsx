import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import RoleAvatar from '../components/avatars/RoleAvatar.jsx';
import { ROLE_LABELS } from '../utils/rolePermissions.js';

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="topbar">
      <button className="menu-btn" onClick={onMenuClick}>☰</button>

      <div className="topbar-brand">
        <img src="/logo-gurukul.png" alt="Gurukul" />
        Gurukul <span>EduSphere</span>
      </div>

      <div className="topbar-user">
        <RoleAvatar role={user?.role} size={24} />
        <span className="topbar-role">{ROLE_LABELS[user?.role]}</span>
        <span className="topbar-name">{user?.name}</span>
        <Link to="/change-password" className="btn-logout" style={{ textDecoration: 'none' }}>
          🔒 Password
        </Link>
        <button className="btn-logout" onClick={handleLogout}>⏻ Logout</button>
      </div>
    </header>
  );
}