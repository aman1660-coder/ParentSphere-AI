import { motion } from 'framer-motion';
import { ArrowRight, BrainCircuit, CalendarCheck, GraduationCap, HeartHandshake, Library, MessageCircle, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import api from '../services/api';

const features = [
  ['AI Parenting Assistant', 'Personalized guidance for behavior, learning, nutrition, activities, and mental health awareness.', BrainCircuit],
  ['Expert Counselling', 'Book verified child psychologists, academic counsellors, parenting coaches, and family specialists.', HeartHandshake],
  ['Child Growth Tracker', 'Track height, weight, school grade, interests, and development recommendations with charts.', CalendarCheck],
  ['E-book Library', 'Curated parenting, child psychology, emotional intelligence, nutrition, and education books.', Library],
  ['Parenting Courses', 'Structured videos and webinars to help parents build healthy routines and communication.', GraduationCap],
  ['Community Forum', 'Ask questions, share wins, and learn from other parents in a moderated community.', MessageCircle]
];

const stats = [
  ['25K+', 'Parents Helped'],
  ['8K+', 'Counselling Sessions'],
  ['500+', 'Books Available'],
  ['120+', 'Growth Resources']
];

const LandingPage = () => {
  const [data, setData] = useState({ counsellors: [], articles: [], testimonials: [] });
  const [contact, setContact] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState('');

  useEffect(() => {
    const load = async () => {
      const [counsellors, articles, testimonials] = await Promise.allSettled([
        api.get('/counsellors'),
        api.get('/articles'),
        api.get('/testimonials')
      ]);
      setData({
        counsellors: counsellors.value?.data?.counsellors?.slice(0, 3) || [],
        articles: articles.value?.data?.articles?.slice(0, 3) || [],
        testimonials: testimonials.value?.data?.testimonials?.slice(0, 3) || []
      });
    };
    load();
  }, []);

  const submitContact = async (event) => {
    event.preventDefault();
    await api.post('/contact', contact);
    setSent('Message sent. The Parentsphere team will respond soon.');
    setContact({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />
      <main>
        <section className="relative min-h-[86vh] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&w=2200&q=90"
            alt="Parent and child learning together"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/78 via-slate-900/45 to-white/10" />
          <div className="container-page relative flex min-h-[86vh] items-center pb-20 pt-24">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
              className="max-w-3xl text-white"
            >
              <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/14 px-4 py-2 text-sm font-semibold backdrop-blur">
                <Sparkles size={16} /> Intelligent Parenting & Child Development Platform
              </span>
              <h1 className="text-5xl font-extrabold tracking-normal sm:text-6xl lg:text-7xl">
                Parentsphere
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">
                Empowering Parents, Nurturing Futures through AI guidance, verified counselling, child growth
                insights, expert resources, and supportive community.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/register" className="btn-primary">
                  Start Free <ArrowRight size={18} />
                </Link>
                <Link to="/counsellors" className="btn-secondary !border-white/30 !bg-white/14 !text-white backdrop-blur">
                  Book Counsellor
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="container-page -mt-16 relative z-10 grid gap-4 pb-14 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(([value, label]) => (
            <div key={label} className="rounded-xl border border-white/70 bg-white/90 p-5 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
              <p className="text-3xl font-extrabold text-ink dark:text-white">{value}</p>
              <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
            </div>
          ))}
        </section>

        <section className="container-page py-14">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-ocean">Complete parenting operating system</p>
              <h2 className="mt-2 text-3xl font-extrabold dark:text-white">Everything parents need in one trusted place</h2>
            </div>
            <Link to="/ai-assistant" className="btn-secondary">Try AI Assistant</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map(([title, text, Icon]) => (
              <motion.div
                key={title}
                whileHover={{ y: -4 }}
                className="panel"
              >
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-ocean/10 text-ocean">
                  <Icon size={22} />
                </div>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="bg-slate-50 py-14 dark:bg-slate-900/40">
          <div className="container-page">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet">Featured experts</p>
                <h2 className="mt-2 text-3xl font-extrabold dark:text-white">Counsellors parents can trust</h2>
              </div>
              <Link to="/counsellors" className="btn-primary">View All</Link>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {data.counsellors.map((counsellor) => (
                <Link key={counsellor._id} to={`/counsellors/${counsellor._id}/book`} className="panel block transition hover:-translate-y-1">
                  <img src={counsellor.image} alt={counsellor.name} className="h-56 w-full rounded-lg object-cover" />
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <h3 className="font-bold">{counsellor.name}</h3>
                    <span className="badge">★ {counsellor.rating}</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-ocean">{counsellor.specialization}</p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{counsellor.experience} years experience · ₹{counsellor.fee}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="container-page grid gap-8 py-14 lg:grid-cols-[.95fr_1.05fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-coral">Success stories</p>
            <h2 className="mt-2 text-3xl font-extrabold dark:text-white">Families are building calmer homes</h2>
            <div className="mt-6 grid gap-4">
              {data.testimonials.map((item) => (
                <div key={item._id} className="panel">
                  <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">“{item.review}”</p>
                  <p className="mt-3 font-bold">{item.parentName} · {item.rating}/5</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-mint">Latest articles</p>
            <h2 className="mt-2 text-3xl font-extrabold dark:text-white">Evidence-aware parenting reads</h2>
            <div className="mt-6 grid gap-4">
              {data.articles.map((article) => (
                <Link key={article._id} to={`/articles/${article.slug || article._id}`} className="flex gap-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-ocean/40 dark:border-slate-800 dark:bg-slate-900">
                  <img src={article.image} alt={article.title} className="h-24 w-28 rounded-lg object-cover" />
                  <div>
                    <span className="badge">{article.category}</span>
                    <h3 className="mt-2 font-bold">{article.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">{article.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-mesh-light py-14 dark:bg-mesh-dark">
          <div className="container-page grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-ocean">Contact</p>
              <h2 className="mt-2 text-3xl font-extrabold dark:text-white">Bring Parentsphere to your family or school</h2>
              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Send us your question, counselling partnership idea, or resource request. Messages are stored in MongoDB
                for the admin dashboard.
              </p>
            </div>
            <form onSubmit={submitContact} className="panel grid gap-3">
              <div className="grid gap-3 md:grid-cols-2">
                <input className="input" placeholder="Name" value={contact.name} onChange={(event) => setContact({ ...contact, name: event.target.value })} required />
                <input className="input" type="email" placeholder="Email" value={contact.email} onChange={(event) => setContact({ ...contact, email: event.target.value })} required />
              </div>
              <input className="input" placeholder="Subject" value={contact.subject} onChange={(event) => setContact({ ...contact, subject: event.target.value })} required />
              <textarea className="input min-h-28" placeholder="Message" value={contact.message} onChange={(event) => setContact({ ...contact, message: event.target.value })} required />
              <button className="btn-primary" type="submit">Send Message</button>
              {sent && <p className="text-sm font-semibold text-mint">{sent}</p>}
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
