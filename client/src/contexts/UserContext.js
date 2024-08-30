import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the user context with default values and a function placeholder
const UserContext = createContext({
  userProfile: {
    displayName: "",
    email: "",
    firstName: "",
    fullName: "",
    lastName: "",
    phoneNumbers: [],
    roles: [],
    username: "",
  },
//   setUserProfile: () => {}  // Placeholder function for updating the user profile
});

// Custom hook to use the user context easily in any component
export function useUser() {
  return useContext(UserContext);
}

// Provider component that fetches user data and updates context
export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState({
    displayName: "",
    email: "",
    firstName: "",
    fullName: "",
    lastName: "",
    phoneNumbers: [],
    roles: [],
    username: "",
  });

  // Function to fetch user profile from your server
  const fetchUserProfile = async () => {
    try {
        const response = await fetch('https://localhost:3000/user-profile', {
            method: 'GET',
            credentials: 'include'  // Necessary for cookies to be sent and received
        });
        if (!response.ok) {
            throw new Error(`HTTP status ${response.status}`);
        }
        const data = await response.json();
        setUserProfile(data);
    } catch (error) {
        console.error("Failed to fetch user profile:", error.message);
    }
};

  

  // Fetch user profile once when the component mounts
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Context provider value
  const value = {
    userProfile,
    setUserProfile
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
