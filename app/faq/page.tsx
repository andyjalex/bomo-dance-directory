import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { faqPageData } from "@/lib/structured-data";

const FAQS = [
  {
    question: "Is salsa beginner friendly?",
    answer:
      "Yes. Every Bournemouth salsa class we list starts with a beginner breakdown of the basic step before moving into partnerwork, and nobody expects you to have danced before. Most people feel comfortable with the basics within two or three sessions.",
  },
  {
    question: "Do I need a partner?",
    answer:
      "No — you can come on your own to any class listed here. Salsa, bachata and kizomba classes rotate partners within the room, and modern jive / Ceroc classes are built around solo attendance with partners changing throughout the night.",
  },
  {
    question: "How long does it take to learn salsa?",
    answer:
      "You'll be able to follow a basic salsa pattern after your first class. Feeling confident leading or following at a social dance usually takes a few months of regular weekly classes — salsa has more to learn than bachata or modern jive, so expect a longer runway.",
  },
  {
    question: "Salsa or bachata?",
    answer:
      "Bachata is slower and easier to pick up in your first few weeks, with more focus on connection than footwork. Salsa is faster and has more patterns to learn, but a bigger social scene in Bournemouth. Many dancers do both — the classes run on different nights.",
  },
];

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about starting salsa, bachata, kizomba and modern jive in Bournemouth — beginner-friendliness, partners, and how long it takes to learn.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
      <JsonLd data={faqPageData(FAQS)} />
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }]} />

      <h1 className="mt-4 font-display text-3xl font-bold text-navy sm:text-4xl">
        Frequently asked questions
      </h1>
      <p className="mt-3 text-lg text-muted">
        New to social dancing in Bournemouth? Start here.
      </p>

      <dl className="mt-8 flex flex-col gap-6">
        {FAQS.map((faq) => (
          <div key={faq.question} className="border-b border-border pb-6">
            <dt className="font-display text-xl font-semibold text-navy">
              {faq.question}
            </dt>
            <dd className="mt-2 text-muted">{faq.answer}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
