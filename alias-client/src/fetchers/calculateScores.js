export default async function calculateScores(roomId, teamId) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/v1/rooms/${roomId}/teams/${teamId}/calculate-scores`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to calculate scores");
    }

    console.log("Scores calculated successfully");
    return true;
  } catch (error) {
    console.error("Error calculating scores:", error);
    return false;
  }
}
