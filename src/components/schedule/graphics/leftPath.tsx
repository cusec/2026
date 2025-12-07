import Image from "next/image";

export default function LeftPath() {
  return (
    <div className="hidden md:block relative top-0 left-0">
      <div
        className="hidden md:block absolute z-10 w-40 h-10"
        style={{
          top: "20px",
          left: "-244px",
        }}
        title="Left Path"
      >
        <Image
          src="/images/schedule/leftPath.svg"
          alt="Left Path"
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}
