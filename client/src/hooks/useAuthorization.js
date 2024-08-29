import { useState, useEffect } from 'react';
import axios from 'axios';

const useAuthorization = (subject, action, resource) => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                setLoading(true);
                const response = await axios.post('https://localhost:3000/xacml/enforce', {
                    subject,
                    action,
                    resource,
                });
                

                // Update the condition to handle string response
                const granted = response.data === 'Result: Access granted';
                setIsAuthorized(granted);
            } catch (err) {
                setError(err);
                console.error('Authorization Error:', err);
            } finally {
                setLoading(false);
            }
        };

        checkAuthorization();
    }, [subject, action, resource]);

    return { isAuthorized, loading, error };
};

export default useAuthorization;
