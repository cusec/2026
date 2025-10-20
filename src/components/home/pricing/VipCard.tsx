import React from "react";
import Image from "next/image";

const VipCard: React.FC = () => {
  return (
    <div className="relative max-w-[400px] md:max-w-full flex flex-col justify-center text-center text-light-mode px-2 md:px-4 py-6 md:py-12 transition-all duration-300 ease-in-out bg-dark-mode/25 border-6 border-white/10 rounded-4xl hover:shadow-2xl shadow-light-mode/15 backdrop-blur-xs">
      <div className="absolute top-4.25 -right-7.5 z-10">
        <div
          className="bg-linear-[135deg] from-primary/85 from-0% via-light-mode/25 via-40% to-sunset/85 to-150% text-light-mode px-6 py-1 tracking-widest shadow-lg"
          style={{
            transform: "rotate(45deg)",
            clipPath: "polygon(25% 0, 75% 0, 100% 100%, 0 100%)",
          }}
        >
          POPULAR
        </div>
      </div>
      <div className="absolute top-56 xs:top-50 md:top-[358px] right-2 -z-30">
        <Image
          src="images/vip_price.svg"
          alt="CUSEC Logo"
          width={100}
          height={0}
        />
      </div>
      <h2 className="text-xl md:text-3xl mb-6 md:mb-8 font-semibold">VIP</h2>
      <h3 className="text-lg md:text-xl mb-4 md:mb-8 font-semibold">
        Learn, network and grow with CUSEC
      </h3>
      <h3 className="text-xl md:text-3xl mb-4 md:mb-8">$140 / Student</h3>
      <h3 className="text-xl md:text-3xl mb-4 md:mb-6">$300 / Professional</h3>
      <a
        className="select-none w-fit mx-auto text-sm md:text-xl font-space-grotesk! border-1 border-white/50 backdrop-blur-xs rounded-4xl py-1 px-12 mb-4 md:mb-6 register-hover-gradient"
        // href=""
        // target="_blank"
        // rel="noopener noreferrer"
      >
        Coming Soon
      </a>
      <div className="flex flex-col gap-6 mx-6 lg:mx-12 text-sm md:text-lg text-start">
        <div className="w-fit flex items-center gap-6">
          <Image
            src="icons/vip_checkmark.svg"
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
          <Image
            src="icons/vip_checkmark.svg"
            alt="Checkmark"
            width={24}
            height={24}
          />
          <h4>Priority Networking</h4>
        </div>
        <div className="w-fit flex items-center gap-6">
          <Image
            src="icons/vip_checkmark.svg"
            alt="Checkmark"
            width={24}
            height={24}
          />
          <h4>Exclusive CUSEC Merchandise</h4>
        </div>
      </div>
    </div>
  );
};

export default VipCard;
