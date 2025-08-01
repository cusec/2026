import React from "react";
import Image from "next/image";

const BasicCard: React.FC = () => {
  return (
    <div className="flex flex-col justify-center text-center text-light-mode px-4 py-12 bg-black/25 border-6 border-white/10 rounded-4xl shadow-lg backdrop-blur-xs">
      <h2 className="text-xl md:text-3xl mb-8 font-semibold">BASIC</h2>
      <h3 className="text-lg md:text-xl mb-8 font-semibold">
        Learn, network and grow with CUSEC
      </h3>
      <h3 className="text-xl md:text-3xl mb-8">$80 / Student</h3>
      <h3 className="text-xl md:text-3xl mb-6">$120 / Professional</h3>
      <a className="w-fit mx-auto text-sm md:text-xl font-space-grotesk! border-1 border-white/50 rounded-4xl py-1 px-12 mb-6">
        BUY NOW
      </a>
      <div className="flex flex-col gap-6 mx-12 text-sm md:text-xl text-start">
        <div className="w-fit flex items-center gap-6">
          <Image
            src="icons/checkmark.svg"
            alt="Checkmark"
            width={24}
            height={24}
          />
          <h4>Social Events</h4>
        </div>
        <div className="w-fit flex items-center gap-6">
          <Image
            src="icons/checkmark.svg"
            alt="Checkmark"
            width={24}
            height={24}
          />
          <h4>Networking Benefits</h4>
        </div>
        <div className="w-fit flex items-center gap-6">
          <Image
            src="icons/checkmark.svg"
            alt="Checkmark"
            width={24}
            height={24}
          />
          <h4>
            Workshops and Sponsor
            <br />
            hosted talks
          </h4>
        </div>
      </div>
    </div>
  );
};

export default BasicCard;
