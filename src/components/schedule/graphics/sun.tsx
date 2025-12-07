import Image from "next/image";

export default function Sun() {
  return (
    <div className="hidden md:block relative top-0 right-0">
      <div
        className="hidden md:block absolute -z-10 w-60 lg:w-70 h-60 lg:h-70"
        style={{
          top: "140px",
          right: "-170px",
          rotate: "15deg",
        }}
        title="Sun"
      >
        <Image
          src="/images/schedule/sun.svg"
          alt="Sun"
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}
