import { useAuthenticator } from '@aws-amplify/ui-react';
const Dashboard = () => {
  const { user, signOut } = useAuthenticator((context) => [
    context.user,
    context.signOut,
  ]);

  return (
    <div className='container text-center'>
      <h2>Welcome, {user?.username}!</h2>
      <button onClick={signOut}>Logout</button>
    </div>
  );
};

export default Dashboard;
