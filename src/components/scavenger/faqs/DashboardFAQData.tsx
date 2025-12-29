import { FAQItem } from "@/lib/interface";

const faqData: FAQItem[] = [
  {
    question: "What are the rules for Scavenger Hunt?",
    answer: (
      <>
        CUSEC 2026 Scavenger Hunt requires all participants to adhere to
        CUSEC&apos;s{" "}
        <a
          href="/code-of-conduct"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          code of conduct
        </a>{" "}
        &{" "}
        <a
          href="/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          privacy policy
        </a>
        .
      </>
    ),
  },
  {
    question: "How do I request Scavenger Hunt related assistance?",
    answer: (
      <>
        Ensure that you have updated your discord handle at the top of the page
        for faster assistance.
        <br />
        <br /> Support for Scavenger Hunt is available through the
        &apos;#scavenger-hunt&apos; channel on the official Discord server for
        2026. <br />
        <br />
        If you require further assistance, you can reach out to organizers at
        the conference, particularly at the{" "}
        <a
          href="/schedule"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          scheduled
        </a>{" "}
        prize booth sessions.
      </>
    ),
  },
];

export default faqData;
