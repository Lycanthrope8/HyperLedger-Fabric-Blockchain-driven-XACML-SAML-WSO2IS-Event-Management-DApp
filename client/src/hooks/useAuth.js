import { useState, useEffect } from 'react';
import axios from 'axios';

function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://localhost:3000/app/status', { withCredentials: true })
      .then(response => {
        setAuthenticated(response.data.authenticated);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error checking authentication status:', error);
        setLoading(false);
      });
  }, []);

  return { authenticated, loading };
}

export default useAuth;
