import { Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import api, { apiError } from '../services/api';

const ForgotPasswordPage = () => {
  const { register, handleSubmit } = useForm();
  const [state, setState] = useState({ loading: false, message: '', error: '' });

  const submit = async (values) => {
    setState({ loading: true, message: '', error: '' });
    try {
      const { data } = await api.post('/auth/forgot-password', values);
      setState({ loading: false, message: data.message, error: '' });
    } catch (error) {
      setState({ loading: false, message: '', error: apiError(error) });
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-mesh-light p-4 dark:bg-mesh-dark">
      <section className="panel w-full max-w-md p-8">
        <Link to="/"><Logo /></Link>
        <div className="mt-8 grid h-12 w-12 place-items-center rounded-lg bg-ocean/10 text-ocean"><Mail /></div>
        <h1 className="mt-4 text-2xl font-extrabold dark:text-white">Reset password</h1>
        <p className="mt-2 text-sm text-slate-500">Enter your email and Parentsphere will send a secure reset link.</p>
        <form onSubmit={handleSubmit(submit)} className="mt-6 grid gap-4">
          <input className="input" type="email" placeholder="Email address" {...register('email', { required: true })} />
          {state.message && <p className="rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{state.message}</p>}
          {state.error && <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-600">{state.error}</p>}
          <button className="btn-primary" disabled={state.loading} type="submit">{state.loading ? 'Sending...' : 'Send reset link'}</button>
          <Link to="/login" className="text-center text-sm font-semibold text-ocean">Back to login</Link>
        </form>
      </section>
    </main>
  );
};

export default ForgotPasswordPage;
