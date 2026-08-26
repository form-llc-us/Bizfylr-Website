export type LegalSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export const legalDocuments = {
  privacy: {
    title: "Privacy Policy",
    description:
      "Learn how Bizfylr collects, uses, stores, and protects personal and business information across inquiries, projects, payments, and support interactions.",
    lastUpdated: "May 15, 2026",
    sections: [
      {
        title: "1. Information We Collect",
        paragraphs: [
          "We collect information you choose to share with Bizfylr through contact forms, project discussions, payment requests, support conversations, and newsletter subscriptions.",
          "That may include your name, email address, phone number, company details, billing information, project requirements, and communication history."
        ],
        bullets: [
          "Contact and business details",
          "Project and service inquiry information",
          "Payment-related billing details",
          "Device, browser, and usage data for security and analytics"
        ]
      },
      {
        title: "2. How We Use Information",
        paragraphs: [
          "Bizfylr uses your information to respond to inquiries, deliver services, improve operations, process billing, and maintain support communication.",
          "We may also use aggregated data to understand demand trends and improve our internal processes."
        ]
      },
      {
        title: "3. Data Sharing",
        paragraphs: [
          "We do not sell your personal information. We may share information with trusted service providers or infrastructure partners only where necessary for project delivery, payments, analytics, hosting, or communication."
        ]
      },
      {
        title: "4. Data Security",
        paragraphs: [
          "We use reasonable administrative, technical, and operational safeguards to reduce unauthorized access, disclosure, or misuse of information.",
          "No method of transmission or storage is completely risk-free, so we encourage clients to avoid sending highly sensitive secrets over insecure channels."
        ]
      },
      {
        title: "5. Retention",
        paragraphs: [
          "We retain information only for as long as necessary to manage inquiries, fulfill services, maintain records, resolve disputes, meet legal obligations, or support legitimate business operations."
        ]
      },
      {
        title: "6. Your Choices",
        paragraphs: [
          "You may request updates, corrections, or deletion of certain information by contacting us. Some records may need to be retained for compliance, invoicing, or security reasons."
        ]
      },
      {
        title: "7. Contact",
        paragraphs: ["For privacy-related questions, contact Bizfylr through the contact page or via our listed support email."]
      }
    ] as LegalSection[]
  },
  refund: {
    title: "Refund Policy",
    description:
      "Review Bizfylr’s refund and cancellation policy for consulting, implementation, creative work, recurring retainers, and third-party service costs.",
    lastUpdated: "May 15, 2026",
    sections: [
      {
        title: "1. Scope of This Policy",
        paragraphs: [
          "Because Bizfylr provides digital services, strategy, implementation, and operational support, refunds are reviewed based on work completed, resource allocation, and project stage."
        ]
      },
      {
        title: "2. Consultation and Discovery Work",
        paragraphs: [
          "Paid consultations, strategy sessions, audits, or discovery work are generally non-refundable once the session has been delivered or the analysis has started."
        ]
      },
      {
        title: "3. Project Work",
        paragraphs: [
          "For implementation projects, refunds may be considered only for the unstarted portion of scoped work. Time already spent on planning, design, development, setup, documentation, communication, or operations is non-refundable."
        ],
        bullets: [
          "Client-initiated cancellation within the first 24 hours may be reviewed if substantive work has not begun.",
          "Milestone payments already consumed by delivered work or reserved delivery capacity are non-refundable.",
          "Third-party fees, platform charges, government fees, ad spend, and vendor costs are not refundable through Bizfylr."
        ]
      },
      {
        title: "4. Retainers and Ongoing Support",
        paragraphs: [
          "Recurring retainers reserve availability, planning capacity, and support bandwidth. Unused reserved time is generally not refundable unless otherwise agreed in writing."
        ]
      },
      {
        title: "5. Payment Disputes",
        paragraphs: [
          "If you believe there is a billing problem, contact Bizfylr promptly so we can review the scope, milestones, and delivery records before any formal dispute is escalated."
        ]
      },
      {
        title: "6. Contact",
        paragraphs: ["Questions about cancellations or refunds should be sent to Bizfylr using our official support channels."]
      }
    ] as LegalSection[]
  },
  terms: {
    title: "Terms of Service",
    description:
      "Understand the general terms governing Bizfylr’s digital services, project engagement, billing, support, intellectual property, and operational expectations.",
    lastUpdated: "May 15, 2026",
    sections: [
      {
        title: "1. Services",
        paragraphs: [
          "Bizfylr provides business growth, website development, e-commerce, marketplace, compliance support, automation, marketing, creative, and consulting services as described in proposals, invoices, or written communications."
        ]
      },
      {
        title: "2. Client Responsibilities",
        paragraphs: [
          "Clients are responsible for providing accurate information, timely feedback, approvals, assets, and any required third-party access or accounts needed to complete the work."
        ]
      },
      {
        title: "3. Timelines and Delivery",
        paragraphs: [
          "Estimated timelines depend on scope, responsiveness, and project complexity. Delays caused by missing materials, scope changes, or external dependencies may affect delivery dates."
        ]
      },
      {
        title: "4. Fees and Payments",
        paragraphs: [
          "Invoices, milestone payments, retainers, and billing schedules are defined per engagement. Work may pause if required payments are overdue."
        ]
      },
      {
        title: "5. Intellectual Property",
        paragraphs: [
          "Unless otherwise agreed, final approved deliverables transfer to the client after full payment for the relevant scope has been received.",
          "Bizfylr may retain rights to its underlying frameworks, internal processes, reusable methods, and pre-existing materials."
        ]
      },
      {
        title: "6. Third-Party Platforms and Services",
        paragraphs: [
          "Bizfylr may recommend or configure third-party tools, hosting, ad platforms, payment providers, or software. Their availability, pricing, uptime, and policy changes remain outside Bizfylr’s direct control."
        ]
      },
      {
        title: "7. Limitation of Liability",
        paragraphs: [
          "Bizfylr does not guarantee legal, financial, advertising, SEO, or revenue outcomes. To the maximum extent allowed by law, liability is limited to fees paid for the applicable service scope."
        ]
      },
      {
        title: "8. Support and Communication",
        paragraphs: [
          "Any ongoing support expectations, response windows, or channels should be confirmed in the applicable proposal or written agreement."
        ]
      },
      {
        title: "9. Contact",
        paragraphs: ["Questions about these terms can be raised through Bizfylr’s listed support channels."]
      }
    ] as LegalSection[]
  }
} as const;
