import { CalendarDays, Filter, Search, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';
import api from '../services/api';

const specializations = ['All', 'Child Psychology', 'Academic Counselling', 'Parenting Guidance', 'Adolescent Behaviour', 'Family Counselling', 'Mental Health Support', 'Special Needs Counselling', 'Career Guidance'];

const CounsellorsPage = () => {
  const [filters, setFilters] = useState({ q: '', specialization: 'All', mode: 'All' });
  const [counsellors, setCounsellors] = useState([]);

  const load = async () => {
    const { data } = await api.get('/counsellors', { params: filters });
    setCounsellors(data.counsellors);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = (event) => {
    event.preventDefault();
    load();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="container-page py-8">
        <PageHeader
          eyebrow="Expert Counselling"
          title="Find the right specialist for your family"
          description="Search verified counsellors by specialization, experience, availability, fee, and session mode."
        />
        <form onSubmit={submit} className="panel mb-6 grid gap-3 lg:grid-cols-[1fr_260px_180px_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input className="input pl-10" placeholder="Search name, focus area, or description" value={filters.q} onChange={(event) => setFilters({ ...filters, q: event.target.value })} />
          </div>
          <select className="input" value={filters.specialization} onChange={(event) => setFilters({ ...filters, specialization: event.target.value })}>
            {specializations.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="input" value={filters.mode} onChange={(event) => setFilters({ ...filters, mode: event.target.value })}>
            {['All', 'Online', 'Offline', 'Hybrid'].map((item) => <option key={item}>{item}</option>)}
          </select>
          <button className="btn-primary" type="submit"><Filter size={18} /> Apply</button>
        </form>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {counsellors.map((counsellor) => (
            <article key={counsellor._id} className="panel">
              <img src={counsellor.image} alt={counsellor.name} className="h-60 w-full rounded-lg object-cover" />
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold">{counsellor.name}</h2>
                  <p className="font-semibold text-ocean">{counsellor.specialization}</p>
                </div>
                <span className="badge"><Star size={13} /> {counsellor.rating}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{counsellor.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="badge">{counsellor.experience} years</span>
                <span className="badge">{counsellor.mode}</span>
                <span className="badge">₹{counsellor.fee}</span>
              </div>
              <Link to={`/counsellors/${counsellor._id}/book`} className="btn-primary mt-5 w-full"><CalendarDays size={18} /> Book Appointment</Link>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CounsellorsPage;
