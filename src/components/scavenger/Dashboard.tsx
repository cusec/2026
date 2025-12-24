"use client";

import { useState } from "react";
import { Auth0User, DbUser } from "@/lib/interface";
import EmailLink from "./EmailLink";
import NoticeBoard from "./NoticeBoard";
import UserHunt from "./UserHunt";
import Leaderboard from "./Leaderboard";
import Shop from "./Shop";

interface DashboardProps {
  user: Auth0User;
  dbUser: DbUser | null;
  baseURL: string;
}

const Dashboard = ({ user, dbUser, baseURL }: DashboardProps) => {
  const [linkedEmail, setLinkedEmail] = useState<string | null>(
    dbUser?.linked_email || null
  );

  const handleEmailLinked = (email: string) => {
    setLinkedEmail(email);
  };

  return (
    <div className="w-full">
      <NoticeBoard />
      {dbUser && (
        <>
          {!linkedEmail && (
            <EmailLink
              user={user}
              dbUser={dbUser}
              onEmailLinked={handleEmailLinked}
            />
          )}
          <UserHunt
            user={user}
            dbUser={dbUser}
            linkedEmail={linkedEmail}
            baseURL={baseURL}
          />
        </>
      )}
      <Shop user={user} dbUser={dbUser} />
      <Leaderboard />
    </div>
  );
};

export default Dashboard;
