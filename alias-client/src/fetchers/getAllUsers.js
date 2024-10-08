export const getAllUsers = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/v1/users");
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};
