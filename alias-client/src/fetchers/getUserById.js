// Function to fetch user details by userId
export const getUserById = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/users/${userId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch user with id: ${userId}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };