import { useState } from 'react';
import { signUp } from 'aws-amplify/auth';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import { useAuthenticator } from '@aws-amplify/ui-react';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const { user } = useAuthenticator((context) => [context.user]);

  if (user) {
    return <Navigate to='/dashboard' />;
  }

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await signUp({
        username: formData.username,
        password: formData.password,
      });
      setSuccess('Sign-up successful! Please wait for admin confirmation.');
      setFormData({ username: '', password: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container
      maxWidth='sm'
      sx={{
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100vh',
        alignItems: 'center',
      }}
    >
      <Card sx={{ p: 4, width: '100%', boxShadow: 3 }}>
        <CardContent>
          <Typography variant='h4' align='center' gutterBottom>
            Sign Up
          </Typography>

          {!success && (
            <form onSubmit={handleSignUp}>
              <TextField
                name='username'
                label='Username'
                fullWidth
                margin='normal'
                value={formData.username}
                onChange={handleChange}
              />
              <TextField
                name='password'
                label='Password'
                type='password'
                fullWidth
                margin='normal'
                value={formData.password}
                onChange={handleChange}
              />
              <TextField
                name='confirmPassword'
                label='Confirm Password'
                type='password'
                fullWidth
                margin='normal'
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <Button
                type='submit'
                variant='contained'
                color='primary'
                fullWidth
                sx={{ mt: 2 }}
              >
                Sign Up
              </Button>
            </form>
          )}
          <Typography onClick={() => navigate('/')} fullWidth sx={{ mt: 2 }}>
            Already a user? Sign in
          </Typography>
        </CardContent>
        {error && <Alert severity='error'>{error}</Alert>}
        {success && <Alert severity='success'>{success}</Alert>}
      </Card>
    </Container>
  );
};

export default SignUpPage;
