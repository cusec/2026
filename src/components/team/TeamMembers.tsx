import { TeamMember } from "@/lib/interface";
import members from "./teamMembersData.json";
import Member from "./Member";

export default function TeamMembers() {
  return (
    <div className="mx-[5vw] lg:mx-[10vw] mt-[15vh] w-[90vw] lg:w-[80vw] text-light-mode">
      <h1 className="text-3xl md:text-5xl pb-4 mb-[5vh] border-b-1 w-fit border-light-mode/70">
        Organizers
      </h1>
      <div className="flex gap-10 flex-wrap justify-evenly">
        {members.map((member: TeamMember, index: number) => (
          <Member key={index} member={member} />
        ))}
      </div>
    </div>
  );
}
