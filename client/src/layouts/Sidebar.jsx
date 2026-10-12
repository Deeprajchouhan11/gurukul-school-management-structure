import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { MENU } from '../utils/navMenu.js';

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  const items = MENU[user?.role] || [];

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <ul>
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <li key={it.path}>
              <NavLink
                to={it.path}
                onClick={onClose}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                <span className="icon">
                  {Icon ? <Icon size={18} strokeWidth={2} /> : '•'}
                </span>
                {it.label}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}