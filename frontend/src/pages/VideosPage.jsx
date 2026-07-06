import { Plus, PlayCircle, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const emptyVideo = { title: '', description: '', category: 'Parenting Courses', videoUrl: '', thumbnail: '', duration: '', level: 'Beginner' };

const VideosPage = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ q: '', category: 'All' });
  const [videos, setVideos] = useState([]);
  const [form, setForm] = useState(emptyVideo);

  const load = async () => {
    const { data } = await api.get('/videos', { params: filters });
    setVideos(data.videos);
  };

  useEffect(() => {
    load();
  }, []);

  const addVideo = async (event) => {
    event.preventDefault();
    await api.post('/videos', form);
    setForm(emptyVideo);
    load();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="container-page py-8">
        <PageHeader
          eyebrow="Video Resource Center"
          title="Courses, development videos, and webinars"
          description="Watch structured parenting courses, child development explainers, and expert webinar resources."
        />
        <form onSubmit={(event) => { event.preventDefault(); load(); }} className="panel mb-6 grid gap-3 md:grid-cols-[1fr_260px_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input className="input pl-10" placeholder="Search videos" value={filters.q} onChange={(event) => setFilters({ ...filters, q: event.target.value })} />
          </div>
          <select className="input" value={filters.category} onChange={(event) => setFilters({ ...filters, category: event.target.value })}>
            {['All', 'Parenting Courses', 'Child Development Videos', 'Webinars'].map((item) => <option key={item}>{item}</option>)}
          </select>
          <button className="btn-primary">Search</button>
        </form>

        {user?.role === 'admin' && (
          <form onSubmit={addVideo} className="panel mb-6 grid gap-3">
            <h2 className="flex items-center gap-2 text-lg font-bold"><Plus /> Upload Video Resource</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <input className="input" placeholder="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
              <input className="input" placeholder="Duration" value={form.duration} onChange={(event) => setForm({ ...form, duration: event.target.value })} required />
              <input className="input" placeholder="Video URL" value={form.videoUrl} onChange={(event) => setForm({ ...form, videoUrl: event.target.value })} required />
              <input className="input" placeholder="Thumbnail URL" value={form.thumbnail} onChange={(event) => setForm({ ...form, thumbnail: event.target.value })} required />
              <select className="input" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{['Parenting Courses', 'Child Development Videos', 'Webinars'].map((item) => <option key={item}>{item}</option>)}</select>
              <select className="input" value={form.level} onChange={(event) => setForm({ ...form, level: event.target.value })}>{['Beginner', 'Intermediate', 'Advanced'].map((item) => <option key={item}>{item}</option>)}</select>
            </div>
            <textarea className="input min-h-24" placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />
            <button className="btn-primary w-max">Publish Video</button>
          </form>
        )}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {videos.map((video) => (
            <article key={video._id} className="panel">
              <a href={video.videoUrl} target="_blank" rel="noreferrer" className="relative block">
                <img src={video.thumbnail} alt={video.title} className="h-56 w-full rounded-lg object-cover" />
                <span className="absolute inset-0 grid place-items-center text-white"><PlayCircle size={54} /></span>
              </a>
              <span className="badge mt-4">{video.category}</span>
              <h2 className="mt-3 text-xl font-bold">{video.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{video.description}</p>
              <p className="mt-3 text-sm font-semibold text-slate-500">{video.duration} · {video.level}</p>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VideosPage;
