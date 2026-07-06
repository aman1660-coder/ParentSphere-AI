import { Heart, MessageCircle, Plus, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';
import api from '../services/api';

const ForumPage = () => {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: '', category: 'Parent Stories', content: '' });
  const [comments, setComments] = useState({});

  const load = async () => {
    const { data } = await api.get('/forum');
    setPosts(data.posts);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (event) => {
    event.preventDefault();
    await api.post('/forum', form);
    setForm({ title: '', category: 'Parent Stories', content: '' });
    load();
  };

  const like = async (id) => {
    await api.post(`/forum/${id}/like`);
    load();
  };

  const comment = async (event, id) => {
    event.preventDefault();
    if (!comments[id]) return;
    await api.post(`/forum/${id}/comments`, { text: comments[id] });
    setComments({ ...comments, [id]: '' });
    load();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="container-page py-8">
        <PageHeader
          eyebrow="Community Forum"
          title="Parent questions, stories, and support"
          description="Create posts, ask questions, like helpful discussions, and comment with practical experiences."
        />
        <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
          <form onSubmit={create} className="panel h-max grid gap-3">
            <h2 className="flex items-center gap-2 text-lg font-bold"><Plus /> Create Post</h2>
            <input className="input" placeholder="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
            <select className="input" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
              {['Behaviour', 'Education', 'Health', 'Nutrition', 'Technology', 'Parent Stories'].map((item) => <option key={item}>{item}</option>)}
            </select>
            <textarea className="input min-h-32" placeholder="Share your question or story" value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} required />
            <button className="btn-primary">Publish</button>
          </form>
          <section className="grid gap-4">
            {posts.map((post) => (
              <article key={post._id} className="panel">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="badge">{post.category}</span>
                    <h2 className="mt-3 text-xl font-bold">{post.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">By {post.author?.name} · {post.author?.role}</p>
                  </div>
                  <button className="btn-secondary !px-3" onClick={() => like(post._id)}><Heart size={17} /> {post.likes?.length || 0}</button>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">{post.content}</p>
                <div className="mt-5 grid gap-3">
                  {post.comments?.map((item) => (
                    <div key={item._id} className="rounded-lg bg-slate-100 p-3 text-sm dark:bg-slate-800">
                      <p className="font-semibold">{item.user?.name}</p>
                      <p className="mt-1 text-slate-600 dark:text-slate-300">{item.text}</p>
                    </div>
                  ))}
                </div>
                <form onSubmit={(event) => comment(event, post._id)} className="mt-4 flex gap-2">
                  <input className="input" placeholder="Add helpful comment" value={comments[post._id] || ''} onChange={(event) => setComments({ ...comments, [post._id]: event.target.value })} />
                  <button className="btn-primary"><Send size={17} /></button>
                </form>
                <p className="mt-3 flex items-center gap-1 text-sm text-slate-500"><MessageCircle size={15} /> {post.comments?.length || 0} comments</p>
              </article>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForumPage;
