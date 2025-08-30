import Stats from "./Stats";

const About: React.FC = () => {
  return (
    <div className="mt-[50vh]">
      <Stats />
      <div
        id="ABOUT"
        className="max-w-[1800px] w-full flex flex-col justify-center mx-auto"
      >
        <div className="w-full flex justify-center text-center mb-4">
          <h2 className="text-3xl md:text-5xl xl:text-6xl font-bold pb-4 border-b-1 text-light-mode">
            What Is CUSEC ?
          </h2>
        </div>

        <div className="w-full flex justify-center text-center">
          <div className="mx-[8vw] mt-10 md:max-w-[48vw] bg-linear-[135deg] from-sunset/20 from-0%    to-primary/50 to-100% rounded-3xl shadow-2xl">
            <div className="p-8 md:p-12 xl:p-16 text-light-mode bg-dark-mode/50 rounded-3xl backdrop-blur-xs shadow-2xl">
              <p className="text-xl md:text-2xl xl:text-3xl leading-relaxed">
                As Canada&apos;s longest-running student-led software
                engineering conference, CUSEC has been offering unique and
                diverse tech experiences to students since 2002. The upcoming
                CUSEC 2026 will mark our 25th conference, providing a premier
                platform for attendees to learn from world-renowned experts,
                connect with like-minded peers, and discover career
                opportunities with exciting companies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
