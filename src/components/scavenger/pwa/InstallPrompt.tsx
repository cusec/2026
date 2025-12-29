"use client";

const InstallPrompt: React.FC = () => {
  return (
    <div className="relative mt-[30vh] px-4 md:px-8 w-full flex flex-col justify-center mx-auto text-light-mode/90">
      <div className="w-full flex justify-center text-center">
        <h2 className="mx-auto text-3xl md:text-5xl font-black pb-4 mb-[5vh] border-b w-fit border-light-mode/70">
          The CUSEC 2026 App (Beta)
        </h2>
      </div>
      <div className="w-full flex flex-col justify-center">
        <p className="mx-auto text-lg sm:text-xl md:text-2xl leading-relaxed mb-12">
          Attendees are encouraged to add the CUSEC 2026 App to their home
          screens. This will provide an enhanced experience at the conference
          with easy access to the Scavenger Hunt, Schedule & Speakers.
        </p>
        <ol className="mx-auto px-12 md:px-24 text-md sm:text-lg md:text-xl leading-relaxed list-decimal text-start">
          <li className="mb-4">
            If you see an Install button at the top of this page, next to
            &quot;Start Hunting&quot; & &quot;FAQ&quot; — clicking it will
            prompt you to add the app to your home screen.
          </li>
          <li>
            On iOS devices, you might not see the button mentioned above. In
            this case tap &quot;Share&quot;, then select &quot;Add to Home
            Screen.&quot; For certain Android devices, if this is not available,
            click the three-dot menu in the top-right corner of your browser and
            look for &quot;Add to Home screen&quot; or &quot;Install app.&quot;
          </li>
        </ol>
      </div>
    </div>
  );
};

export default InstallPrompt;
