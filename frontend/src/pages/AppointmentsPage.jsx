import { CalendarDays, CreditCard } from 'lucide-react';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../hooks/useAuth';
import api, { apiError } from '../services/api';
import { openRazorpayCheckout } from '../services/razorpay';

const AppointmentsPage = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    const { data } = await api.get('/appointments');
    setAppointments(data.appointments);
  };

  useEffect(() => {
    load();
  }, []);

  const pay = async (appointment) => {
    try {
      const { data: orderData } = await api.post('/payments/create-order', { appointmentId: appointment._id });
      const result = await openRazorpayCheckout({ order: orderData.order, keyId: orderData.keyId, user, counsellor: appointment.counsellorId });
      await api.post('/payments/verify', { appointmentId: appointment._id, ...result });
      load();
    } catch (err) {
      setError(apiError(err));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="container-page py-8">
        <PageHeader
          eyebrow="Appointments"
          title="Counselling bookings"
          description="Review every booked slot, payment status, meeting link, and counsellor notes."
        />
        {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-600">{error}</p>}
        <section className="panel overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr><th className="py-2">Counsellor</th><th>Date</th><th>Time</th><th>Booking</th><th>Payment</th><th>Meeting</th><th>Action</th></tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment._id} className="border-t border-slate-200 dark:border-slate-800">
                  <td className="py-3 font-semibold">{appointment.counsellorId?.name || appointment.userId?.name}</td>
                  <td>{new Date(appointment.date).toLocaleDateString()}</td>
                  <td>{appointment.time}</td>
                  <td><span className="badge">{appointment.bookingStatus}</span></td>
                  <td>{appointment.paymentStatus}</td>
                  <td>{appointment.meetingLink ? <a className="text-ocean" href={appointment.meetingLink}>Open</a> : 'After payment'}</td>
                  <td>
                    {appointment.paymentStatus !== 'paid' && user?.role !== 'counsellor' ? (
                      <button className="btn-primary !px-3 !py-1.5" onClick={() => pay(appointment)}><CreditCard size={16} /> Pay</button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-500"><CalendarDays size={15} /> Scheduled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AppointmentsPage;
