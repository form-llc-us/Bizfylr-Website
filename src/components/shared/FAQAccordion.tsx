"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type FAQAccordionProps = {
  items: Array<{
    question: string;
    answer: string;
  }>;
};

export function FAQAccordion({ items }: FAQAccordionProps) {
  return (
    <Accordion className="space-y-3 md:space-y-4" collapsible type="single">
      {items.map((item, index) => (
        <AccordionItem key={`${item.question}-${index}`} value={`faq-${index}`}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
