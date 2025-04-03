// Rating tiers with their respective colors and ranges - Using exact CF colors
export const RATING_TIERS = [
  { name: "Newbie", color: "#808080", min: 0, max: 1199, bgColor: "#CCCCCC" },
  { name: "Pupil", color: "#008000", min: 1200, max: 1399, bgColor: "#77FF77" },
  {
    name: "Specialist",
    color: "#03a89e",
    min: 1400,
    max: 1599,
    bgColor: "#77DDBB",
  },
  {
    name: "Expert",
    color: "#0000ff",
    min: 1600,
    max: 1899,
    bgColor: "#AAAAFF",
  },
  {
    name: "Candidate Master",
    color: "#aa00aa",
    min: 1900,
    max: 2099,
    bgColor: "#FF88FF",
  },
  {
    name: "Master",
    color: "#ff8c00",
    min: 2100,
    max: 2299,
    bgColor: "#FFCC88",
  },
  {
    name: "International Master",
    color: "#ff8c00",
    min: 2300,
    max: 2399,
    bgColor: "#FFCC88",
  },
  {
    name: "Grandmaster",
    color: "#ff0000",
    min: 2400,
    max: 2599,
    bgColor: "#FF8888",
  },
  {
    name: "International Grandmaster",
    color: "#ff0000",
    min: 2600,
    max: 2999,
    bgColor: "#FF8888",
  },
  {
    name: "Legendary Grandmaster",
    color: "#ff0000",
    min: 3000,
    max: 5000,
    bgColor: "#FF8888",
  },
];

// Helper function to get the color based on user rank
export function getRankColor(rank: string | undefined): string {
  if (!rank) return "#808080"; // Gray for unrated

  const rankColors: Record<string, string> = {
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
  return rankColors[lowercaseRank] || "#808080";
}

// Get tier background color based on rating
export function getTierBgColor(rating: number): string {
  const tier = RATING_TIERS.find((t) => rating >= t.min && rating <= t.max);
  return tier ? tier.bgColor : "#CCCCCC"; // Default to Newbie bg color
}

// Get tier name based on rating
export function getTierName(rating: number): string {
  const tier = RATING_TIERS.find((t) => rating >= t.min && rating <= t.max);
  return tier ? tier.name : "Newbie";
}

// Find tier by rating
export function getTierByRating(rating: number) {
  return (
    RATING_TIERS.find((t) => rating >= t.min && rating <= t.max) ||
    RATING_TIERS[0]
  );
}
