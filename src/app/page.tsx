import Image from "next/image";

export default function Home() {
  return (
    <main>
      <div className="bg-[url('/images/splash.svg')] bg-cover bg-center h-screen flex items-center justify-center">
        <div className="w-3/4 h-2/3 sm:h-1/4 md:h-1/3 xl:h-1/2 bg-light-mode dark:bg-dark-mode rounded-4xl shadow-lg flex justify-center">
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center text-center h-full w-full max-w-3/4 sm:max-w-full py-12 px-8">
            <div className="w-44 h-full sm:w-1/4 relative">
              <Image
                src="/images/logo.svg"
                alt="CUSEC Logo"
                fill
                priority
                className="object-contain"
              />
            </div>

            <div className="h-0.5 w-full my-12 sm:my-0 sm:h-full sm:w-1 dark:sm:w-0.75 bg-primary dark:bg-light-mode"></div>

            <h1 className="text-primary dark:text-light-mode text-3xl sm:max-w-3/5 sm:text-2xl md:text-3xl lg:text-4xl xl:text-6xl 2xl:text-7xl">
              Canadian University Software Engineering Conference
            </h1>
          </div>
        </div>
      </div>
    </main>
  );
}
