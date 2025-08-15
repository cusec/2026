// FAQItem.tsx
import { useState, ReactNode } from "react";
import { motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

interface FAQItemProps {
  question: string;
  answer: ReactNode;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      onClick={() => setIsOpen(!isOpen)}
      className="bg-black/50 rounded-xl p-4 mb-4 max-w-[600px] cursor-pointer transition-all"
      whileHover={{ scale: 1.02 }}
    >
      {/* Question */}
      <div className="flex items-center justify-between">
        <span className="font-bold text-lg text-light-mode w-[95%]">
          {question}
        </span>
        <FaChevronDown
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          } text-white`}
        />
      </div>

      {/* Answer with sliding and fade-in effect */}
      <motion.div
        animate={{
          maxHeight: isOpen ? 1000 : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{
          maxHeight: { duration: 0.4 },
          opacity: { duration: 0.4 },
        }}
        className="overflow-hidden"
      >
        <div className="pt-2 text-gray-200 text-sm">{answer}</div>
      </motion.div>
    </motion.div>
  );
};

export default FAQItem;
