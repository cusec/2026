import { Auth0User, DbUser } from "@/lib/interface";
import EmailLink from "./EmailLink";
import UserHunt from "./UserHunt";
import Leaderboard from "./Leaderboard";
import Shop from "./Shop";

interface DashboardProps {
  user: Auth0User;
  dbUser: DbUser | null;
}

const Dashboard = ({ user, dbUser }: DashboardProps) => {
  return (
    <div className="w-full">
      {dbUser && (
        <>
          <EmailLink user={user} dbUser={dbUser} />
          <UserHunt user={user} dbUser={dbUser} />
        </>
      )}
      <Shop />
      <Leaderboard />
    </div>
  );
};

export default Dashboard;
