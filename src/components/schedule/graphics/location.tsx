import Image from "next/image";

export default function Location() {
  return (
    <div className="hidden md:block relative top-0 left-0">
      <div
        className="hidden md:block absolute z-10 w-40 h-10"
        style={{
          top: "-120px",
          left: "85px",
        }}
        title="Location"
      >
        <Image
          src="/images/schedule/location.svg"
          alt="Location"
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}
