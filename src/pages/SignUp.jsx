import { useState, useEffect } from 'react';
import { signUp, confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Alert,
  FormControl,
  FormLabel,
  Stack,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    otp: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false); // Track OTP step
  const navigate = useNavigate();
  const { user } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    setFormData({ username: '', password: '', confirmPassword: '', otp: '' });
  }, []);

  if (user) {
    return <Navigate to='/dashboard' />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

      setIsOtpSent(true); // Switch to OTP input
    } catch (err) {
      setError(err.message);
    }
  };

  const handleConfirmOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await confirmSignUp({
        username: formData.username,
        confirmationCode: formData.otp,
      });
      setSuccess('Sign-up successful! Please check your email for the OTP.');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResendOtp = async () => {
    setError(null);
    setSuccess(null);

    try {
      await resendSignUpCode({
        username: formData.username,
      });

      setSuccess('OTP has been resent to your email.');
    } catch (err) {
      setError(err.message);
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
            {isOtpSent ? 'Verify OTP' : 'Sign Up'}
          </Typography>

          {isOtpSent ? (
            // OTP Verification Form
            <form onSubmit={handleConfirmOtp} autoComplete='off'>
              <Stack spacing={2}>
                <FormControl fullWidth>
                  <FormLabel>Enter OTP</FormLabel>
                  <TextField
                    name='otp'
                    fullWidth
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder='Enter OTP'
                    autoComplete='off'
                    size='small'
                    sx={{ mb: 1 }}
                  />
                </FormControl>

                <Button
                  type='submit'
                  variant='contained'
                  color='primary'
                  fullWidth
                  sx={{ fontWeight: 700 }}
                >
                  Verify OTP
                </Button>

                <Button
                  variant='text'
                  color='secondary'
                  fullWidth
                  onClick={handleResendOtp}
                  sx={{ fontWeight: 700 }}
                >
                  Resend OTP
                </Button>
              </Stack>
            </form>
          ) : (
            // Sign Up Form
            <form onSubmit={handleSignUp} autoComplete='off'>
              <Stack spacing={2}>
                <FormControl fullWidth>
                  <FormLabel>Email</FormLabel>
                  <TextField
                    name='username'
                    fullWidth
                    value={formData.username}
                    onChange={handleChange}
                    placeholder='Enter your Email'
                    autoComplete='off'
                    size='small'
                    sx={{ mb: 1 }}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <FormLabel>Password</FormLabel>
                  <TextField
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    value={formData.password}
                    onChange={handleChange}
                    placeholder='Enter your Password'
                    autoComplete='new-password'
                    size='small'
                    sx={{ mb: 1 }}
                    InputProps={{
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
                    }}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <FormLabel>Confirm Password</FormLabel>
                  <TextField
                    name='confirmPassword'
                    type={showConfirmPassword ? 'text' : 'password'}
                    fullWidth
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder='Please confirm your Password'
                    autoComplete='new-password'
                    size='small'
                    sx={{ mb: 1 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            edge='end'
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
                <Button
                  type='submit'
                  variant='contained'
                  color='primary'
                  fullWidth
                  sx={{ fontWeight: 700 }}
                >
                  Sign Up
                </Button>
              </Stack>
            </form>
          )}
          {!isOtpSent && (
            <Typography
              variant='body2'
              align='center'
              sx={{ mt: 2, cursor: 'pointer', color: 'primary.main' }}
              onClick={() => navigate('/')}
            >
              Already a user? Sign in
            </Typography>
          )}
        </CardContent>
        {error && <Alert severity='error'>{error}</Alert>}
        {success && <Alert severity='success'>{success}</Alert>}
      </Card>
    </Container>
  );
};

export default SignUpPage;
