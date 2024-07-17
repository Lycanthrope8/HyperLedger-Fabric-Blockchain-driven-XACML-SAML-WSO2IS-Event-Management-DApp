// AdminPanel.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCheckUserAccess from '../hooks/useCheckUserAccess';
import { useUser } from '../context/UserContext';

const AdminPanel = () => {
  const { userInfo, loading: userLoading, error } = useUser();
  const { checkUserAccess, loading: accessLoading } = useCheckUserAccess();
  const [isAuthorized, setIsAuthorized] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      if (userInfo && isAuthorized === null) {
        const hasAccess = await checkUserAccess(userInfo.username, "/admin-panel", "GET");
        setIsAuthorized(hasAccess);
      }
    };
    checkAccess();
  }, [userInfo, isAuthorized, checkUserAccess]);

  useEffect(() => {
    if (isAuthorized === false) {
      navigate('/not-authorized');
    }
  }, [isAuthorized, navigate]);

  if (userLoading || accessLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    isAuthorized !== false && (
      <div>
        <h1>This is Admin Panel</h1>
      </div>
    )
  );
}

export default AdminPanel;
