import { CheckCircle2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Logo from '../components/Logo';
import api, { apiError } from '../services/api';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const [state, setState] = useState({ loading: true, message: '', error: '' });

  useEffect(() => {
    api
      .get(`/auth/verify-email/${token}`)
      .then(({ data }) => setState({ loading: false, message: data.message, error: '' }))
      .catch((error) => setState({ loading: false, message: '', error: apiError(error) }));
  }, [token]);

  return (
    <main className="grid min-h-screen place-items-center bg-mesh-light p-4 dark:bg-mesh-dark">
      <section className="panel w-full max-w-md p-8 text-center">
        <div className="flex justify-center"><Logo /></div>
        <div className={`mx-auto mt-8 grid h-14 w-14 place-items-center rounded-lg ${state.error ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
          {state.error ? <XCircle /> : <CheckCircle2 />}
        </div>
        <h1 className="mt-4 text-2xl font-extrabold dark:text-white">
          {state.loading ? 'Verifying email...' : state.error ? 'Verification failed' : 'Email verified'}
        </h1>
        <p className="mt-2 text-sm text-slate-500">{state.error || state.message || 'Please wait.'}</p>
        <Link to="/login" className="btn-primary mt-6">Continue to login</Link>
      </section>
    </main>
  );
};

export default VerifyEmailPage;
