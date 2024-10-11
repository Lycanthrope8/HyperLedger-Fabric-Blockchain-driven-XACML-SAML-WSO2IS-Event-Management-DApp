import React, { createContext, useState, useContext, useEffect } from "react";

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
  setUserProfile: () => {}, // Placeholder function for updating the user profile
  loading: true, // Add loading state in the context
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
  const [loading, setLoading] = useState(true); // Loading state to manage fetching

  // Function to fetch user profile from your server
  const fetchUserProfile = async () => {
    try {
      const response = await fetch("https://localhost:3000/user-profile", {
        method: "GET",
        credentials: "include", // Necessary for cookies to be sent and received
      });

      if (response.status === 401) {
        // Handle case where user is not logged in (401 Unauthorized)
        console.log("User is not logged in.");
        setUserProfile({
          displayName: "",
          email: "",
          firstName: "",
          fullName: "",
          lastName: "",
          phoneNumbers: [],
          roles: [],
          username: "",
        });
        setLoading(false); // Ensure to set loading to false
        return; // Early return to prevent further execution
      }

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      // Check if the response body is empty
      const text = await response.text();
      if (!text) {
        console.log("No user profile available (empty response).");
        setLoading(false); // Set loading to false if response is empty
        return; // Don't throw an error, just return silently
      }

      // Attempt to parse the JSON
      const data = JSON.parse(text);

      // Optional: Add validation to check if the expected fields are present
      if (!data || typeof data !== "object" || !data.username) {
        throw new Error("Invalid JSON format");
      }

      setUserProfile(data);
    } catch (error) {
      console.error("Failed to fetch user profile:", error.message);
    } finally {
      setLoading(false); // Ensure loading is set to false after fetching
    }
  };

  // Fetch user profile once when the component mounts
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Context provider value
  const value = {
    userProfile,
    setUserProfile,
    loading,
  };

  // Return a loading spinner or similar component until user profile is fetched
  if (loading) {
    return <div>Loading user profile...</div>; // Or a better loading UI
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
