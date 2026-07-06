import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const NotFoundPage = () => (
  <div className="min-h-screen bg-mesh-light dark:bg-mesh-dark">
    <Navbar />
    <main className="container-page grid min-h-[70vh] place-items-center text-center">
      <section>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-ocean">404</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-normal dark:text-white">Page not found</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">This Parentsphere route does not exist.</p>
        <Link to="/" className="btn-primary mt-6">Go Home</Link>
      </section>
    </main>
  </div>
);

export default NotFoundPage;
