import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Logo from '../components/Logo';
import api, { apiError } from '../services/api';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [state, setState] = useState({ loading: false, error: '' });
  const password = watch('password');

  const submit = async (values) => {
    setState({ loading: true, error: '' });
    try {
      const { data } = await api.post(`/auth/reset-password/${token}`, { password: values.password });
      localStorage.setItem('parentsphere_access_token', data.accessToken);
      localStorage.setItem('parentsphere_refresh_token', data.refreshToken);
      localStorage.setItem('parentsphere_user', JSON.stringify(data.user));
      navigate('/parent', { replace: true });
    } catch (error) {
      setState({ loading: false, error: apiError(error) });
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-mesh-light p-4 dark:bg-mesh-dark">
      <section className="panel w-full max-w-md p-8">
        <Link to="/"><Logo /></Link>
        <h1 className="mt-8 text-2xl font-extrabold dark:text-white">Choose a new password</h1>
        <form onSubmit={handleSubmit(submit)} className="mt-6 grid gap-4">
          <input className="input" type="password" placeholder="New password" {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })} />
          <input className="input" type="password" placeholder="Confirm password" {...register('confirmPassword', { validate: (value) => value === password || 'Passwords must match' })} />
          {Object.values(errors)[0] && <p className="text-sm font-semibold text-red-500">{Object.values(errors)[0].message}</p>}
          {state.error && <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-600">{state.error}</p>}
          <button className="btn-primary" disabled={state.loading} type="submit">{state.loading ? 'Updating...' : 'Update password'}</button>
        </form>
      </section>
    </main>
  );
};

export default ResetPasswordPage;
