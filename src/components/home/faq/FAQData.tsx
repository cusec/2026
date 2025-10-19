import { FAQItem } from "@/lib/interface";

const faqData: FAQItem[] = [
  {
    question: "When and where is CUSEC 2026 happening?",
    answer: (
      <>
        CUSEC 2026 will be held in Montreal from January 8th to 10th, 2026 at:
        <br />
        <strong>Hotel Omni Mont-Royal</strong>
        <br />
        1050 Sherbrooke St W, Montreal, Quebec H3A 2R6
      </>
    ),
  },
  {
    question:
      "Where can I find the conference schedule, speakers, and sponsors?",
    answer: (
      <>
        The schedule will be available on the website soon, along with our list
        of speakers and sponsors! We are working to create the best conference
        experience for you, we promise.
      </>
    ),
  },
  {
    question: "Who can attend? Are there any costs?",
    answer: (
      <>
        High school, undergraduate, and graduate students from all across Canada
        are welcome to attend.
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>
            <strong>Student Ticket</strong>: $80 CAD - For students still
            registered as of January 2026.
          </li>
          <li>
            <strong>Professional Ticket</strong>: $200 CAD - For professionals
            or students who have graduated by January 2026.
          </li>
        </ul>
        <p className="mt-2">
          Tickets do not include travel or accommodation costs. Check the
          Pricing section for more details on ticket benefits.
        </p>
      </>
    ),
  },
  {
    question: "How can I get a ticket?",
    answer: (
      <>
        <strong>Pre-sale</strong> for schools with a Head Delegate starts on{" "}
        <u>TBD</u> and closes on <u>TBD</u> (or until tickets are sold out).
        Speak with your Head Delegate about potential pre-purchased tickets for
        your school.
        <br />
        <br />
        <strong>General Admission</strong> opens on <u>TBD</u> and remains open
        until tickets are sold out.
      </>
    ),
  },
  {
    question: "Where should I book my hotel room? How much does it cost?",
    answer: (
      <>
        We&apos;ve partnered with Hotel Omni Mont-Royal to provide a discounted
        rate of{" "}
        <strong>
          $<u>TBD</u> CAD
        </strong>{" "}
        per room per night for up to two adults. Additional adults can be added
        for{" "}
        <strong>
          $<u>TBD</u> per night per person
        </strong>
        .
        <br />
        <br />
        Book soon to secure your rate. Contact us with any questions.
      </>
    ),
  },
  {
    question: "Can I get a refund or resell my ticket?",
    answer: (
      <>
        Reselling a CUSEC ticket above the purchased price is prohibited.
        <br />
        Refunds are available up to <strong>30 days after purchase</strong> or
        until December 27, 2025, at 23:00 ET, whichever is earlier.
        <br />
        <br />
        If you cannot attend, please email <strong>info@cusec.net</strong> and
        CC your Head Delegate if applicable. We will do our best to assist you.
      </>
    ),
  },
  {
    question: "Will meals be provided during our stay?",
    answer: (
      <>
        Refreshments will be available for delegates. While meals are not
        provided, there are numerous nearby dining options to explore
        Montreal&apos;s culinary scene!
      </>
    ),
  },
];

export default faqData;
