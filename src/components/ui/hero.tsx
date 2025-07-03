import React from "react";
import isAdmin from "@/lib/isAdmin";

const Hero: React.FC = async () => {
  const userIsAdmin = await isAdmin();

  return (
    <div className="text-white text-3xl">
      {userIsAdmin ? "Admin" : "Not Admin"}
    </div>
  );
};

export default Hero;
