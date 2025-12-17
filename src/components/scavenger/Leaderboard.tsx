"use client";

import { useState, useEffect } from "react";
import { Trophy, Medal, Award, RefreshCw } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
}

interface LeaderboardResponse {
  success: boolean;
  leaderboard: LeaderboardEntry[];
}

const Leaderboard = () => {
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

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-800" />;
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm font-bold">
            {rank}
          </div>
        );
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-50/50 to-yellow-100/50 border-yellow-200";
      case 2:
        return "bg-gradient-to-r from-gray-50/50 to-gray-100/50 border-gray-200";
      case 3:
        return "bg-gradient-to-r from-orange-100/50 to-orange-200/50 border-orange-300";
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto text-light-mode/90">
        <div className=" p-6">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Trophy className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Leaderboard</h2>
            <button
              disabled
              className="p-1 rounded-full hover:text-light-mode transition-colors disabled:opacity-50"
            >
              <RefreshCw className="w-5 h-5 animate-spin" />
            </button>
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
            <button
              onClick={fetchLeaderboard}
              className="p-1 rounded-full hover:text-light-mode transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
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
            <button
              onClick={fetchLeaderboard}
              disabled={loading}
              className="p-1 rounded-full hover:text-light-mode transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              />
            </button>
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
          <div className="flex flex-col md:flex-row gap-4">
            {/* First column - entries 1-5 */}
            <div className="flex-1 space-y-3">
              {leaderboard.slice(0, 5).map((entry) => (
                <div
                  key={`${entry.rank}-${entry.name}`}
                  className={`flex items-center justify-between p-4 bg-light-mode/70 rounded-lg border transition-all duration-200 hover:shadow-md text-dark-mode ${getRankStyle(
                    entry.rank
                  )}`}
                >
                  <div className="flex items-center space-x-4">
                    {getRankIcon(entry.rank)}
                    <div>
                      <p className="font-semibold">{entry.name}</p>
                      <p className="text-sm">Rank #{entry.rank}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      {entry.score}
                    </p>
                    <p className="text-sm">points</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Second column - entries 6-10 */}
            {leaderboard.length > 5 && (
              <div className="flex-1 space-y-3">
                {leaderboard.slice(5, 10).map((entry) => (
                  <div
                    key={`${entry.rank}-${entry.name}`}
                    className={`flex items-center justify-between p-4 bg-light-mode/70 rounded-lg border transition-all duration-200 hover:shadow-md text-dark-mode ${getRankStyle(
                      entry.rank
                    )}`}
                  >
                    <div className="flex items-center space-x-4">
                      {getRankIcon(entry.rank)}
                      <div>
                        <p className="font-semibold">{entry.name}</p>
                        <p className="text-sm">Rank #{entry.rank}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {entry.score}
                      </p>
                      <p className="text-sm">points</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
