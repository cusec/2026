import faqData from "./FAQData";

const FAQ: React.FC = () => {
  return (
    <div className="mt-[50vh] mb-12 px-4 md:px-8 w-full flex flex-col justify-center mx-auto text-light-mode">
      <div className="w-full flex justify-center text-center">
        <h2 className="text-3xl md:text-5xl xl:text-6xl font-bold pb-4 border-b-1 text-light-mode">
          Frequently Asked Questions
        </h2>
      </div>
      <div className="w-full items-center grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {faqData.map((item, index) => (
          <div key={index} className="p-4 border-b border-light-mode">
            <h3 className="font-semibold">{item.question}</h3>
            <div className="mt-2">{item.answer}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
