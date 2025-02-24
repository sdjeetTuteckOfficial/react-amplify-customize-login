import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { signIn, getCurrentUser } from 'aws-amplify/auth';
import { useAuthenticator } from '@aws-amplify/ui-react';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const { user } = useAuthenticator((context) => [context.user]);
  const navigate = useNavigate();

  if (user) {
    return <Navigate to='/dashboard' />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await signIn({
        username: formData.username,
        password: formData.password,
      });
      console.log('res', response);
      if (
        response.isSignedIn === false &&
        response.nextStep.signInStep === 'CONFIRM_SIGN_UP'
      ) {
        setError('User need to be verify by admin');
      }
      if (response.isSignedIn) {
        const user = await getCurrentUser();
        console.log('user', user);
        window.location.reload();
        navigate('/dashboard');
      }
    } catch (err) {
      console.log('err', err);
      setError(err.message);
    }
  };

  return (
    <div className='container text-center'>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type='text'
          name='username'
          placeholder='Username'
          value={formData.username}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type='password'
          name='password'
          placeholder='Password'
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br />
        <button type='submit'>Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
