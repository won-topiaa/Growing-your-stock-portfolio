import { NavLink } from 'react-router-dom';
import { LayoutGrid, PlusCircle, Trophy } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutGrid, label: 'Dashboard', end: true },
  { to: '/add', icon: PlusCircle, label: 'Add', end: false },
  { to: '/hall-of-fame', icon: Trophy, label: 'Hall of Fame', end: false },
] as const;

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors ${
    isActive ? 'text-emerald-600' : 'text-slate-400'
  }`;

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass} end={item.end}>
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
