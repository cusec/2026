"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";

import faqData from "./DashboardFAQData";

const DashboardFAQ: React.FC = () => {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  return (
    <div
      id="Faq"
      className="relative mt-24 mb-24 px-4 md:px-8 w-full flex flex-col justify-center mx-auto text-light-mode"
    >
      <div className="w-full flex justify-center text-center mb-14">
        <h2 className="text-2xl md:text-4xl font-bold pb-4 text-light-mode">
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
              className={`md:min-w-[700px] max-w-[700px] text-start transition-opacity duration-300 ${
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

export default DashboardFAQ;
