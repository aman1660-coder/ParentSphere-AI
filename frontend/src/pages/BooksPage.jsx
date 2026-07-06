import { Bookmark, Download, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const categories = ['All', 'Parenting', 'Child Psychology', 'Emotional Intelligence', 'Child Nutrition', 'Education', 'Communication Skills'];

const BooksPage = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ q: '', category: 'All' });
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState('');

  const load = async () => {
    const { data } = await api.get('/books', { params: filters });
    setBooks(data.books);
  };

  useEffect(() => {
    load();
  }, []);

  const bookmark = async (id) => {
    if (!user) {
      setMessage('Login as a parent to bookmark books.');
      return;
    }
    const { data } = await api.post(`/books/${id}/bookmark`);
    setMessage(data.bookmarked ? 'Book saved to your dashboard.' : 'Book removed from saved list.');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="container-page py-8">
        <PageHeader
          eyebrow="E-book Library"
          title="Curated reading for every parenting stage"
          description="Search books, read online, download PDFs, and save favorites to your parent dashboard."
        />
        <form onSubmit={(event) => { event.preventDefault(); load(); }} className="panel mb-6 grid gap-3 md:grid-cols-[1fr_260px_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input className="input pl-10" placeholder="Search books or authors" value={filters.q} onChange={(event) => setFilters({ ...filters, q: event.target.value })} />
          </div>
          <select className="input" value={filters.category} onChange={(event) => setFilters({ ...filters, category: event.target.value })}>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
          <button className="btn-primary" type="submit">Search</button>
        </form>
        {message && <p className="mb-4 rounded-lg bg-ocean/10 p-3 text-sm font-semibold text-ocean">{message}</p>}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {books.map((book) => (
            <article key={book._id} className="panel flex flex-col">
              <img src={book.coverImage} alt={book.title} className="h-64 w-full rounded-lg object-cover" />
              <span className="badge mt-4 w-max">{book.category}</span>
              <h2 className="mt-3 text-lg font-bold">{book.title}</h2>
              <p className="text-sm font-semibold text-slate-500">{book.author}</p>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{book.summary}</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <a className="btn-primary !px-3" href={book.pdfLink} target="_blank" rel="noreferrer"><Download size={16} /> Read</a>
                <button className="btn-secondary !px-3" onClick={() => bookmark(book._id)}><Bookmark size={16} /> Save</button>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BooksPage;
