import Image from "next/image";

export default function Moon() {
  return (
    <div className="hidden md:block relative top-0 left-0">
      <div
        className="hidden md:block absolute -z-10 w-60 lg:w-70 h-60 lg:h-70 -left-30 lg:-left-50 opacity-85"
        style={{
          top: "-375px",
          rotate: "275deg",
        }}
        title="Moon"
      >
        <Image
          src="/images/schedule/moon.svg"
          alt="Moon"
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}
