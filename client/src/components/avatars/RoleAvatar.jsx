import { ROLE_AVATARS } from '../../utils/rolePermissions.js';
export default function RoleAvatar({ role, size = 28 }) {
  return <span style={{ fontSize: size, lineHeight: 1 }}>{ROLE_AVATARS[role] || '👤'}</span>;
}