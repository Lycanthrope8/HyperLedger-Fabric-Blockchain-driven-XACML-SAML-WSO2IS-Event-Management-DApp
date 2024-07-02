import { useState, useCallback } from 'react';

const useCheckUserAccess = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkUserAccess = useCallback(async (username, resource, action) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://localhost:3000/app/check-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, resource, action }),
        credentials: "include",
      });

      if (response.status === 403) {
        // Handle unauthorized access
        setError("You are not authorized for this resource");
        return null;
      }

      if (!response.ok) {
        throw new Error(`Access check failed! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.redirect) {
        return data.redirect;
      } else {
        setError("Unexpected response format");
        return null;
      }
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { checkUserAccess, loading, error };
};

export default useCheckUserAccess;
