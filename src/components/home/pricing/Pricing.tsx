import BasicCard from "./BasicCard";
import VipCard from "./VipCard";

const Pricing: React.FC = () => {
  return (
    <div
      id="PRICING"
      className="mt-[50vh] mb-12 px-4 md:px-8 w-full flex flex-col justify-center mx-auto text-light-mode"
    >
      <div className="w-full text-center flex justify-center">
        <h2 className="w-fit text-3xl xl:text-6xl font-bold pb-6 border-b-1">
          Attend the 2026 Event
        </h2>
      </div>
      <div className="w-full text-center flex justify-center mt-6 mb-16">
        <h1 className="w-fit text-xl xl:text-3xl">Pricing</h1>
      </div>
      <div className="w-full text-center items-center flex flex-col md:flex-row justify-center gap-[8vw]">
        <BasicCard />
        <VipCard />
      </div>
    </div>
  );
};

export default Pricing;
