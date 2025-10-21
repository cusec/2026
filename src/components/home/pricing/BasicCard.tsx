import React from "react";
import Image from "next/image";

const BasicCard: React.FC = () => {
  return (
    <div className="max-w-[400px] md:max-w-full flex flex-col justify-center text-center text-light-mode px-2 md:px-4 py-6 md:py-12 transition-all duration-300 ease-in-out bg-dark-mode/25 border-6 border-white/10 rounded-4xl hover:shadow-2xl shadow-light-mode/15 backdrop-blur-xs">
      <div className="absolute bottom-10 right-6">
        <Image
          src="images/basic_price.svg"
          alt="CUSEC Logo"
          width={120}
          height={120}
        />
      </div>
      <h2 className="text-xl md:text-3xl mb-6 md:mb-8 font-semibold">BASIC</h2>
      <h3 className="text-lg md:text-xl mb-4 md:mb-8 font-semibold">
        Learn, network and grow with CUSEC
      </h3>
      <h3 className="text-xl md:text-3xl mb-4 md:mb-8">$95 / Student</h3>
      <h3 className="text-xl md:text-3xl mb-4 md:mb-6">$250 / Professional</h3>
      <a
        className="select-none w-fit mx-auto text-sm md:text-xl font-space-grotesk! border-1 border-white/50 backdrop-blur-xs rounded-4xl py-1 px-12 mb-4 md:mb-6 register-hover"
        // href=""
        // target="_blank"
        // rel="noopener noreferrer"
      >
        Coming Soon
      </a>
      <div className="flex flex-col gap-6 mx-6 lg:mx-12 text-sm md:text-lg text-start">
        <div className="w-fit flex items-center gap-6">
          <Image
            src="icons/checkmark.svg"
            alt="Checkmark"
            width={24}
            height={24}
          />
          <h4>
            Workshops, Sponsor-Hosted
            <br />
            Talks and Social Events
          </h4>
        </div>
        <div className="w-fit flex items-center gap-6">
          <Image src="icons/minus.svg" alt="Minus" width={24} height={24} />
          <h4>Priority Networking</h4>
        </div>
        <div className="w-fit flex items-center gap-6">
          <Image src="icons/minus.svg" alt="Minus" width={24} height={24} />
          <h4>Exclusive CUSEC Merchandise</h4>
        </div>
      </div>
    </div>
  );
};

export default BasicCard;
