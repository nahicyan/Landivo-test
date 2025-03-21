import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../utils/UserContext";
import { getAuth0User } from "../../utils/auth0";
import { PuffLoader } from "react-spinners";

const Callback = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(UserContext);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Fetch the user data from your backend
        const { isAuthenticated, user } = await getAuth0User();
        
        if (isAuthenticated && user) {
          setCurrentUser(user);
          navigate("/");
        } else {
          navigate("/login-failed");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        navigate("/login-failed");
      }
    };

    handleCallback();
  }, [navigate, setCurrentUser]);

  return (
    <div className="flex items-center justify-center h-screen bg-[#FDF8F2]">
      <div className="text-center">
        <PuffLoader size={80} color="#404040" />
        <p className="mt-4 text-lg text-gray-600">Completing login...</p>
      </div>
    </div>
  );
};

export default Callback;