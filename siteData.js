// Note: Central content and copy live here for easy edits.
const siteData = {
  brand: {
    name: "MedBridgeGlobal",
    navPrimary: "Start consult",
    navSecondary: "Consultations"
  },
  nav: [
    { label: "Home", hash: "#home" },
    { label: "Services", hash: "#services" },
    { label: "How it works", hash: "#process" },
    { label: "Contact", hash: "#contact" }
  ],
  pages: {
    home: {
      hero: {
        tag: "Home",
        title: "Free Doctor Consultation",
        copy: "Connect with board-certified physicians, share your records securely, and get clear next steps in days, not weeks.",
        stats: [
          { value: "feedback within 24 hours", label: "Care team access" },
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
        {
          title: "Expert Second Opinion",
          copy: "Second Opinion service connects patients with qualified U.S.-based physicians who review medical records and provide an independent clinical assessment. This service is ideal for patients seeking confirmation of a diagnosis, treatment plan, or surgical recommendation."
        },
        { title: "Multi-Specialist Review", copy: "For complex, rare, or high-stakes cases, our Panel Consilium brings together multiple U.S. specialists to collaboratively evaluate the patient’s condition. This structured review delivers deeper clinical insight and coordinated recommendations." },
        { title: "U.S. Visit Coordination", copy: "We assist patients who are traveling to the U.S. for care by coordinating appointments, documentation, scheduling, and communication with healthcare providers. This service removes logistical barriers and reduces stress during care delivery." }
      ]
    },
    serviceDetails: {
      expertSecondOpinion: {
        tag: "Signature service",
        title: "Expert Second Opinion",
        intro: "Add intro copy for the expert second opinion page.",
        blocks: [
          { type: "text", title: "Overview", copy: "Add overview copy for this service." },
          { type: "text", title: "What you receive", copy: "Add deliverables and timelines." },
          { type: "image", src: "", alt: "Expert Second Opinion", caption: "Add image caption." },
          { type: "text", title: "Ideal for", copy: "Describe who benefits most from this service." },
          {
            type: "list",
            title: "Key highlights",
            items: [
              "Highlight turnaround time or response expectations.",
              "Highlight specialist access or credentialing.",
              "Highlight the format of the final report."
            ]
          },
          { type: "image", src: "", alt: "Expert Second Opinion", caption: "Add image caption." }
        ]
      },
      multiSpecialistReview: {
        tag: "Signature service",
        title: "Multi-Specialist Review",
        intro: "Add intro copy for the multi-specialist review page.",
        blocks: [
          { type: "text", title: "Overview", copy: "Add overview copy for this service." },
          { type: "image", src: "", alt: "Multi-Specialist Review", caption: "Add image caption." },
          { type: "text", title: "How the panel works", copy: "Add the collaboration details here." },
          {
            type: "list",
            title: "Key highlights",
            items: [
              "Highlight cross-specialty collaboration.",
              "Highlight deeper diagnostic insight.",
              "Highlight clear next-step recommendations."
            ]
          },
          { type: "text", title: "Timing", copy: "Set expectations for review and delivery." },
          { type: "image", src: "", alt: "Multi-Specialist Review", caption: "Add image caption." }
        ]
      },
      usVisitCoordination: {
        tag: "Signature service",
        title: "U.S. Visit Coordination",
        intro: "Add intro copy for the U.S. visit coordination page.",
        blocks: [
          { type: "text", title: "Overview", copy: "Add overview copy for this service." },
          { type: "text", title: "What we coordinate", copy: "Add the logistics coverage details." },
          { type: "image", src: "", alt: "U.S. Visit Coordination", caption: "Add image caption." },
          { type: "text", title: "Before arrival", copy: "Add pre-arrival planning details." },
          {
            type: "list",
            title: "Key highlights",
            items: [
              "Highlight scheduling and documentation support.",
              "Highlight travel and accommodation guidance.",
              "Highlight translation or concierge services."
            ]
          },
          { type: "image", src: "", alt: "U.S. Visit Coordination", caption: "Add image caption." }
        ]
      }
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
      title: "About MedBridge Global",
      tag: "Our story",
      copy: "MedBridge Global (MBG) exists to support patients and families at moments when medical decisions feel uncertain, complex, or overwhelming.",
      storyTitle: "Who We Are",
      storyCopy: "MBG is a U.S.-based care coordination and patient navigation organization that supports individuals seeking independent medical insight and clarity around complex healthcare decisions. We assist patients and families who are considering second opinions, multidisciplinary reviews, or expert consultations provided by U.S.-licensed physicians related to existing diagnoses, treatment plans, or unresolved clinical questions.",
      about: [
        {
          title: "Mission",
          copy: "Our mission is to help individuals and families navigate complex medical decisions with clarity, confidence, and trusted expert insight. We are committed to supporting informed decision-making through thoughtful guidance, ethical coordination, and a patient-centered approach."
        },
        {
          title: "Vision",
          copy: "Our vision is a world where access to medical expertise is not limited by geography, complexity, or uncertainty, where patients feel supported, informed, and empowered at every stage of their healthcare journey."
        },
        {
          title: "We Believe",
          copy: "Patients are best served when they have access to independent expert perspectives. Clear, compassionate communication strengthens understanding and engagement. Preparation and coordination bring greater meaning and value to medical consultations. Healthcare decisions should be informed, deliberate, and guided by each patient's values and priorities."
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
        {
          step: "Svc 01",
          title: "Submit Your Information",
          copy: "Begin by providing a few simple details about your goals and clinical background. Our team uses this to tailor the next steps specifically to your needs."
        },
        {
          step: "Svc 02",
          title: "Personalized Consultation",
          copy: "A dedicated care coordinator will connect with you to review your submission, answer questions, and walk through the options that best align with your objectives."
        },
        {
          step: "Svc 03",
          title: "Receive Your Recommendations",
          copy: "Based on your goals and consultation insights, we deliver a clear, actionable plan — empowering you to make a confident, informed decision about next steps."
        }
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
      ctaPrimary: { label: "Fill out form", href: "./?page=consult" },
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
  license: "� 2026 MedBridgeGlobal. All rights reserved."
};

export default siteData;


