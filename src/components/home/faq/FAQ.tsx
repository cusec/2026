import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import faqData from "./FAQData";

const FAQ: React.FC = () => {
  return (
    <div
      id="FAQ"
      className="relative mt-[50vh] mb-12 px-4 md:px-8 w-full flex flex-col justify-center mx-auto text-light-mode"
    >
      <div className="w-full flex justify-center text-center">
        <h2 className="text-3xl md:text-5xl xl:text-6xl font-bold pb-4 border-b-1 text-light-mode">
          Frequently Asked Questions
        </h2>
      </div>
      <div className="w-full flex justify-center">
        <Accordion type="single" collapsible>
          {faqData.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
