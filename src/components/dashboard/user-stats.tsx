import { CFUserInfo, CFSubmission } from "@/lib/codeforces-api";

interface UserStatsProps {
  userData: CFUserInfo | null;
  submissions: CFSubmission[];
  loading: boolean;
  error: string | null;
}

export function UserStats({
  userData,
  submissions,
  loading,
  error,
}: UserStatsProps) {
  if (loading) {
    return <p className="text-center py-10">Loading user data...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-10">{error}</p>;
  }

  if (!userData) {
    return <p className="text-center py-10">No user data available</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <img
          src={userData.titlePhoto}
          alt={userData.handle}
          className="w-24 h-24 rounded-full border-4"
          style={{ borderColor: getRankColor(userData.rank) }}
        />
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span style={{ color: getRankColor(userData.rank) }}>
              {userData.rank || "Unrated"}
            </span>
            <span>{userData.handle}</span>
          </h1>
          <p className="text-muted-foreground">
            {userData.firstName} {userData.lastName}
          </p>
          <p className="font-medium">
            Rating: {userData.rating} (max: {userData.maxRating})
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <div className="bg-background/50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Contribution</h3>
          <p className="text-lg">{userData.contribution}</p>
        </div>
        <div className="bg-background/50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Friend of</h3>
          <p className="text-lg">{userData.friendOfCount}</p>
        </div>
      </div> 
    </div>
  );
}

// Helper function to get the color based on user rank
function getRankColor(rank: string | undefined): string {
  if (!rank) return "#808080"; // Gray for unrated

  const rankColors = {
    newbie: "#808080",
    pupil: "#008000",
    specialist: "#03a89e",
    expert: "#0000ff",
    "candidate master": "#aa00aa",
    master: "#ff8c00",
    "international master": "#ff8c00",
    grandmaster: "#ff0000",
    "international grandmaster": "#ff0000",
    "legendary grandmaster": "#ff0000",
  };

  const lowercaseRank = rank.toLowerCase();
  return rankColors[lowercaseRank as keyof typeof rankColors] || "#808080";
}
