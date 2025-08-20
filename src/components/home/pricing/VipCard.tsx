import React from "react";
import Image from "next/image";

const VipCard: React.FC = () => {
  return (
    <div className="relative max-w-[400px] md:max-w-full flex flex-col justify-center text-center text-light-mode px-4 py-12 bg-black/25 border-6 border-white/10 rounded-4xl shadow-lg backdrop-blur-xs">
      <div className="absolute top-6.5 -right-8.25 z-10">
        <div
          className="bg-linear-[135deg] from-primary/85 from-0% via-light-mode/25 via-40% to-sunset/85 to-150% text-white text-md px-8 py-1 tracking-widest shadow-lg"
          style={{
            transform: "rotate(45deg)",
            clipPath: "polygon(21% 0, 79% 0, 100% 100%, 0 100%)",
          }}
        >
          POPULAR
        </div>
      </div>
      <div className="absolute top-74 md:top-88 right-3 -z-30">
        <Image
          src="images/vip_price.svg"
          alt="CUSEC Logo"
          width={100}
          height={0}
        />
      </div>
      <h2 className="text-xl md:text-3xl mb-8 font-semibold">VIP</h2>
      <h3 className="text-lg md:text-xl mb-8 font-semibold">
        Learn, network and grow with CUSEC
      </h3>
      <h3 className="text-xl md:text-3xl mb-8">$120 / Student</h3>
      <h3 className="text-xl md:text-3xl mb-6">$240 / Professional</h3>
      <a
        className="w-fit mx-auto text-sm md:text-xl font-space-grotesk! border-1 border-white/50 rounded-4xl py-1 px-12 mb-6 register-hover-gradient"
        href="/#PRICING"
        target="_blank"
        rel="noopener noreferrer"
      >
        BUY NOW
      </a>
      <div className="flex flex-col gap-6 mx-6 lg:mx-12 text-sm md:text-xl text-start">
        <div className="w-fit flex items-center gap-6">
          <Image
            src="icons/vip_checkmark.svg"
            alt="Checkmark"
            width={24}
            height={24}
          />
          <h4>Social Events</h4>
        </div>
        <div className="w-fit flex items-center gap-6">
          <Image
            src="icons/vip_checkmark.svg"
            alt="Checkmark"
            width={24}
            height={24}
          />
          <h4>Networking Benefits</h4>
        </div>
        <div className="w-fit flex items-center gap-6">
          <Image
            src="icons/vip_checkmark.svg"
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

export default VipCard;
