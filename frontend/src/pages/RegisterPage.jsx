import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { registerUser } from '../redux/slices/authSlice';

const RegisterPage = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: { role: 'parent' } });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const password = watch('password');

  const submit = async (values) => {
    const payload = { ...values };
    delete payload.confirmPassword;
    const result = await dispatch(registerUser(payload));
    if (registerUser.fulfilled.match(result)) navigate('/parent', { replace: true });
  };

  return (
    <main className="min-h-screen bg-mesh-light dark:bg-mesh-dark">
      <div className="container-page grid min-h-screen items-center gap-10 py-10 lg:grid-cols-[1fr_520px]">
        <section className="hidden lg:block">
          <Link to="/"><Logo /></Link>
          <h1 className="mt-10 max-w-2xl text-5xl font-extrabold tracking-normal dark:text-white">
            Build a calmer, smarter parenting support system.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Create an account to access AI guidance, counsellor booking, child tracking, books, articles, and forums.
          </p>
        </section>
        <section className="panel p-6 sm:p-8">
          <Link to="/" className="mb-8 block lg:hidden"><Logo /></Link>
          <h2 className="text-2xl font-extrabold dark:text-white">Create account</h2>
          <form onSubmit={handleSubmit(submit)} className="mt-6 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-sm font-semibold">
                Name
                <input className="input" {...register('name', { required: 'Name is required', minLength: 2 })} />
              </label>
              <label className="grid gap-1.5 text-sm font-semibold">
                Phone
                <input className="input" {...register('phone', { required: 'Phone is required' })} />
              </label>
            </div>
            <label className="grid gap-1.5 text-sm font-semibold">
              Email
              <input className="input" type="email" {...register('email', { required: 'Email is required' })} />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold">
              Role
              <select className="input" {...register('role')}>
                <option value="parent">Parent</option>
                <option value="counsellor">Counsellor</option>
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-sm font-semibold">
                Password
                <input className="input" type="password" {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })} />
              </label>
              <label className="grid gap-1.5 text-sm font-semibold">
                Confirm Password
                <input className="input" type="password" {...register('confirmPassword', { validate: (value) => value === password || 'Passwords must match' })} />
              </label>
            </div>
            {Object.values(errors)[0] && <p className="text-sm font-semibold text-red-500">{Object.values(errors)[0].message || 'Please check the form'}</p>}
            {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-600">{error}</p>}
            <button className="btn-primary w-full" disabled={status === 'loading'} type="submit">
              {status === 'loading' ? 'Creating account...' : 'Register'}
            </button>
            <p className="text-center text-sm text-slate-500">
              Already have an account? <Link className="font-semibold text-ocean" to="/login">Login</Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
};

export default RegisterPage;
