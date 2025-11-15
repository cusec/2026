import { TeamMember } from "@/lib/interface";
import members from "./teamMembersData.json";
import Member from "./Member";

export default function TeamMembers() {
  return (
    <div className="mx-[10vw] lg:mx-[20vw] mt-[15vh] text-light-mode">
      <h1 className="text-3xl md:text-5xl pb-4 mb-[5vh] w-fit border-b-1 border-light-mode/70">
        Organizers
      </h1>
      <div className="flex gap-10 flex-wrap justify-center">
        {members.map((member: TeamMember, index: number) => (
          <Member key={index} member={member} />
        ))}
      </div>
    </div>
  );
}
