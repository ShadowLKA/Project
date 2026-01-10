// Note: Central content and copy live here for easy edits.
const siteData = {
  brand: {
    name: "MedBridge",
    navPrimary: "Start consult",
    navSecondary: "Consultations"
  },
  nav: [
    { label: "Home", hash: "#home" },
    { label: "Advisors", hash: "#advisors" },
    { label: "How it works", hash: "#process" },
    { label: "Contact", hash: "#contact" }
  ],
  pages: {
    home: {
      hero: {
        tag: "Remove doubts",
        title: "Free Doctor Consultation",
        copy: "Connect with board-certified physicians, share your records securely, and get clear next steps in days, not weeks.",
        stats: [
          { value: "24/7", label: "Care team access" },
          { value: "150+", label: "Specialists on call" },
          { value: "4.9/5", label: "Patient satisfaction" }
        ],
        cards: [
          {
            title: "Case review",
            icon: "Rx",
            copy: "Detailed review of your current diagnosis and care plan."
          },
          {
            title: "Second opinion",
            icon: "2x",
            copy: "Confirm or refine treatment with top US experts."
          }
        ]
      }
    },
    consultForm: {
      tag: "Consultation form",
      title: "Request a specialist consultation",
      copy: "Share a few details and our team will guide you to the right specialist.",
    },
    consultations: {
      title: "Consultations designed around real decisions.",
      tag: "Consultation types",
      copy: "Choose the path that matches your situation. Each consult includes a care concierge and an expert review.",
      items: [
        {
          title: "Expert second opinion",
          copy: "Validate a diagnosis or treatment plan with a board-certified specialist.",
          meta: "48-hour turnaround"
        },
        {
          title: "Treatment roadmap",
          copy: "A structured plan that outlines options, risks, and next steps.",
          meta: "Personalized summary"
        },
        {
          title: "Virtual follow-up",
          copy: "Ongoing check-ins with your care advisor and clinical team.",
          meta: "Flexible scheduling"
        }
      ]
    },
    services: {
      title: "Comprehensive virtual care tailored to your case.",
      tag: "Signature services",
      copy: "From cardiovascular care to complex diagnostics, our team designs a personalized path to clarity with coordinated support.",
      items: [
        { icon: "CV", title: "Cardiology", copy: "Review heart health plans with renowned cardiologists." },
        { icon: "ON", title: "Oncology", copy: "Get precise treatment options and clinical trial insights." },
        { icon: "OR", title: "Orthopedics", copy: "Second opinions for joint replacements and sports injuries." },
        { icon: "NE", title: "Neurology", copy: "Clarify brain and spine diagnoses with leading experts." }
      ]
    },
    advisors: {
      title: "Advisors who keep the journey clear and calm.",
      tag: "Care advisors",
      copy: "Your advisor stays with you from intake to the final plan, translating every step into plain language.",
      items: [
        {
          initials: "LB",
          name: "luka kandelaki",
          role: "Senior Care Navigator",
          bullets: ["Complex case coordination", "24/7 messaging support", "Insurance guidance"]
        },
        {
          initials: "TK",
          name: "Theo Kim",
          role: "Patient Success Lead",
          bullets: ["Scheduling across time zones", "Family support calls", "Outcome tracking"]
        },
        {
          initials: "MS",
          name: "Maya Singh",
          role: "Clinical Liaison",
          bullets: ["Doctor matching expertise", "Medical record prep", "Follow-up planning"]
        }
      ]
    },
    specialists: {
      title: "Specialists trained at top institutions.",
      tag: "Meet the team",
      copy: "Every physician is vetted for clinical excellence and patient empathy.",
      items: [
        {
          initials: "AD",
          name: "Dr. Alicia Daniels",
          role: "Cardiovascular Surgery",
          bullets: ["20+ years experience", "Rapid case turnaround", "Complex surgical planning"]
        },
        {
          initials: "MK",
          name: "Dr. Marcus Kim",
          role: "Oncology",
          bullets: ["Precision therapy guidance", "Multidisciplinary reviews", "Trial eligibility insights"]
        },
        {
          initials: "SR",
          name: "Dr. Sofia Reyes",
          role: "Orthopedics",
          bullets: ["Sports medicine expert", "Rehab and recovery planning", "Minimally invasive options"]
        }
      ]
    },
    team: {
      title: "Meet the people behind the work.",
      tag: "Team cards",
      copy: "Every team member is listed with a photo, title, and bio."
    },
    settings: {
      title: "Account settings",
      tag: "Manage account",
      copy: "Update your details, change your password, and set your theme."
    },
    news: {
      title: "Company news and milestones.",
      tag: "Our story",
      copy: "Learn when we started, why we built MedBridge, and the moments that shaped the company.",
      storyTitle: "How we started",
      storyCopy: "MedBridge began in 2023 with a simple idea: patients deserve clarity when making serious medical decisions. We built a dedicated care team to guide families from uncertainty to action with expert-backed answers.",
      about: [
        {
          title: "Why we exist",
          copy: "We started to make specialist care feel reachable. Every process is designed around clarity, speed, and human support."
        },
        {
          title: "What we believe",
          copy: "Patients deserve a clear plan. We combine expert review with plain-language guidance so families can act with confidence."
        },
        {
          title: "How we work",
          copy: "We blend clinical expertise with concierge-level coordination, keeping patients informed from intake through follow-up."
        }
      ],
      sideNotes: [
        {
          title: "Who we serve",
          copy: "Families facing complex diagnoses, caregivers coordinating next steps, and patients seeking clarity."
        },
        {
          title: "What we measure",
          copy: "Turnaround time, patient confidence, and follow-through after each consultation."
        }
      ],
      highlights: [
        {
          title: "Founded in 2023",
          copy: "Launched to close the gap between diagnoses and actionable plans."
        },
        {
          title: "Patient-first design",
          copy: "Built around care navigators who stay with families throughout the journey."
        },
        {
          title: "National specialist network",
          copy: "Expanded access to vetted experts across key specialties."
        }
      ],
      timelineTitle: "Timeline",
      timeline: [
        {
          year: "2023",
          title: "Company launch",
          copy: "Formed the core advisory team and launched the first pilot programs."
        },
        {
          year: "2024",
          title: "Network growth",
          copy: "Scaled to include leading specialists and faster turnaround times."
        },
        {
          year: "2025",
          title: "Expanded coverage",
          copy: "Introduced new service lines and improved care coordination tools."
        }
      ]
    },
    process: {
      title: "Three steps to a confident decision.",
      tag: "Simple process",
      copy: "Our care coordinators guide you from upload to results.",
      cta: {
        label: "Read our story",
        href: "./?page=news"
      },
      steps: [
        { step: "Step 01", title: "Share your records", copy: "Securely upload labs, scans, and care notes in minutes." },
        { step: "Step 02", title: "Match with a specialist", copy: "We assign the right expert based on your exact condition." },
        { step: "Step 03", title: "Receive your plan", copy: "Get a clear summary, options, and next-step guidance." }
      ]
    },
    stories: {
      title: "Real people. Real peace of mind.",
      tag: "Patient stories",
      copy: "Patients share how expert opinions helped them move forward.",
      items: [
        { name: "Jenna R.", quote: "The team translated my results into a plan I could trust. The turnaround was faster than my local hospital." },
        { name: "David P.", quote: "The second opinion saved me months of uncertainty and confirmed the best treatment path." },
        { name: "Hannah L.", quote: "It felt personal, organized, and professional from the first call." }
      ]
    },
    contact: {
      title: "Ready to start your virtual doctor consultation?",
      copy: "Schedule a discovery call or request a free record review today.",
      ctaPrimary: { label: "Email our team", href: "mailto:care@virtualcarestudio.com" },
      ctaSecondary: { label: "Call (555) 123-4567", href: "tel:+15551234567" },
      ctaTertiary: { label: "Meet the team", href: "./?page=team" }
    }
  },
  footer: [
    {
      title: "Services",
      items: [
        "Second Medical Opinion",
        "Virtual Doctor",
        "Primary Care Consultation",
        "Mental Health",
        "Virtual Dentist",
        "Weight Management"
      ]
    },
    {
      title: "Support",
      items: [
        "Contact Us",
        "Disclaimer",
        "FAQs",
        "Prescription Policy",
        "Sample Letters",
        "Terms of Use",
        "Privacy Policy",
        "Sitemap",
        "Refund Policy"
      ]
    },
    {
      title: "Company",
      items: [
        "About",
        "For Care Providers",
        "For Organizations",
        "Global"
      ]
    },
    {
      title: "Resources",
      items: [
        "Health Tips",
        "Healthcare News",
        "In the News",
        "Vlog",
        "Blog",
        "Testimonial",
        "Tell a Friend"
      ]
    }
  ],
  footerContact: {
    heading: "Connect with us",
    message: "",
    phone: "",
    email: "",
    note: ""
  },
  license: "© 2026 MedBridge. All rights reserved."
};

export default siteData;
