import { CalendarDays, CheckCircle2, CreditCard } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import LoadingState from '../components/LoadingState';
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../hooks/useAuth';
import api, { apiError } from '../services/api';
import { openRazorpayCheckout } from '../services/razorpay';

const AppointmentBookingPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [state, setState] = useState({ loading: true, counsellor: null, message: '', error: '' });
  const [form, setForm] = useState({ date: '', time: '', notes: '' });
  const [confirmed, setConfirmed] = useState(null);

  useEffect(() => {
    api.get(`/counsellors/${id}`)
      .then(({ data }) => setState({ loading: false, counsellor: data.counsellor, message: '', error: '' }))
      .catch((error) => setState({ loading: false, counsellor: null, message: '', error: apiError(error) }));
  }, [id]);

  const slots = useMemo(() => {
    const all = state.counsellor?.availability?.flatMap((item) => item.slots.map((slot) => `${item.day} · ${slot}`)) || [];
    return all.length ? all : ['Monday · 10:00 AM', 'Wednesday · 02:00 PM'];
  }, [state.counsellor]);

  const book = async (event) => {
    event.preventDefault();
    if (!user) return navigate('/login', { state: { from: { pathname: `/counsellors/${id}/book` } } });
    setState((value) => ({ ...value, message: '', error: '' }));
    try {
      const slot = form.time.split(' · ').at(-1);
      const { data: appointmentData } = await api.post('/appointments', {
        counsellorId: id,
        date: form.date,
        time: slot,
        notes: form.notes
      });
      const { data: orderData } = await api.post('/payments/create-order', { appointmentId: appointmentData.appointment._id });
      const paymentResult = await openRazorpayCheckout({
        order: orderData.order,
        keyId: orderData.keyId,
        user,
        counsellor: state.counsellor
      });
      const { data: verified } = await api.post('/payments/verify', {
        appointmentId: appointmentData.appointment._id,
        ...paymentResult
      });
      setConfirmed(verified.appointment);
    } catch (error) {
      setState((value) => ({ ...value, error: apiError(error) }));
    }
  };

  if (state.loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="container-page py-8">
        <PageHeader
          eyebrow="Appointment Booking"
          title={state.counsellor?.name || 'Book a session'}
          description={state.counsellor?.description}
        />
        {confirmed ? (
          <section className="panel mx-auto max-w-2xl text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-emerald-50 text-emerald-600"><CheckCircle2 /></div>
            <h2 className="mt-4 text-2xl font-extrabold">Booking confirmed</h2>
            <p className="mt-2 text-slate-500">Your payment is successful and the appointment is confirmed.</p>
            <div className="mt-5 rounded-lg bg-slate-100 p-4 text-left text-sm dark:bg-slate-800">
              <p><strong>Date:</strong> {new Date(confirmed.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {confirmed.time}</p>
              <p><strong>Meeting:</strong> <a className="text-ocean" href={confirmed.meetingLink}>{confirmed.meetingLink}</a></p>
            </div>
            <Link to="/appointments" className="btn-primary mt-6">View Appointments</Link>
          </section>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
            <section className="panel">
              <img src={state.counsellor.image} alt={state.counsellor.name} className="h-80 w-full rounded-lg object-cover" />
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="badge">{state.counsellor.specialization}</span>
                <span className="badge">{state.counsellor.experience} years</span>
                <span className="badge">₹{state.counsellor.fee}</span>
                <span className="badge">{state.counsellor.mode}</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">{state.counsellor.qualification}</p>
            </section>
            <form onSubmit={book} className="panel h-max grid gap-4">
              <h2 className="flex items-center gap-2 text-xl font-bold"><CalendarDays /> Choose slot</h2>
              <input className="input" type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} required />
              <select className="input" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} required>
                <option value="">Select time slot</option>
                {slots.map((slot) => <option key={slot}>{slot}</option>)}
              </select>
              <textarea className="input min-h-28" placeholder="Notes for counsellor" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
              {state.error && <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-600">{state.error}</p>}
              <button className="btn-primary" type="submit"><CreditCard size={18} /> Pay ₹{state.counsellor.fee} and Confirm</button>
              {!user && <p className="text-sm text-slate-500">You will be asked to login before payment.</p>}
            </form>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AppointmentBookingPage;
