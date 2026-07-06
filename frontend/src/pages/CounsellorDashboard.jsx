import 'chart.js/auto';
import { CalendarDays, CheckCircle2, IndianRupee, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import api from '../services/api';

const CounsellorDashboard = () => {
  const [appointments, setAppointments] = useState([]);

  const load = async () => {
    const { data } = await api.get('/appointments');
    setAppointments(data.appointments);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, bookingStatus) => {
    await api.patch(`/appointments/${id}/status`, { bookingStatus });
    load();
  };

  const earnings = appointments
    .filter((appointment) => appointment.paymentStatus === 'paid')
    .reduce((sum, appointment) => sum + (appointment.counsellorId?.fee || 0), 0);

  const chartData = useMemo(() => {
    const counts = appointments.reduce((acc, item) => ({ ...acc, [item.bookingStatus]: (acc[item.bookingStatus] || 0) + 1 }), {});
    return {
      labels: Object.keys(counts),
      datasets: [{ data: Object.values(counts), backgroundColor: ['#2563eb', '#14b8a6', '#f97364', '#7c3aed'] }]
    };
  }, [appointments]);

  return (
    <div>
      <PageHeader
        eyebrow="Counsellor dashboard"
        title="Manage sessions and client history"
        description="Review bookings, update appointment progress, track earnings, and prepare for upcoming parent sessions."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Sessions" value={appointments.length} icon={CalendarDays} />
        <StatCard label="Confirmed" value={appointments.filter((item) => item.bookingStatus === 'confirmed').length} icon={CheckCircle2} tone="mint" />
        <StatCard label="Clients" value={new Set(appointments.map((item) => item.userId?._id)).size} icon={Users} tone="violet" />
        <StatCard label="Earnings" value={`₹${earnings}`} icon={IndianRupee} tone="coral" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
        <section className="panel">
          <h2 className="text-lg font-bold">Appointment Status</h2>
          <div className="mt-5">
            <Doughnut data={chartData} options={{ plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </section>
        <section className="panel">
          <h2 className="text-lg font-bold">Session Calendar</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-2">Parent</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment._id} className="border-t border-slate-200 dark:border-slate-800">
                    <td className="py-3 font-semibold">{appointment.userId?.name}</td>
                    <td>{new Date(appointment.date).toLocaleDateString()}</td>
                    <td>{appointment.time}</td>
                    <td><span className="badge">{appointment.paymentStatus}</span></td>
                    <td>{appointment.bookingStatus}</td>
                    <td className="flex gap-2 py-2">
                      <button className="btn-secondary !px-3 !py-1.5" onClick={() => updateStatus(appointment._id, 'completed')}>Complete</button>
                      <button className="btn-secondary !px-3 !py-1.5" onClick={() => updateStatus(appointment._id, 'cancelled')}>Cancel</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CounsellorDashboard;
