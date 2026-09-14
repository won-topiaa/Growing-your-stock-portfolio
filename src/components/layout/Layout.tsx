import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { MobileNav } from './MobileNav';

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="px-4 py-6 pb-24 md:pb-6 max-w-4xl mx-auto">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}
