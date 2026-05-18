import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Calendar, Shield, Search, UserCheck, Quote } from 'lucide-react';
import api from '../services/api';
import PublicLayout from '../components/layout/PublicLayout';
import SkillCard from '../components/SkillCard';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { SkillCardSkeleton } from '../components/ui/Skeleton';
import { useAuth } from '../context/AuthContext';

const fade = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

const features = [
  { icon: Sparkles, title: 'Intelligent matching', desc: 'Pair with members whose offered and requested skills align with yours.' },
  { icon: Calendar, title: 'Structured sessions', desc: 'Propose times, confirm availability, and manage your swap calendar.' },
  { icon: Shield, title: 'Reputation system', desc: 'Build trust through reviews, ratings, and verified session history.' },
];

const steps = [
  { step: '01', title: 'Define your profile', desc: 'List skills you offer and skills you want to learn.' },
  { step: '02', title: 'Discover matches', desc: 'Browse ranked candidates based on compatibility and availability.' },
  { step: '03', title: 'Schedule and exchange', desc: 'Book sessions, collaborate, and leave reviews after completion.' },
];

const testimonials = [
  { quote: 'Skill Swap helped me trade design mentorship for advanced Excel training without any fees.', author: 'Morgan Chen', role: 'Product Designer' },
  { quote: 'The trust score and session history made it easy to find reliable partners in my city.', author: 'Aisha Khan', role: 'Software Engineer' },
];

export default function Home() {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/skills?limit=6').then(({ data }) => setSkills(data.skills)).finally(() => setLoading(false));
  }, []);

  return (
    <PublicLayout fullWidth>
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-transparent to-transparent dark:from-zinc-900" />
        <div className="page-container relative py-24 md:py-32">
          <motion.div {...fade} className="max-w-3xl">
            <p className="text-sm font-medium text-brand-600 tracking-wide uppercase mb-4">Crowdsourced skill network</p>
            <h1 className="text-4xl md:text-6xl font-semibold text-slate-900 dark:text-zinc-50 tracking-tight leading-[1.1]">
              Exchange expertise.<br />
              <span className="text-slate-500 dark:text-zinc-400">Build credibility.</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-zinc-400 mt-6 max-w-xl leading-relaxed">
              A professional platform for peer-to-peer learning. Teach what you master, learn what you need, and grow through structured skill swaps.
            </p>
            <div className="flex flex-wrap gap-3 mt-10">
              <Link to={user ? '/dashboard' : '/register'}>
                <Button size="lg" icon={ArrowRight}>Get started</Button>
              </Link>
              <Link to="/search">
                <Button size="lg" variant="secondary" icon={Search}>Explore skills</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="page-container py-20">
        <motion.div {...fade} className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <Card key={f.title} hover>
              <span className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-slate-700 dark:text-zinc-300" />
              </span>
              <h3 className="font-semibold text-slate-900 dark:text-zinc-50">{f.title}</h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </motion.div>
      </section>

      <section className="bg-slate-100/50 dark:bg-zinc-900/50 border-y border-slate-200 dark:border-zinc-800 py-20">
        <motion.div {...fade} className="page-container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-zinc-50">Built on trust</h2>
            <p className="text-slate-500 mt-2">Every member earns reputation through verified sessions and peer reviews.</p>
          </div>
          <motion.div {...fade} className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { value: '4.8', label: 'Average session rating' },
              { value: '12k+', label: 'Skills exchanged' },
              { value: '98%', label: 'Session completion rate' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-semibold text-slate-900 dark:text-zinc-50 tabular-nums">{s.value}</p>
                <p className="text-sm text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section className="page-container py-20">
        <h2 className="text-2xl font-semibold text-center mb-12">How it works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s) => (
            <motion.article key={s.step} {...fade}>
              <span className="text-xs font-mono text-brand-600">{s.step}</span>
              <h3 className="font-semibold mt-2 text-slate-900 dark:text-zinc-50">{s.title}</h3>
              <p className="text-sm text-slate-500 mt-2">{s.desc}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="page-container py-20">
        <header className="flex justify-between items-end mb-10">
          <motion.div {...fade}>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-zinc-50">Popular skills</h2>
            <p className="text-slate-500 text-sm mt-1">Recently added to the network</p>
          </motion.div>
          <Link to="/search" className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </header>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? Array.from({ length: 6 }).map((_, i) => <SkillCardSkeleton key={i} />) : skills.map((s, i) => <SkillCard key={s._id} skill={s} index={i} />)}
        </div>
      </section>

      <section className="page-container py-20">
        <h2 className="text-2xl font-semibold text-center mb-12">What members say</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((t) => (
            <Card key={t.author}>
              <Quote className="w-8 h-8 text-slate-200 dark:text-zinc-700 mb-4" />
              <p className="text-slate-600 dark:text-zinc-300 leading-relaxed">{t.quote}</p>
              <footer className="mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
                <p className="font-medium text-slate-900 dark:text-zinc-50">{t.author}</p>
                <p className="text-xs text-slate-500">{t.role}</p>
              </footer>
            </Card>
          ))}
        </div>
      </section>

      <section className="page-container pb-24">
        <Card className="text-center !py-12 bg-zinc-900 dark:bg-zinc-100 border-0">
          <UserCheck className="w-10 h-10 text-white dark:text-zinc-900 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-white dark:text-zinc-900">Ready to start your first swap?</h2>
          <p className="text-zinc-400 dark:text-zinc-600 mt-2 max-w-md mx-auto">Join a community of professionals exchanging skills with structure and accountability.</p>
          <Link to="/register" className="inline-block mt-6">
            <Button variant="secondary" size="lg">Create free account</Button>
          </Link>
        </Card>
      </section>
    </PublicLayout>
  );
}
