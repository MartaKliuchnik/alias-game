// Function to fetch user details by userId
export const getUserById = async (userId, token) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/v1/users/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch user with id: ${userId}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};
