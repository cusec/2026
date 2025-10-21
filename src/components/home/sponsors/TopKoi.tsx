import Image from "next/image";

export default function TopKoi() {
  return (
    <div className="hidden md:block relative top-0 left-0">
      <div
        className="hidden md:block absolute z-10"
        style={{
          left: "20vw",
          top: "-12vw",
          transform: `rotate(35deg)`,
          height: "35vw",
          minHeight: "140px",
          minWidth: "140px",
          width: "15vw",
          maxHeight: "520px",
          maxWidth: "520px",
        }}
        title="Koi"
      >
        <Image
          src="/images/koi1.svg"
          alt="Koi"
          fill
          className="object-contain opacity-90"
        />
      </div>
    </div>
  );
}
