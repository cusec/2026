import Image from "next/image";

export default function Moon() {
  return (
    <div className="relative top-0 left-0">
      <div
        className="absolute -z-10 w-60 lg:w-70 h-60 lg:h-70 rotate-275 -top-94 -left-20 md:-left-30 lg:-left-50 opacity-85"
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
