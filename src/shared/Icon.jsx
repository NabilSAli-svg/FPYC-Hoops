import * as Icons from 'lucide-react';

export default function Icon({ name, size = 18, color, style }) {
  const key = name
    .split('-')
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
  const LucideIcon = Icons[key];
  if (!LucideIcon) return null;
  return <LucideIcon size={size} color={color} style={style} strokeWidth={2} />;
}
