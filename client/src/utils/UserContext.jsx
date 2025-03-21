import React, { createContext, useState, useEffect, useMemo } from "react";
import { getAuth0User } from "./auth0";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const { isAuthenticated, user } = await getAuth0User();
        if (isAuthenticated && user) {
          setCurrentUser(user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, []);

  const value = useMemo(
    () => ({ currentUser, setCurrentUser, loading }),
    [currentUser, loading]
  );

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};