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
  Stack,
  Alert,
  CardContent,
  FormControl,
  FormLabel,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
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
    setLoading(true);

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
        setError('User needs to be verified by admin');
      }
      if (response.isSignedIn) {
        const user = await getCurrentUser();
        console.log('user', user);
        navigate('/dashboard');
        setLoading(false);
      }
    } catch (err) {
      console.log('err', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth='xs'
      sx={{
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100vh',
        alignItems: 'center',
      }}
    >
      <Card sx={{ p: 1, width: '100%', boxShadow: 3 }} elevation={0}>
        <CardContent>
          <Typography variant='h4' align='center' gutterBottom>
            Sign In
          </Typography>
          <form onSubmit={handleLogin}>
            <Stack spacing={2}>
              <FormControl fullWidth>
                <FormLabel>Email</FormLabel>
                <TextField
                  variant='outlined'
                  name='username'
                  value={formData.username}
                  onChange={handleChange}
                  placeholder='Enter your Email'
                  autoComplete='username'
                  fullWidth
                  required
                  size='small'
                  sx={{ mb: 1 }}
                />
              </FormControl>
              <FormControl fullWidth>
                <FormLabel>Password</FormLabel>
                <TextField
                  variant='outlined'
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='Enter your Password'
                  autoComplete='new-password'
                  fullWidth
                  required
                  size='small'
                  sx={{ mb: 1 }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge='end'
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </FormControl>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                fullWidth
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
              {error && <Alert severity='error'>{error}</Alert>}
            </Stack>
          </form>

          <Typography
            variant='body2'
            align='center'
            sx={{ mt: 2, cursor: 'pointer', color: 'primary.main' }}
            onClick={() => navigate('/signup')}
          >
            Not a user? Signup
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LoginPage;
