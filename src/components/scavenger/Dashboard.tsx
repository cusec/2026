import { Auth0User, DbUser } from "@/lib/interface";
import EmailLink from "./EmailLink";

interface DashboardProps {
  user: Auth0User;
  dbUser: DbUser | null;
}

const Dashboard = ({ user, dbUser }: DashboardProps) => {
  return (
    <div className="w-full">
      {dbUser && <EmailLink user={user} dbUser={dbUser} />}
    </div>
  );
};

export default Dashboard;
