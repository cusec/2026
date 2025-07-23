const Cusec: React.FC = () => {
  return (
    <>
      <div className="mt-[15vh] ml-[8vw]">
        <div className="w-fit heading-gradient text-light-mode/70 ">
          <h1 className="text-3xl xl:text-6xl font-bold mb-1 border-b-1">
            What Is CUSEC ?
          </h1>
        </div>
      </div>
      <div className="mx-[8vw] mt-10 md:max-w-[40vw] bg-linear-[90deg] from-sunset from-0% to-primary to-100% rounded-3xl shadow-2xl">
        <div className="p-8 xl:p-16 text-light-mode bg-dark-mode/80 rounded-3xl backdrop-blur-xs shadow-2xl">
          <p className="text-xl xl:text-4xl leading-relaxed">
            CUSEC is Canada&apos;s longest running student-led software
            engineering conference. Founded in 2002, the conference has offered
            unique and diverse tech experiences to students. CUSEC 2026 will be
            the 25th conference.
          </p>
        </div>
      </div>
    </>
  );
};

export default Cusec;
