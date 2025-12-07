import Image from "next/image";

export default function RightPath() {
  return (
    <div className="hidden md:block relative top-0 left-0">
      <div
        className="hidden md:block absolute z-10 w-40 h-10"
        style={{
          top: "20px",
          left: "84px",
        }}
        title="Right Path"
      >
        <Image
          src="/images/schedule/rightPath.svg"
          alt="Right Path"
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}
