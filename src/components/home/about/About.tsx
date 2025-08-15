const About: React.FC = () => {
  return (
    <>
      <div
        id="ABOUT"
        className="mt-[50vh] max-w-[1800px] w-full flex flex-col justify-center mx-auto"
      >
        <div className="w-full flex justify-center text-center">
          <h2 className="text-3xl md:text-5xl xl:text-6xl font-bold pb-4 border-b-1 text-light-mode">
            What Is CUSEC ?
          </h2>
        </div>

        <div className="w-full flex justify-center text-center mt-4">
          <div className="mx-[8vw] mt-10 md:max-w-[48vw] bg-linear-[135deg] from-sunset/20 from-0%    to-primary/50 to-100% rounded-3xl shadow-2xl">
            <div className="p-8 md:p-12 xl:p-16 text-light-mode bg-dark-mode/50 rounded-3xl backdrop-blur-xs shadow-2xl">
              <p className="text-xl md:text-3xl xl:text-4xl leading-relaxed">
                CUSEC is Canada&apos;s longest running student-led software
                engineering conference. Founded in 2002, the conference has
                offered unique and diverse tech experiences to students. CUSEC
                2026 will be the 25th conference.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
