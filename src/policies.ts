import { company } from "./data";

// Paragraph strings, or a string[] rendered as a bullet list.
export type InfoPage = {
  title: string;
  eyebrow: string;
  intro: string;
  effective?: string;
  sections: { h: string; body: (string | string[])[] }[];
};

const EFFECTIVE = "October 25, 2026";
const contactLine = `Email ${company.email}, call ${company.phone} (${company.hours}), or write to ${company.legalName}, ${company.address.join(", ")}.`;
// shortcut: no named officer yet; put the real person's name here before going live (E-Commerce Rules 2020).
export const grievance = {
  name: "Grievance Officer",
  email: company.email,
  phone: company.phone,
  timeline: "We acknowledge every complaint within 48 hours and resolve it within one month.",
};
const grievanceBody = [
  `If a concern is not settled through customer care, write to our ${grievance.name} at ${grievance.email} or call ${grievance.phone}, quoting your order ID.`,
  grievance.timeline,
];

export const infoPages: Record<string, InfoPage> = {
  "/about": {
    title: "About StationeryBazaar",
    eyebrow: "WHO WE ARE",
    intro: "Thoughtfully chosen stationery for students, artists and professionals, delivered across India.",
    sections: [
      {
        h: "Our story",
        body: [
          `${company.brand} is the online stationery store of ${company.legalName}, a company registered in East Delhi. We started with a simple idea: good paper and well-made notebooks should be easy to find and fairly priced.`,
          "Today we stock notebooks and writing pads, account books, art and drawing supplies, office folders, sticky notes, and ready-made kits for college, office and planning.",
        ],
      },
      {
        h: "What we care about",
        body: [
          [
            "One store for the desk: school, studio and office essentials in one cart.",
            "Described, not oversold: sizes, page counts and finishes are listed plainly.",
            "Plain pricing: prices include all taxes, and shipping is shown before you pay.",
            "Reachable: real people answer email and phone, Monday to Saturday.",
          ],
        ],
      },
      {
        h: "Our promise",
        body: [
          "Free shipping on orders of ₹499 and above, 7-day returns on unused items, and secure payments through trusted gateways.",
        ],
      },
    ],
  },
  "/contact": {
    title: "Get in touch",
    eyebrow: "CONTACT US",
    intro: "Questions about an order, a product or a bulk enquiry? We're happy to help.",
    sections: [
      {
        h: "Customer care",
        body: [
          [`Email: ${company.email}`, `Phone: ${company.phone}`, `Hours: ${company.hours}`],
          "We reply to emails within one working day.",
        ],
      },
      {
        h: "Bulk & institutional orders",
        body: [
          "Building kits for a classroom, office or event? Email us with the items and quantities for institutional pricing.",
        ],
      },
      { h: "Complaints & grievances", body: grievanceBody },
    ],
  },
  "/faqs": {
    title: "Frequently asked questions",
    eyebrow: "A LITTLE HELP, WHEN YOU NEED IT",
    intro: "Quick answers about orders, delivery, returns and payments.",
    sections: [
      {
        h: "How long does delivery take?",
        body: [
          "Orders are dispatched within 24–48 hours. Standard delivery takes 4–6 business days; express takes 2–3 business days.",
        ],
      },
      {
        h: "How much is shipping?",
        body: ["Free on orders of ₹499 and above, otherwise ₹49. Express delivery is ₹99."],
      },
      {
        h: "How do I track my order?",
        body: ["Sign in and open My Orders to see each order's status and delivery estimate."],
      },
      {
        h: "Can I cancel my order?",
        body: ["Yes, before it is dispatched. Email us your order ID and we'll cancel it and refund you in full."],
      },
      {
        h: "Can I return an item?",
        body: [
          "Unused items in their original packaging can be returned within 7 days of delivery. See our Refund & Cancellation Policy for details.",
        ],
      },
      {
        h: "Which payment methods do you accept?",
        body: ["UPI, credit and debit cards (Visa, Mastercard, RuPay) and cash on delivery."],
      },
      {
        h: "Do you take bulk orders?",
        body: [`Yes. Write to ${company.email} or call ${company.phone} for institutional pricing.`],
      },
    ],
  },
  "/shipping-policy": {
    title: "Shipping & Delivery Policy",
    eyebrow: "LEGAL",
    intro: "How and when your order reaches you.",
    effective: EFFECTIVE,
    sections: [
      { h: "1. Where we deliver", body: ["We deliver to serviceable PIN codes across India. Check your PIN code on any product page."] },
      { h: "2. Dispatch", body: ["Orders are packed and dispatched within 24–48 hours, excluding Sundays and public holidays."] },
      {
        h: "3. Delivery times and charges",
        body: [
          [
            "Standard: 4–6 business days. Free on orders of ₹499 and above, otherwise ₹49.",
            "Express: 2–3 business days, ₹99.",
          ],
          "Remote areas may take longer. Delivery estimates are not guaranteed.",
        ],
      },
      { h: "4. Tracking", body: ["Order status is shown under My Orders once you're signed in."] },
      {
        h: "5. Failed delivery",
        body: [
          "If the courier cannot deliver after repeated attempts, the order returns to us and we refund the product value. Shipping charges are not refunded in that case.",
        ],
      },
      {
        h: "6. Damaged parcels",
        body: ["Do not accept a visibly damaged parcel, or report it within 48 hours with photos of the product and packaging."],
      },
      { h: "7. Contact", body: [contactLine] },
    ],
  },
  "/refund-policy": {
    title: "Refund & Cancellation Policy",
    eyebrow: "LEGAL",
    intro: "Our rules for cancellations, returns, exchanges and refunds.",
    effective: EFFECTIVE,
    sections: [
      { h: "1. Cancellation", body: ["You can cancel an order before it is dispatched. Once dispatched, it can be returned instead."] },
      {
        h: "2. Returns",
        body: [
          "Items can be returned within 7 days of delivery if they are:",
          ["Damaged or defective", "Not the item you ordered", "Unused, with original packaging and labels intact"],
        ],
      },
      {
        h: "3. Not returnable",
        body: [["Used, written-in or opened-and-used items", "Items damaged by the customer", "Customised or personalised orders"]],
      },
      {
        h: "4. Damaged or wrong items",
        body: ["Report within 48 hours of delivery with photos of the product and packaging. We will replace it or refund you at no cost."],
      },
      { h: "5. Exchanges", body: ["Exchanges are available when the replacement item is in stock."] },
      {
        h: "6. Refunds",
        body: [
          "Approved refunds reach your original payment method within 5–10 business days. Cash-on-delivery orders are refunded by bank transfer or UPI.",
          "Shipping charges are not refunded unless the error was ours.",
        ],
      },
      { h: "7. Contact", body: [contactLine] },
    ],
  },
  "/privacy-policy": {
    title: "Privacy Policy",
    eyebrow: "LEGAL",
    intro: "What personal data we collect, and how we use, share and protect it.",
    effective: EFFECTIVE,
    sections: [
      {
        h: "1. Information we collect",
        body: [
          [
            "Contact details: name, email and phone number",
            "Delivery addresses",
            "Payment details, handled by third-party payment gateways; we do not store card numbers",
            "Cookies and usage data",
          ],
        ],
      },
      { h: "2. How we use it", body: ["To process and deliver orders, provide support, prevent fraud, and send updates you ask for."] },
      { h: "3. Cookies", body: ["Cookies keep your cart and sign-in working. You can turn them off in your browser, but some features may stop working."] },
      { h: "4. Sharing", body: ["We share only what is needed with payment gateways, courier partners and service providers. We do not sell your data."] },
      { h: "5. Data security", body: ["We use reasonable technical and organisational safeguards to protect your data."] },
      {
        h: "6. Your rights",
        body: ["You can ask to access, correct or delete your data, subject to legal and business record-keeping requirements."],
      },
      { h: "7. Children's privacy", body: ["We do not knowingly collect data from children without a parent's or guardian's consent."] },
      { h: "8. Changes", body: ["We may update this policy. The effective date above shows the latest version."] },
      { h: "9. Grievance Officer", body: grievanceBody },
      { h: "10. Contact", body: [contactLine] },
    ],
  },
  "/terms": {
    title: "Terms & Conditions",
    eyebrow: "LEGAL",
    intro: "The agreement between you and us for using this site and placing orders.",
    effective: EFFECTIVE,
    sections: [
      { h: "1. About us", body: [`This site is operated by ${company.legalName}, ${company.address.join(", ")}.`] },
      { h: "2. Eligibility", body: ["You must be 18 or older, or use the site under a parent's or guardian's supervision."] },
      { h: "3. Products and pricing", body: ["We describe products as accurately as we can. Prices are in INR and include all taxes. We may correct pricing errors and cancel affected orders with a full refund."] },
      { h: "4. Orders", body: ["An order is confirmed when we accept it. We may decline orders for stock, address or fraud reasons."] },
      { h: "5. Payments", body: ["Payments are processed through secure third-party gateways. We are not responsible for gateway downtime."] },
      { h: "6. Shipping", body: ["Delivery is covered by our Shipping & Delivery Policy."] },
      { h: "7. Returns and refunds", body: ["Returns are covered by our Refund & Cancellation Policy."] },
      { h: "8. Intellectual property", body: ["Site content, images and branding belong to us and may not be copied without permission."] },
      { h: "9. Prohibited use", body: ["Do not misuse the site, attempt unauthorised access, or place fraudulent orders."] },
      { h: "10. Limitation of liability", body: ["Our liability for any order is limited to the amount you paid for it."] },
      { h: "11. Governing law", body: ["These terms are governed by Indian law. Disputes are subject to the courts in Delhi."] },
      { h: "12. Grievances", body: grievanceBody },
      { h: "13. Contact", body: [contactLine] },
    ],
  },
};
// Old help page links keep working.
infoPages["/help"] = infoPages["/faqs"];
