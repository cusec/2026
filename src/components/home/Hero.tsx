import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

const Hero: React.FC = () => {
  return (
    <div className="lg:max-w-4xl flex flex-col gap-6 lg:gap-10 backdrop-blur-xs bg-dark-mode/60 p-6 mx-8 rounded-2xl text-left text-light-mode shadow-2xl shadow-black/80">
      <div className="flex items-center gap-3 lg:gap-8 border-b-2 lg:border-b-0 pb-5 border-light-mode/40">
        <div className="lg:border-r-2 border-light-mode/40 relative">
          <div className="w-[8vh] h-[8vh] lg:w-[10vh] lg:h-[10vh] lg:mr-10">
            <Image
              src="/images/logo.svg"
              alt="CUSEC Logo"
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>
        <div className="text-3xl xs:text-4xl md:text-5xl lg:hidden leading-none">
          <h1 className="font-semibold">CUSEC</h1>
          <h1>2026</h1>
        </div>
        <div>
          <h2 className="hidden lg:block text-5xl leading-none text-light-mode">
            Canadian University Software Engineering Conference
          </h2>
        </div>
      </div>
      <div className="lg:hidden">
        <h2 className="text-center md:text-left text-2xl xs:text-3xl md:text-4xl leading-none text-light-mode/20 bg-clip-text bg-linear-[180deg] from-secondary from-0% to-accent to-180%">
          Canadian University Software Engineering Conference
        </h2>
      </div>
      <div className="flex flex-col mx-auto lg:mx-0 xs:flex-row gap-4 text-xg md:text-3xl leading-none font-medium text-center lg:text-left">
        <div className="relative group">
          <h3 className="relative z-10 animate-pulse-subtle">
            25<sup>th</sup> Anniversary
          </h3>
          {/* Revolving sparkles positioned around the text */}
          <div className="hidden sm:block absolute inset-0 pointer-events-none">
            <div className="absolute -top-2 -left-3 w-2 h-2 bg-white rounded-full opacity-60 animate-sparkle-1"></div>
            <div className="absolute -top-1 -right-3 w-1.5 h-1.5 bg-white rounded-full opacity-40 animate-sparkle-2"></div>
            <div className="absolute -bottom-2 -left-2 w-1 h-1 bg-white rounded-full opacity-50 animate-sparkle-3"></div>
            <div className="absolute -bottom-1 -right-2 w-1.5 h-1.5 bg-white rounded-full opacity-45 animate-sparkle-4"></div>
          </div>
        </div>
        <h3 className="lg:mx-4 hidden xs:flex">|</h3>
        <h3 className="hidden lg:inline">
          January 8<sup>th</sup> - 10<sup>th</sup>, 2026
        </h3>
        <h3 className="lg:hidden">
          January 8<sup>th</sup> - 10<sup>th</sup>
        </h3>
      </div>
      <div className="mt-2 xxs:mt-0 w-full text-xl md:text-2xl flex flex-col lg:flex-row gap-6 lg:gap-12 items-center">
        <div className="text-sm md:text-2xl flex flex-wrap justify-center gap-2 xs:gap-6 bg-transparent">
          <a
            className="font-space-grotesk! w-fit lg:p-2 border-b-2 border-light-mode/40 email-hover"
            href="mailto:talks@cusec.net"
            target="_blank"
            rel="noopener noreferrer"
          >
            Speak at CUSEC
            <FontAwesomeIcon
              icon={faMicrophone}
              size="sm"
              className="ml-1 text-accent"
            />
          </a>

          <a
            className="font-space-grotesk! mt-2 xxs:mt-0  w-fit lg:p-2 border-b-2 border-light-mode/40 email-hover"
            href="mailto:sponsor@cusec.net"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sponsor CUSEC
            <FontAwesomeIcon
              icon={faUserPlus}
              size="sm"
              className="ml-1 text-secondary"
            />
          </a>
        </div>
        <a
          className="font-space-grotesk! w-full max-w-96 lg:w-fit rounded-2xl p-3 text-center border-2 border-secondary/50 register-hover"
          href="https://2025.cusec.net/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Previous Year
          <FontAwesomeIcon
            icon={faArrowUpRightFromSquare}
            size="xs"
            className="ml-2"
          />
        </a>
      </div>
    </div>
  );
};

export default Hero;
