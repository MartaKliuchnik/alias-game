export const getAllUsers = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/users`);
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};
