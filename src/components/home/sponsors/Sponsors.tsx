import Image from "next/image";
import { Sponsor } from "@/lib/interface";
import sponsors from "./SponsorData";
import TopKoi from "./TopKoi";
import BottomKoi from "./BottomKoi";

const Sponsors = () => {
  return (
    <section
      className="w-full relative py-12 mt-[12vh] md:mt-[60vh] mb-12 px-4 text-light-mode"
      id="Sponsors"
    >
      <TopKoi />
      {/* Header */}
      <div className="w-full text-center flex justify-center mb-8 mt-8">
        <h1 className="w-fit text-light-mode text-3xl xl:text-6xl font-bold pb-4 border-b-1">
          Sponsors
        </h1>
      </div>

      {/* Sponsors Layout */}
      <div className="flex flex-col items-center gap-12 m-auto w-[95%] mb-16 md:w-full">
        {/* Gold / Partner Sponsors */}
        {sponsors.gold.length > 0 && (
          <div className="flex flex-col items-center gap-12 py-12">
            <div className="flex justify-center items-center gap-12 lg:gap-24">
              {sponsors.gold.map((sponsor: Sponsor, index: number) => (
                <a
                  key={`gold-${index}`}
                  href={sponsor.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-fit hover:scale-103 transition-transform duration-500"
                >
                  <Image
                    src={sponsor.image}
                    alt={`Gold Sponsor ${index + 1}`}
                    width={585}
                    height={329}
                    className="object-contain"
                  />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Silver Sponsors */}
      <div className="flex flex-col items-center gap-12 m-auto w-[95%] md:w-full mb-24">
        {sponsors.silver.length > 0 && (
          <div className="flex justify-center items-center gap-12 lg:gap-24">
            {sponsors.silver.map((sponsor: Sponsor, index: number) => (
              <a
                key={`silver-${index}`}
                href={sponsor.link}
                target="_blank"
                rel="noopener noreferrer"
                className="h-fit hover:scale-103 transition-transform duration-500"
              >
                <Image
                  src={sponsor.image}
                  alt={`Silver Sponsor ${index + 1}`}
                  width={390}
                  height={152}
                  className="object-contain"
                />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Bronze Sponsors */}
      {sponsors.bronze.length > 0 && (
        <div className="flex flex-col items-center gap-12 mb-24">
          <div className="flex justify-center items-center gap-12 lg:gap-24">
            {sponsors.bronze.map((sponsor: Sponsor, index: number) => (
              <a
                key={`bronze-${index}`}
                href={sponsor.link}
                target="_blank"
                rel="noopener noreferrer"
                className="h-fit hover:scale-103 transition-transform duration-500"
              >
                <Image
                  src={sponsor.image}
                  alt={`Bronze Sponsor ${index + 1}`}
                  width={260}
                  height={91}
                  className="object-contain"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Collaborators Section */}
      {sponsors.collaborators.length > 0 && (
        <div className="w-full flex flex-col items-center justify-center mb-24">
          <h3 className="text-3xl font-bold text-center mb-6">Collaborators</h3>
          <div className="flex justify-center items-center gap-12 lg:gap-24">
            {sponsors.collaborators.map((sponsor: Sponsor, index: number) => (
              <a
                key={`collaborator-${index}`}
                href={sponsor.link}
                target="_blank"
                rel="noopener noreferrer"
                className="h-fit hover:scale-103 transition-transform duration-500"
              >
                <Image
                  src={sponsor.image}
                  alt={`Collaborator ${index + 1}`}
                  width={260}
                  height={82}
                  className="object-contain"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* In-Kind Sponsors Section */}
      {sponsors.inkind.length > 0 && (
        <div className="w-full flex flex-col items-center justify-center mb-24">
          <h3 className="text-3xl font-bold text-center mb-6">
            In-Kind Sponsors
          </h3>
          <div className="flex justify-center items-center gap-12 lg:gap-24">
            {sponsors.inkind.map((sponsor: Sponsor, index: number) => (
              <a
                key={`inkind-${index}`}
                href={sponsor.link}
                target="_blank"
                rel="noopener noreferrer"
                className="h-fit hover:scale-103 transition-transform duration-500"
              >
                <Image
                  src={sponsor.image}
                  alt={`In-Kind Sponsor ${index + 1}`}
                  width={125}
                  height={125}
                  className="object-contain"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      <BottomKoi />
    </section>
  );
};

export default Sponsors;
