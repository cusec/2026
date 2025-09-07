import Image from "next/image";

export default function BottomKoi() {
  return (
    <div className="hidden md:block relative bottom-0 right-0">
      <div
        className="hidden md:block absolute z-10"
        style={{
          right: "15vw",
          bottom: "-15vw",
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
          src="/images/koi2.svg"
          alt="Koi"
          fill
          className="object-contain opacity-90"
        />
      </div>
    </div>
  );
}
