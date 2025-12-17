import { Auth0User, DbUser } from "@/lib/interface";
import EmailLink from "./EmailLink";
import Leaderboard from "./Leaderboard";
import Shop from "./Shop";

interface DashboardProps {
  user: Auth0User;
  dbUser: DbUser | null;
}

const Dashboard = ({ user, dbUser }: DashboardProps) => {
  return (
    <div className="w-full">
      {dbUser && <EmailLink user={user} dbUser={dbUser} />}
      <Leaderboard />
      <Shop />
    </div>
  );
};

export default Dashboard;
