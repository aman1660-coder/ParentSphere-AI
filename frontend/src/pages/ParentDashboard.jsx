import 'chart.js/auto';
import { BarChart3, BookOpen, BrainCircuit, CalendarDays, CreditCard } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const ParentDashboard = () => {
  const { user } = useAuth();
  const [state, setState] = useState({ loading: true, children: [], appointments: [], payments: [], chats: [], savedBooks: [] });

  useEffect(() => {
    const load = async () => {
      const [children, appointments, payments, chats, me] = await Promise.all([
        api.get('/children'),
        api.get('/appointments'),
        api.get('/payments'),
        api.get('/ai/history'),
        api.get('/auth/me')
      ]);
      setState({
        loading: false,
        children: children.data.children,
        appointments: appointments.data.appointments,
        payments: payments.data.payments,
        chats: chats.data.chats,
        savedBooks: me.data.user.savedBooks || []
      });
    };
    load().catch(() => setState((value) => ({ ...value, loading: false })));
  }, []);

  const firstChild = state.children[0];
  const growthData = useMemo(() => ({
    labels: firstChild?.growthRecords?.map((item) => new Date(item.date).toLocaleDateString()) || [],
    datasets: [
      { label: 'Height (cm)', data: firstChild?.growthRecords?.map((item) => item.height) || [], borderColor: '#2563eb', backgroundColor: '#2563eb33' },
      { label: 'Weight (kg)', data: firstChild?.growthRecords?.map((item) => item.weight) || [], borderColor: '#14b8a6', backgroundColor: '#14b8a633' }
    ]
  }), [firstChild]);

  if (state.loading) return <LoadingState />;

  return (
    <div>
      <PageHeader
        eyebrow="Parent dashboard"
        title={`Welcome, ${user?.name?.split(' ')[0] || 'Parent'}`}
        description="Track your child growth, continue AI guidance, manage appointments, review payments, and return to saved resources."
        action={<Link className="btn-primary" to="/ai-assistant"><BrainCircuit size={18} /> Ask AI</Link>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Children Tracked" value={state.children.length} icon={BarChart3} />
        <StatCard label="Appointments" value={state.appointments.length} icon={CalendarDays} tone="violet" />
        <StatCard label="Payments" value={`₹${state.payments.reduce((sum, payment) => sum + (payment.status === 'paid' ? payment.amount : 0), 0)}`} icon={CreditCard} tone="mint" />
        <StatCard label="Saved Books" value={state.savedBooks.length} icon={BookOpen} tone="coral" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
        <section className="panel">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Growth Overview</h2>
            <Link to="/child-tracker" className="text-sm font-semibold text-ocean">Manage tracker</Link>
          </div>
          {firstChild ? <Line data={growthData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} /> : <EmptyState title="No child profile" text="Add a child profile to unlock growth charts and recommendations." />}
        </section>

        <section className="panel">
          <h2 className="text-lg font-bold">Upcoming Appointments</h2>
          <div className="mt-4 grid gap-3">
            {state.appointments.slice(0, 4).map((appointment) => (
              <div key={appointment._id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                <p className="font-bold">{appointment.counsellorId?.name}</p>
                <p className="text-sm text-slate-500">{new Date(appointment.date).toLocaleDateString()} · {appointment.time}</p>
                <span className="badge mt-2">{appointment.bookingStatus} · {appointment.paymentStatus}</span>
              </div>
            ))}
            {!state.appointments.length && <EmptyState title="No appointments" text="Book a counselling session when you need expert guidance." />}
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="panel">
          <h2 className="text-lg font-bold">Recent AI Chats</h2>
          <div className="mt-4 grid gap-3">
            {state.chats.slice(0, 3).map((chat) => (
              <Link to="/ai-assistant" key={chat._id} className="rounded-lg border border-slate-200 p-3 transition hover:border-ocean/40 dark:border-slate-800">
                <p className="font-bold">{chat.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{chat.messages?.at(-1)?.content}</p>
              </Link>
            ))}
          </div>
        </section>
        <section className="panel">
          <h2 className="text-lg font-bold">Saved Books</h2>
          <div className="mt-4 grid gap-3">
            {state.savedBooks.slice(0, 4).map((book) => (
              <a key={book._id} href={book.pdfLink} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                <img src={book.coverImage} alt={book.title} className="h-14 w-12 rounded-md object-cover" />
                <div>
                  <p className="font-bold">{book.title}</p>
                  <p className="text-sm text-slate-500">{book.author}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ParentDashboard;
