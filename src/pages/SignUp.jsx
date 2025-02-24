import { useState } from 'react';
import { signUp } from 'aws-amplify/auth';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      await signUp({
        username: formData.username,
        password: formData.password,
      });

      setSuccess('Sign-up successful! Please wait for admin confirmation!');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='container text-center'>
      <h2>Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {success === null && (
        <form onSubmit={handleSignUp}>
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
          <input
            type='password'
            name='confirmPassword'
            placeholder='Confirm Password'
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <br />
          <button type='submit'>Sign Up</button>
        </form>
      )}
    </div>
  );
};

export default SignUpPage;
