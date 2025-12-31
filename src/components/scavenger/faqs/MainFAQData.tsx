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
        .<br />
        <br />
        Participants are not allowed to share scavenger hunt codes with others
        to ensure a fair competition.
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
        &apos;#scavenger-hunt-support&apos; forum/channel on the official
        Discord server for 2026. <br />
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
  {
    question: "How do I install the CUSEC 2026 app?",
    answer: (
      <>
        The process defers for each operating systemm device and browser. There
        are steps present above that guide you through the process for most
        devices.
        <br /> <br />
        If you don&apos;t see the prompt, install button or an option from your
        browser to install (not a shortcut), try the following:
        <br />
        Clear cookies/site data -&gt; Close all CUSEC tabs -&gt; Close the
        browser -&gt; Clear browser cache -&gt; Restart the browser.
        <br /> <br />
        If you are still having issues, feel free to reach out to organizers
        during the conference for assistance. Keep in mind, you can still use
        the website without missing out on any features.
      </>
    ),
  },
  {
    question: "Who can participate in the Scavenger Hunt?",
    answer: (
      <>
        The Scavenger Hunt is open all attendees of CUSEC 2026. To be able to
        scan/claim hunt items, you&apos;ll need to connect your account with the
        email linked to your CUSEC 2026 ticket. If the same email is used for
        booking multiple tickets, use your registered personal/school email to
        link your account.
        <br />
        <br />
        The linking can be done once you log into the Scavenger Hunt page and
        link the email from the top. If you face any issues, reach out to
        organizers during/before the conference for assistance.
      </>
    ),
  },
  {
    question: "What are hunt items and how do I claim them?",
    answer: (
      <>
        Hunt items are QR codes or specific identifiers/codes that participants
        can find and claim during the Scavenger Hunt. To claim an item, you can
        either scan the QR code (From the Scavenger Hunt page or from your
        device&apos;s camera) or manually enter the code associated with the
        item.
        <br />
        <br />
        Once claimed, the item will be added to your dashboard&apos;s inventory
        and you will notice an increase in your overall points.
        <br />
        <br />
        Hunt items can be found throughout the conference, at various booths,
        events, etc. so keep an eye out and attend the sessions!
      </>
    ),
  },
  {
    question:
      "What can I do with the hunt items I collect? What are the prizes?",
    answer: (
      <>
        Collected hunt items contribute to your overall points in the Scavenger
        Hunt. The points you accumulate can help you climb the leaderboard and
        can be used to redeem prizes at designated prize booths during the
        conference.
        <br />
        <br />
        Prizes vary and can include merchandise, swag, exclusive coffee
        chats,etc. Some of this year&apos;s scavenger hunt prizes include:
        Exclusive CUSEC 2026 Post Cards/Stickers, CuBear Lamp, CuBear Plushies,
        Sponsor Items, and much more!
      </>
    ),
  },
  {
    question: "Where can I find organizers or prize booths during the event?",
    answer: (
      <>
        Prize booths will be present in the Main Lobby for several hours on each
        day of the conference. Physical prizes can only be claimed from the
        prize booths at{" "}
        <a
          href="/schedule"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          scheduled
        </a>{" "}
        times.
      </>
    ),
  },
];

export default faqData;
