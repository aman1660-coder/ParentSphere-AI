import 'chart.js/auto';
import { BarChart3, BookOpen, CalendarDays, IndianRupee, Users, Video } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import api from '../services/api';

const AdminDashboard = () => {
  const [state, setState] = useState({ analytics: null, users: [], appointments: [], payments: [], resources: {} });

  const load = async () => {
    const [analytics, users, appointments, payments, books, articles, videos, counsellors] = await Promise.all([
      api.get('/admin/analytics'),
      api.get('/admin/users'),
      api.get('/appointments'),
      api.get('/payments'),
      api.get('/books'),
      api.get('/articles'),
      api.get('/videos'),
      api.get('/counsellors')
    ]);
    setState({
      analytics: analytics.data.analytics,
      users: users.data.users,
      appointments: appointments.data.appointments,
      payments: payments.data.payments,
      resources: {
        books: books.data.books,
        articles: articles.data.articles,
        videos: videos.data.videos,
        counsellors: counsellors.data.counsellors
      }
    });
  };

  useEffect(() => {
    load();
  }, []);

  const updateRole = async (id, role) => {
    await api.patch(`/admin/users/${id}/role`, { role });
    load();
  };

  const monthlyChart = useMemo(() => {
    const rows = state.analytics?.monthlyRevenue || [];
    return {
      labels: rows.map((row) => `${row._id.month}/${row._id.year}`),
      datasets: [{ label: 'Revenue', data: rows.map((row) => row.total), borderColor: '#2563eb', backgroundColor: '#2563eb33' }]
    };
  }, [state.analytics]);

  const roleChart = useMemo(() => {
    const rows = state.analytics?.roleBreakdown || [];
    return {
      labels: rows.map((row) => row._id),
      datasets: [{ data: rows.map((row) => row.count), backgroundColor: ['#2563eb', '#7c3aed', '#14b8a6'] }]
    };
  }, [state.analytics]);

  const bookingChart = useMemo(() => {
    const rows = state.analytics?.bookingStatus || [];
    return {
      labels: rows.map((row) => row._id),
      datasets: [{ label: 'Bookings', data: rows.map((row) => row.count), backgroundColor: '#7c3aed' }]
    };
  }, [state.analytics]);

  const totals = state.analytics?.totals || {};

  return (
    <div>
      <PageHeader
        eyebrow="Admin dashboard"
        title="Platform operations and analytics"
        description="Manage users, monitor bookings and payments, review resources, and track Parentsphere growth."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Users" value={totals.users || 0} icon={Users} />
        <StatCard label="Revenue" value={`₹${totals.revenue || 0}`} icon={IndianRupee} tone="mint" />
        <StatCard label="Bookings" value={totals.appointments || 0} icon={CalendarDays} tone="violet" />
        <StatCard label="Resources" value={(totals.books || 0) + (totals.articles || 0) + (totals.videos || 0)} icon={BookOpen} tone="coral" />
      </div>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <div className="panel">
          <h2 className="text-lg font-bold">Revenue Trend</h2>
          <Line data={monthlyChart} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
        </div>
        <div className="panel">
          <h2 className="text-lg font-bold">Role Breakdown</h2>
          <Doughnut data={roleChart} options={{ plugins: { legend: { position: 'bottom' } } }} />
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[.75fr_1.25fr]">
        <div className="panel">
          <h2 className="text-lg font-bold">Bookings</h2>
          <Bar data={bookingChart} options={{ plugins: { legend: { display: false } } }} />
        </div>
        <div id="users" className="panel">
          <h2 className="text-lg font-bold">User Management</h2>
          <div className="mt-4 max-h-[420px] overflow-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr><th className="py-2">Name</th><th>Email</th><th>Role</th><th>Verified</th><th>Change Role</th></tr>
              </thead>
              <tbody>
                {state.users.map((user) => (
                  <tr key={user._id} className="border-t border-slate-200 dark:border-slate-800">
                    <td className="py-3 font-semibold">{user.name}</td>
                    <td>{user.email}</td>
                    <td><span className="badge">{user.role}</span></td>
                    <td>{user.isEmailVerified ? 'Yes' : 'No'}</td>
                    <td>
                      <select className="input !py-1.5" value={user.role} onChange={(event) => updateRole(user._id, event.target.value)}>
                        <option value="parent">Parent</option>
                        <option value="counsellor">Counsellor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="resources" className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Books" value={state.resources.books?.length || 0} icon={BookOpen} />
        <StatCard label="Articles" value={state.resources.articles?.length || 0} icon={BarChart3} tone="violet" />
        <StatCard label="Videos" value={state.resources.videos?.length || 0} icon={Video} tone="mint" />
        <StatCard label="Counsellors" value={state.resources.counsellors?.length || 0} icon={Users} tone="coral" />
      </section>

      <section id="payments" className="panel mt-6">
        <h2 className="text-lg font-bold">Payment Monitoring</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr><th className="py-2">Payment</th><th>User</th><th>Appointment</th><th>Amount</th><th>Status</th><th>Provider</th></tr>
            </thead>
            <tbody>
              {state.payments.map((payment) => (
                <tr key={payment._id} className="border-t border-slate-200 dark:border-slate-800">
                  <td className="py-3 font-semibold">{payment.paymentId}</td>
                  <td>{payment.userId?.name}</td>
                  <td>{payment.appointmentId?.counsellorId?.name}</td>
                  <td>₹{payment.amount}</td>
                  <td><span className="badge">{payment.status}</span></td>
                  <td>{payment.provider}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
