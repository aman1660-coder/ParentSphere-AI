import 'chart.js/auto';
import { Activity, Plus, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import api from '../services/api';

const emptyForm = { name: '', age: '', height: '', weight: '', schoolGrade: '', interests: '', behaviorNotes: '' };

const ChildTrackerPage = () => {
  const [children, setChildren] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [growth, setGrowth] = useState({ height: '', weight: '' });
  const [recommendations, setRecommendations] = useState(null);

  const load = async () => {
    const { data } = await api.get('/children');
    setChildren(data.children);
    if (!selectedId && data.children[0]) setSelectedId(data.children[0]._id);
  };

  useEffect(() => {
    load();
  }, []);

  const selected = children.find((child) => child._id === selectedId);
  const chartData = useMemo(() => ({
    labels: selected?.growthRecords?.map((item) => new Date(item.date).toLocaleDateString()) || [],
    datasets: [
      { label: 'Height (cm)', data: selected?.growthRecords?.map((item) => item.height) || [], borderColor: '#2563eb', backgroundColor: '#2563eb33' },
      { label: 'Weight (kg)', data: selected?.growthRecords?.map((item) => item.weight) || [], borderColor: '#14b8a6', backgroundColor: '#14b8a633' }
    ]
  }), [selected]);

  const addChild = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      age: Number(form.age),
      height: Number(form.height),
      weight: Number(form.weight),
      interests: form.interests.split(',').map((item) => item.trim()).filter(Boolean)
    };
    const { data } = await api.post('/children', payload);
    setForm(emptyForm);
    setSelectedId(data.child._id);
    load();
  };

  const addGrowth = async (event) => {
    event.preventDefault();
    if (!selected) return;
    await api.post(`/children/${selected._id}/growth`, { height: Number(growth.height), weight: Number(growth.weight) });
    setGrowth({ height: '', weight: '' });
    load();
  };

  const getRecommendations = async () => {
    if (!selected) return;
    const { data } = await api.get(`/children/${selected._id}/recommendations`);
    setRecommendations(data.recommendations);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="container-page py-8">
        <PageHeader
          eyebrow="Child Development Tracker"
          title="Growth records, milestones, and recommendations"
          description="Add child profiles, record height and weight over time, and generate AI-powered guidance from the tracker."
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Children" value={children.length} icon={Activity} />
          <StatCard label="Latest Height" value={selected ? `${selected.height} cm` : '0 cm'} icon={Plus} tone="mint" />
          <StatCard label="Latest Weight" value={selected ? `${selected.weight} kg` : '0 kg'} icon={Sparkles} tone="violet" />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[360px_1fr]">
          <section className="grid gap-6">
            <form onSubmit={addChild} className="panel grid gap-3">
              <h2 className="text-lg font-bold">Add Child</h2>
              <input className="input" placeholder="Child name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <input className="input" type="number" placeholder="Age" value={form.age} onChange={(event) => setForm({ ...form, age: event.target.value })} required />
                <input className="input" placeholder="School grade" value={form.schoolGrade} onChange={(event) => setForm({ ...form, schoolGrade: event.target.value })} required />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input className="input" type="number" placeholder="Height cm" value={form.height} onChange={(event) => setForm({ ...form, height: event.target.value })} required />
                <input className="input" type="number" placeholder="Weight kg" value={form.weight} onChange={(event) => setForm({ ...form, weight: event.target.value })} required />
              </div>
              <input className="input" placeholder="Interests, comma separated" value={form.interests} onChange={(event) => setForm({ ...form, interests: event.target.value })} />
              <textarea className="input min-h-24" placeholder="Behavior notes" value={form.behaviorNotes} onChange={(event) => setForm({ ...form, behaviorNotes: event.target.value })} />
              <button className="btn-primary" type="submit">Save Child</button>
            </form>

            <form onSubmit={addGrowth} className="panel grid gap-3">
              <h2 className="text-lg font-bold">Record Growth</h2>
              <select className="input" value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
                {children.map((child) => <option key={child._id} value={child._id}>{child.name}</option>)}
              </select>
              <div className="grid gap-3 sm:grid-cols-2">
                <input className="input" type="number" placeholder="Height cm" value={growth.height} onChange={(event) => setGrowth({ ...growth, height: event.target.value })} required />
                <input className="input" type="number" placeholder="Weight kg" value={growth.weight} onChange={(event) => setGrowth({ ...growth, weight: event.target.value })} required />
              </div>
              <button className="btn-secondary" type="submit">Add Record</button>
            </form>
          </section>

          <section className="grid gap-6">
            <div className="panel">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">{selected ? `${selected.name}'s growth` : 'Growth chart'}</h2>
                  {selected && <p className="text-sm text-slate-500">Age {selected.age} · {selected.schoolGrade}</p>}
                </div>
                <button className="btn-primary" onClick={getRecommendations} type="button">Generate Guidance</button>
              </div>
              <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
            </div>

            {recommendations && (
              <div className="panel">
                <h2 className="text-lg font-bold">AI Recommendations for {recommendations.stage}</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="font-semibold">Activities</p>
                    <ul className="mt-2 grid gap-2 text-sm text-slate-600 dark:text-slate-400">
                      {recommendations.activities.map((item) => <li key={item} className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">{item}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold">Books and counsellors</p>
                    <ul className="mt-2 grid gap-2 text-sm text-slate-600 dark:text-slate-400">
                      {[...recommendations.books, ...recommendations.counsellors].map((item) => <li key={item.id} className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">{item.title || item.name}: {item.reason}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChildTrackerPage;
