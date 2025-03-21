import { syncAuth0User } from "../services/authService.js";

export const handleAuth0Login = async (req, res) => {
  try {
    if (!req.oidc.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Sync Auth0 user with your database
    const user = await syncAuth0User(req.oidc.user);
    
    res.status(200).json({
      message: "Login successful",
      user: {
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
        id: user.id
      }
    });
  } catch (error) {
    console.error("Auth0 login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleAuth0Logout = async (req, res) => {
  res.oidc.logout({ returnTo: process.env.AUTH0_BASE_URL });
};

export const getCurrentUser = async (req, res) => {
  try {
    if (!req.oidc.isAuthenticated()) {
      return res.status(200).json({ isAuthenticated: false });
    }

    const user = await syncAuth0User(req.oidc.user);
    
    res.status(200).json({
      isAuthenticated: true,
      user: {
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
        id: user.id
      }
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};