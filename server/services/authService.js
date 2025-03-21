import { prisma } from "../config/prismaConfig.js";

export const syncAuth0User = async (auth0User) => {
  if (!auth0User || !auth0User.email) {
    throw new Error("Invalid Auth0 user data");
  }

  try {
    // Check if user exists in your database
    let user = await prisma.user.findUnique({
      where: { email: auth0User.email.toLowerCase() },
    });

    if (!user) {
      // Create new user if doesn't exist
      user = await prisma.user.create({
        data: {
          email: auth0User.email.toLowerCase(),
          name: auth0User.name || auth0User.nickname || "",
          image: auth0User.picture || "",
          role: "USER", // Default role
        },
      });
      console.log("New user created from Auth0:", user.email);
    } else {
      // Optionally update existing user info
      user = await prisma.user.update({
        where: { email: auth0User.email.toLowerCase() },
        data: {
          name: auth0User.name || user.name,
          image: auth0User.picture || user.image,
        },
      });
      console.log("Existing user updated from Auth0:", user.email);
    }

    return user;
  } catch (error) {
    console.error("Error syncing Auth0 user:", error);
    throw error;
  }
};