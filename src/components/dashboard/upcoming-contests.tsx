import { Button } from "@/components/ui/button";
import { CFContest } from "@/lib/codeforces-api";

interface UpcomingContestsProps {
  contests: CFContest[];
  loading: boolean;
}

export function UpcomingContests({ contests, loading }: UpcomingContestsProps) {
  if (loading) {
    return <p className="text-center py-5">Loading contests...</p>;
  }

  const upcomingContests = contests
    .filter((contest) => contest.phase === "BEFORE")
    .slice(0, 3);

  return (
    <>
      <div className="space-y-3">
        {upcomingContests.map((contest, index) => (
          <div key={index} className="bg-background/50 p-3 rounded-lg">
            <h3 className="font-medium">{contest.name}</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(contest.startTimeSeconds * 1000).toLocaleString()}
            </p>
            <p className="text-sm">
              Duration: {Math.floor(contest.durationSeconds / 60)} minutes
            </p>
          </div>
        ))}
      </div>
      <Button className="w-full mt-4" variant="outline" asChild>
        <a
          href="https://codeforces.com/contests"
          target="_blank"
          rel="noopener noreferrer"
        >
          View All Contests
        </a>
      </Button>
    </>
  );
}
