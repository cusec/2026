import Image from "next/image";

export default function Sun() {
  return (
    <div className="relative top-0 right-0">
      <div
        className="absolute -z-10 w-60 lg:w-70 h-60 lg:h-70 rotate-15 top-35 -right-25 md:-right-43 opacity-85"
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
