import { MarketingNavbar } from './Navbar';
import Footer from './Footer';
import PageTransition from '../ui/PageTransition';

export default function PublicLayout({ children, fullWidth }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950">
      <MarketingNavbar />
      <main className={fullWidth ? 'flex-1' : 'flex-1 page-container py-10'}>
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </div>
  );
}
