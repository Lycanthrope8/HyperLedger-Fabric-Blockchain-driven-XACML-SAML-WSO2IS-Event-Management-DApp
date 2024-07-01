import { useState, useEffect } from 'react';
import axios from 'axios';

function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    axios.get('https://localhost:3000/app/status', { withCredentials: true })
      .then(response => {
        setAuthenticated(response.data.authenticated);
      })
      .catch(error => {
        console.error('Error checking authentication status:', error);
      });
  }, []);

  return { authenticated };
}

export default useAuth;
