"use client";

import { useState, useEffect } from "react";
import { Megaphone } from "lucide-react";
import { Notice } from "@/lib/interface";

interface NoticeResponse {
  success: boolean;
  notices: Notice[];
}

const NoticeBoard = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/notices");

      if (!response.ok) {
        throw new Error("Failed to fetch notices");
      }

      const data: NoticeResponse = await response.json();

      if (data.success) {
        setNotices(data.notices);
      } else {
        throw new Error("Failed to load notices");
      }
    } catch (err) {
      console.error("Error fetching notices:", err);
      setError("Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  // Don't render anything if there are no notices
  if (!loading && notices.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <></>
      // <div className="w-full max-w-4xl mx-auto text-light-mode/90">
      //   <div className="p-6">
      //     <div className="flex items-center justify-center space-x-2 mb-6">
      //       <Megaphone className="w-8 h-8" />
      //       <h2 className="text-2xl md:text-4xl font-bold">Notice Board</h2>
      //     </div>
      //     <div className="space-y-3">
      //       {[...Array(2)].map((_, i) => (
      //         <div
      //           key={i}
      //           className="animate-pulse bg-gray-700 rounded-lg h-16"
      //         />
      //       ))}
      //     </div>
      //   </div>
      // </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto text-light-mode/90">
        <div className="p-6">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Megaphone className="w-8 h-8" />
            <h2 className="text-2xl md:text-4xl font-bold">Notice Board</h2>
          </div>
          <div className="text-center text-red-400">
            <p>{error}</p>
            <button
              onClick={fetchNotices}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto text-light-mode/90">
      <div className="p-6">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Megaphone className="w-8 h-8" />
          <h2 className="text-2xl md:text-4xl font-bold">Notice Board</h2>
        </div>

        <div className="space-y-4">
          {notices.map((notice) => (
            <div
              key={notice._id}
              className="flex flex-col items-center text-center p-4 backdrop-blur-sm rounded-xl border-2 border-light-mode/30 bg-dark-mode/30"
            >
              <h3 className="text-lg font-semibold mb-2">{notice.title}</h3>
              <p className="text-light-mode/80">{notice.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoticeBoard;
