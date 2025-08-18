import faqData from "./FAQData";
import FAQItem from "./FAQItem";

const OldFAQ: React.FC = () => {
  return (
    <div
      id="FAQ"
      className="mt-[50vh] mb-12 px-4 md:px-8 w-full flex flex-col justify-center mx-auto text-light-mode"
    >
      <div className="w-full flex justify-center text-center">
        <h2 className="text-3xl md:text-5xl xl:text-6xl font-bold pb-4 border-b-1 text-light-mode">
          Frequently Asked Questions
        </h2>
      </div>
      <div className="w-full flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 items-start">
          {faqData.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OldFAQ;
