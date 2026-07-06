import { Heart, MessageCircle, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const categories = ['All', 'Child Growth', 'Parenting Tips', 'Education', 'Technology', 'Health'];

const ArticlesPage = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ q: '', category: 'All' });
  const [articles, setArticles] = useState([]);
  const [message, setMessage] = useState('');

  const load = async () => {
    const { data } = await api.get('/articles', { params: filters });
    setArticles(data.articles);
  };

  useEffect(() => {
    load();
  }, []);

  const like = async (article) => {
    if (!user) return setMessage('Login to like articles.');
    await api.post(`/articles/${article._id}/like`);
    load();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="container-page py-8">
        <PageHeader
          eyebrow="Blog and Articles"
          title="Parenting articles with practical next steps"
          description="Read expert-written guidance across child growth, school, technology, health, and everyday parenting."
        />
        <form onSubmit={(event) => { event.preventDefault(); load(); }} className="panel mb-6 grid gap-3 md:grid-cols-[1fr_240px_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input className="input pl-10" placeholder="Search articles" value={filters.q} onChange={(event) => setFilters({ ...filters, q: event.target.value })} />
          </div>
          <select className="input" value={filters.category} onChange={(event) => setFilters({ ...filters, category: event.target.value })}>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
          <button className="btn-primary">Search</button>
        </form>
        {message && <p className="mb-4 rounded-lg bg-ocean/10 p-3 text-sm font-semibold text-ocean">{message}</p>}
        <div className="grid gap-5 lg:grid-cols-3">
          {articles.map((article) => (
            <article key={article._id} className="panel flex flex-col">
              <img src={article.image} alt={article.title} className="h-56 w-full rounded-lg object-cover" />
              <span className="badge mt-4 w-max">{article.category}</span>
              <h2 className="mt-3 text-xl font-bold">{article.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{article.excerpt}</p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="flex gap-3 text-sm text-slate-500">
                  <button className="flex items-center gap-1" onClick={() => like(article)}><Heart size={16} /> {article.likes?.length || 0}</button>
                  <span className="flex items-center gap-1"><MessageCircle size={16} /> {article.comments?.length || 0}</span>
                </div>
                <Link to={`/articles/${article.slug || article._id}`} className="font-semibold text-ocean">Read</Link>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArticlesPage;
