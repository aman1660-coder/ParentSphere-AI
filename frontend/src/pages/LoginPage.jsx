import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { loginUser } from '../redux/slices/authSlice';

const rolePath = (role) => (role === 'admin' ? '/admin' : role === 'counsellor' ? '/counsellor-dashboard' : '/parent');

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error } = useSelector((state) => state.auth);

  const submit = async (values) => {
    const result = await dispatch(loginUser(values));
    if (loginUser.fulfilled.match(result)) {
      navigate(location.state?.from?.pathname || rolePath(result.payload.user.role), { replace: true });
    }
  };

  return (
    <main className="min-h-screen bg-mesh-light dark:bg-mesh-dark">
      <div className="container-page grid min-h-screen items-center gap-10 py-10 lg:grid-cols-[1fr_460px]">
        <section className="hidden lg:block">
          <Link to="/"><Logo /></Link>
          <h1 className="mt-10 max-w-2xl text-5xl font-extrabold tracking-normal dark:text-white">
            Welcome back to your parenting command center.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Continue your AI chats, review child growth, book sessions, and manage resources with one secure login.
          </p>
        </section>
        <section className="panel p-6 sm:p-8">
          <Link to="/" className="mb-8 block lg:hidden"><Logo /></Link>
          <h2 className="text-2xl font-extrabold dark:text-white">Login</h2>
          <p className="mt-2 text-sm text-slate-500">Use your parent, counsellor, or admin account.</p>
          <form onSubmit={handleSubmit(submit)} className="mt-6 grid gap-4">
            <label className="grid gap-1.5 text-sm font-semibold">
              Email
              <input className="input" type="email" {...register('email', { required: 'Email is required' })} />
              {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
            </label>
            <label className="grid gap-1.5 text-sm font-semibold">
              Password
              <input className="input" type="password" {...register('password', { required: 'Password is required' })} />
              {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
            </label>
            <div className="flex items-center justify-between text-sm">
              <Link className="font-semibold text-ocean" to="/forgot-password">Forgot password?</Link>
              <Link className="font-semibold text-ocean" to="/register">Create account</Link>
            </div>
            {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-600">{error}</p>}
            <button className="btn-primary w-full" disabled={status === 'loading'} type="submit">
              {status === 'loading' ? 'Signing in...' : 'Login'}
            </button>
          </form>
          <div className="mt-6 rounded-lg bg-slate-100 p-3 text-xs leading-5 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            Demo: parent@parentsphere.com / Parent@12345 · admin@parentsphere.com / Admin@12345
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
