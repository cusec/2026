"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";

import faqData from "./FAQData";

const FAQ: React.FC = () => {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  return (
    <div
      id="FAQ"
      className="relative mt-[60vh] mb-[20vh] px-4 md:px-8 w-full flex flex-col justify-center mx-auto text-light-mode"
    >
      <div className="w-full flex justify-center text-center mb-14">
        <h2 className="text-3xl md:text-5xl xl:text-6xl font-bold pb-4 border-b-1 text-light-mode">
          Frequently Asked Questions
        </h2>
      </div>
      <div className="w-full flex justify-center">
        <Accordion
          type="single"
          collapsible
          value={openItem}
          onValueChange={setOpenItem}
        >
          {faqData.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className={`max-w-[2500px] transition-opacity duration-300 ${
                openItem && openItem !== `item-${index}`
                  ? "opacity-50"
                  : "opacity-100"
              }`}
            >
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
