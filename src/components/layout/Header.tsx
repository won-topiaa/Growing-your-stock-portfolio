import { Link, NavLink } from 'react-router-dom';
import { Sprout } from 'lucide-react';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors ${
    isActive ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-700'
  }`;

export function Header() {
  return (
    <header className="hidden md:flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
      <Link to="/" className="flex items-center gap-2">
        <Sprout className="w-6 h-6 text-emerald-600" />
        <span className="text-lg font-bold text-slate-800">Companion Portfolio</span>
      </Link>
      <nav className="flex items-center gap-6">
        <NavLink to="/" className={linkClass} end>Dashboard</NavLink>
        <NavLink to="/add" className={linkClass}>Add Holding</NavLink>
        <NavLink to="/hall-of-fame" className={linkClass}>Hall of Fame</NavLink>
      </nav>
    </header>
  );
}
