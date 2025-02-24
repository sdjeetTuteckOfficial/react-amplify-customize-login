import { useState, useEffect } from 'react';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      const user = await getCurrentUser();
      console.log('user', user);
      setUser(user);
    }
    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    const res = await signOut();
    console.log('response signout', res);
  };

  return (
    <div className='container text-center'>
      <h2>Welcome, {user?.username}!</h2>
      <button onClick={handleSignOut}>Logout</button>
    </div>
  );
};

export default Dashboard;
