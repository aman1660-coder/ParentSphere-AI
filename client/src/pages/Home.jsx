import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bot, BookOpen, Users, Calendar, ShieldCheck } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 -z-10" />
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-100 blur-3xl opacity-50 mix-blend-multiply" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-100 blur-3xl opacity-50 mix-blend-multiply" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6"
            >
              Intelligent Parenting & <span className="text-gradient">Child Development</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-slate-600 mb-10"
            >
              Empowering parents with AI-driven insights, expert counselling, and a comprehensive resource library to nurture the next generation.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center gap-4"
            >
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold text-lg transition-all shadow-lg shadow-blue-500/30">
                Join Parentsphere
              </Link>
              <Link to="/counsellors" className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-3 rounded-full font-semibold text-lg transition-all shadow-sm">
                Find an Expert
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything You Need in One Platform</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">We provide a holistic approach to parenting, combining technology with human expertise.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Bot size={32} className="text-blue-500" />}
              title="AI Parenting Assistant"
              description="Get instant, personalized guidance on child behavior, nutrition, and development from our trained AI."
            />
            <FeatureCard 
              icon={<Users size={32} className="text-purple-500" />}
              title="Expert Counselling"
              description="Book one-on-one sessions with verified child psychologists and parenting coaches."
            />
            <FeatureCard 
              icon={<BookOpen size={32} className="text-green-500" />}
              title="Resource Library"
              description="Access hundreds of curated E-books, articles, and courses on modern parenting."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatCard number="10k+" label="Parents Helped" />
            <StatCard number="500+" label="Expert Counsellors" />
            <StatCard number="2k+" label="Learning Resources" />
            <StatCard number="4.9/5" label="Average Rating" />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-panel p-8 rounded-2xl border border-slate-100 shadow-lg hover:shadow-xl transition-all"
  >
    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </motion.div>
);

const StatCard = ({ number, label }) => (
  <div>
    <div className="text-4xl md:text-5xl font-extrabold text-blue-400 mb-2">{number}</div>
    <div className="text-slate-400 font-medium">{label}</div>
  </div>
);

export default Home;
