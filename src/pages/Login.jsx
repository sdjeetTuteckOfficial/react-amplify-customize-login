import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { signIn, getCurrentUser } from 'aws-amplify/auth';
import { useAuthenticator } from '@aws-amplify/ui-react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Box,
  Alert,
} from '@mui/material';

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
        setError('User needs to be verified by an admin.');
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
    <Container maxWidth='xs'>
      <Card sx={{ mt: 8, p: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant='h5' align='center' gutterBottom>
            Login
          </Typography>

          <Box component='form' onSubmit={handleLogin} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label='Username'
              name='username'
              value={formData.username}
              onChange={handleChange}
              required
              margin='normal'
            />
            <TextField
              fullWidth
              label='Password'
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              required
              margin='normal'
            />
            {error && <Alert severity='error'>{error}</Alert>}
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          </Box>

          <Typography
            variant='body2'
            align='center'
            sx={{ mt: 2, cursor: 'pointer', color: 'primary.main' }}
            onClick={() => navigate('/signup')}
          >
            Not a user? Sign up
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LoginPage;
