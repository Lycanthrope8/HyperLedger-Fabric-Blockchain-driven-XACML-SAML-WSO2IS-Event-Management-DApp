import { useState } from 'react';

const useCheckUserAccess = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkUserAccess = async (username, resource, action) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://localhost:3000/app/check-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, resource, action }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Access check failed! Status: ${response.status}`);
      }

      const result = await response.json();
      return result.redirect || null;
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { checkUserAccess, loading, error };
};

export default useCheckUserAccess;
