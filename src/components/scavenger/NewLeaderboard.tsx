"use client";

import { useState, useEffect } from "react";
import { Trophy } from "lucide-react";
import Image from "next/image";

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
}

interface LeaderboardResponse {
  success: boolean;
  leaderboard: LeaderboardEntry[];
}

const NewLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/leaderboard");

      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
      }

      const data: LeaderboardResponse = await response.json();

      if (data.success) {
        setLeaderboard(data.leaderboard);
      } else {
        throw new Error("Failed to load leaderboard data");
      }
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError("Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto text-light-mode/90">
        <div className=" p-6">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Trophy className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Leaderboard</h2>
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-700 rounded-lg h-16"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto text-light-mode/90">
        <div className="p-6">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Trophy className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Leaderboard</h2>
          </div>
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto text-light-mode/90">
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center space-x-2">
            <Trophy className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Leaderboard</h2>
          </div>
          {leaderboard.length > 0 && (
            <div className="mt-2 text-center text-sm">
              Showing top {leaderboard.length} participants
            </div>
          )}
        </div>

        {/* Leaderboard List */}
        {leaderboard.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="w-16 h-16 mx-auto mb-4" />
            <p>No scores yet. Be the first to earn points!</p>
          </div>
        ) : (
          <div>
            {/* The Top 3 */}
            {leaderboard.length >= 3 && (
              <div className="flex min-h-[250px] md:min-h-[350px] text-xs md:text-body">
                {/* Rank 2 */}
                <div className="flex flex-col justify-center items-center text-center gap-2 w-[40%] mt-[30px]">
                  <div className="relative min-h-10 min-w-10 lg:min-h-15 lg:min-w-15">
                    <Image
                      alt="Second Place Icon"
                      src="/images/leaderboard_second.svg"
                      fill
                    />
                  </div>
                  {leaderboard[1].name}
                  <div className="flex items-center justify-center px-5 rounded-full bg-light-mode/20 py-1">
                    {leaderboard[1].score}
                  </div>
                  <div className="absolute pt-25 text-5xl text-light-mode/50 font-space-grotesk!">
                    2
                  </div>
                  <div className="flex justify-center rounded-t-xl w-full h-full bg-light-mode/15 mask-[linear-gradient(to_bottom,black_10%,transparent_100%)]"></div>
                </div>
                {/* Rank 1 */}
                <div className="flex flex-col justify-center items-center text-center gap-2 w-[40%]">
                  <div className="relative min-h-10 min-w-10 lg:min-h-15 lg:min-w-15">
                    <Image
                      alt="First Place Icon"
                      src="/images/leaderboard_first.svg"
                      fill
                    />
                  </div>
                  {leaderboard[0].name}
                  <div className="flex items-center justify-center px-5 rounded-full bg-light-mode/20 py-1">
                    {leaderboard[0].score}
                  </div>
                  <div className="absolute pt-10 text-5xl text-light-mode/50 font-space-grotesk!">
                    1
                  </div>
                  <div className="flex justify-center rounded-t-xl w-full h-full bg-light-mode/15 mask-[linear-gradient(to_bottom,black_10%,transparent_100%)]"></div>
                </div>
                {/* Rank 3 */}
                <div className="flex flex-col justify-center items-center text-center gap-2 w-[40%] mt-[60px]">
                  <div className="relative min-h-10 min-w-10 lg:min-h-15 lg:min-w-15">
                    <Image
                      alt="Third Place Icon"
                      src="/images/leaderboard_third.svg"
                      fill
                    />
                  </div>
                  {leaderboard[2].name}
                  <div className="flex items-center justify-center px-5 rounded-full bg-light-mode/20 py-1">
                    {leaderboard[2].score}
                  </div>
                  <div className="absolute pt-25 text-5xl text-light-mode/50 font-space-grotesk!">
                    3
                  </div>
                  <div className="flex justify-center rounded-t-xl w-full h-full bg-light-mode/15 mask-[linear-gradient(to_bottom,black_10%,transparent_100%)]"></div>
                </div>
              </div>
            )}
            {/* Ranks 4 and below */}
            <div className="mt-8 space-y-4">
              {leaderboard.slice(3).map((entry) => (
                <div
                  key={entry.rank}
                  className="flex justify-between items-center text-center px-5 py-4 border border-light-mode/30 rounded-2xl bg-dark-mode/60 text-sm md:text-lg"
                >
                  <div className="flex gap-3">
                    <div>{entry.rank}</div>
                    <div>{entry.name}</div>
                  </div>
                  <div className="flex items-center justify-center px-4 rounded-full bg-light-mode/20 py-1 text-xs md:text-sm">
                    {entry.score}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewLeaderboard;
