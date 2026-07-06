import { Heart, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import LoadingState from '../components/LoadingState';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import api, { apiError } from '../services/api';

const ArticleDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    const { data } = await api.get(`/articles/${id}`);
    setArticle(data.article);
  };

  useEffect(() => {
    load().catch((err) => setError(apiError(err)));
  }, [id]);

  const like = async () => {
    if (!user) return setError('Login to like articles.');
    await api.post(`/articles/${article._id}/like`);
    load();
  };

  const addComment = async (event) => {
    event.preventDefault();
    if (!user) return setError('Login to comment.');
    await api.post(`/articles/${article._id}/comments`, { text: comment });
    setComment('');
    load();
  };

  if (error && !article) return <div className="p-8">{error}</div>;
  if (!article) return <LoadingState />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="container-page py-8">
        <article className="mx-auto max-w-4xl">
          <Link to="/articles" className="font-semibold text-ocean">Back to articles</Link>
          <img src={article.image} alt={article.title} className="mt-6 h-[420px] w-full rounded-xl object-cover" />
          <span className="badge mt-6">{article.category}</span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-normal dark:text-white">{article.title}</h1>
          <p className="mt-3 text-sm text-slate-500">By {article.author?.name || 'Parentsphere'} · {article.readTime}</p>
          <div className="prose prose-slate mt-8 max-w-none rounded-xl border border-slate-200 bg-white p-6 leading-8 dark:prose-invert dark:border-slate-800 dark:bg-slate-900">
            {article.content.split('\n').map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <button className="btn-secondary mt-6" onClick={like}><Heart size={18} /> {article.likes?.length || 0} Likes</button>

          <section className="panel mt-8">
            <h2 className="text-xl font-bold">Comments</h2>
            <form onSubmit={addComment} className="mt-4 flex gap-2">
              <input className="input" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Add a comment" />
              <button className="btn-primary"><Send size={18} /></button>
            </form>
            {error && <p className="mt-3 text-sm font-semibold text-red-500">{error}</p>}
            <div className="mt-5 grid gap-3">
              {article.comments?.map((item) => (
                <div key={item._id} className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
                  <p className="font-semibold">{item.user?.name}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.text}</p>
                </div>
              ))}
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default ArticleDetailPage;
