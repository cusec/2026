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
  {
    question: "Can I claim hunt items at any time during the conference?",
    answer: (
      <>
        No. Each hunt item can only be claimed during specific time windows,
        usually around the time that it is revealed at events/present in the
        venue. So make sure claim them right away!
        <br /> <br />
        To prevent unfair advantages and sharing of codes, there are also limits
        on max claims and extensive monitoring of claim attempts. You
        aren&apos;t allowed to share hunt item codes with others.
      </>
    ),
  },
  {
    question:
      "The points for each hunt item are very low, will I be able to claim any prizes?",
    answer: (
      <>
        Yes! While individual hunt items may have low point values, we&apos;ve
        attempted to create a fun point-based economy where an average attendee
        visiting majority of the events will be able to claim most of the prizes
        they desire.
        <br /> <br />
        Additionally, some hunt items are worth more points than others. Early
        events and certain sessions may have higher-value items to reward active
        participants.
      </>
    ),
  },
  {
    question:
      "What is the difference between hunt items, shop prizes, collectibles, and shop prizes?",
    answer: (
      <>
        Hunt items are specific codes or QR codes that you can find and claim.
        These reward you with points that contribute to your overall score in
        the Scavenger Hunt. You can use these points to redeem shop prizes.
        <br /> <br />
        Collectibles are special items that you can find during the hunt. They
        do not contribute to your points but are unique items. You may find a
        collectible when scanning/claiming a hunt item. Certain collectibles
        will also be present in the shop for a brief period of time. Each
        collectible is different, but some can be &apos;used&apos; at the prize
        booth for the specified reward.
        <br /> <br />
        Shop prizes are items that you can redeem using the points you earn from
        claiming hunt items. They are usually physical prizes available at
        designated prize booths during the conference.
      </>
    ),
  },
  {
    question:
      "How does the leaderboard work? Will my rank change if I redeem prizes?",
    answer: (
      <>
        The leaderboard ranks participants based on the total points a user has
        accumulated through claiming hunt items.
        <br /> <br />
        Redeeming prizes does not affect your rank on the leaderboard. So feel
        free to use your points to claim prizes & other items from the shop
        without worrying about losing your position!
      </>
    ),
  },
  {
    question: "Where can I see the hunt items I have claimed?",
    answer: (
      <>
        Once you claim a hunt item, it will be added to your inventory on your
        dashboard. You can view all the hunt items you have claimed, along with
        their details and point values, in the inventory section of your
        dashboard.
        <br /> <br />
        The inventory also displays any collectibles you have found/redeemed
        during the hunt. You can also see any shop prizes you have redeemed at
        the prize booths in the same inventory section.
      </>
    ),
  },
  {
    question:
      "I see items in the shop that I cannot redeem/purchase. Why is that?",
    answer: (
      <>
        The shop acts as a catalog for all prizes & collectibles available at
        the time of checking.
        <br /> <br />
        The shop prizes present in the shop need to be redeemed in-person at the
        prize booths during scheduled times at the conference.
        <br /> <br />
        Some collectibles may only be available for a limited time in the shop.
        These can be redeemed by the user directly on the platform. They will
        then see the collectible in their inventory.
      </>
    ),
  },
];

export default faqData;
