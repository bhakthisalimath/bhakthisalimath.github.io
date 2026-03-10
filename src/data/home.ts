export const homeCopy: {
  hero: {
    headline: string;
    wave: string;
    arrowLabel: string;
    socials: { label: string; href: string; icon: string }[];
    snapshotTitle: string;
    /** Short sentence at top (human, not “form-like”). */
    snapshotLead: string;
    /** Highlight boxes (cards). */
    snapshotCards: { title: string; body: string }[];
    /** Small chips for quick scanning. */
    snapshotChips: string[];
    contactBlurb: string;
  };
  about: {
    cta: string;
  };
  education: {
    title: string;
    subtitle: string;
    items: {
      school: string;
      degree: string;
      period: string;
      details: string;
      status: "current" | "past";
    }[];
  };
  featuredProjects: {
    title: string;
    subtitle: string;
    cta: string;
  };
  linkedin: {
    title: string;
    subtitle: string;
    posts: {
      title: string;
      href: string;
      date?: string;
      tag?: string;
    }[];
  };
  github: {
    title: string;
    subtitle: string;
    cta: string;
  };
} = {
  hero: {
    headline: "Hi, I'm Bhakthi Salimath",
    wave: ":)",
    arrowLabel: "Scroll to projects",
    snapshotTitle: "At a glance",
    snapshotLead:
      "Final-year Bachelor of Advanced Computing (Computer Science) at the University of Sydney — I build and ship projects with clear demos and readable code.",
    snapshotCards: [
      {
        title: "Shipped",
        body: "BiteSavr · Clueless (SYNCS 2025) · ML sentiment analysis · hackathon & coursework builds",
      },
      {
        title: "Stack",
        body: "Java · Python · TypeScript/React · Supabase/Firebase · REST APIs",
      },
      {
        title: "Hackathons",
        body: "WiT Hackathon 2nd Place (BiteSavr) · SYNCS Hackahon 2025 (Clueless) · GDSC×ENGO Hackathon 1st Place",
      },
    ],
    snapshotChips: [
      "Frontend: Next.js, React, Angular, Vite, Tailwind CSS, React Router, Three.js, React Three Fiber, SwiftUI",
      "Backend: Flask, SQLAlchemy, Flask-SocketIO, Express, Supabase, Firebase Authentication, SQLite, TCP sockets, JSON protocol design",
      "Testing/Deployment: GitHub Actions, GitHub Pages, JaCoCo, JUnit 5, pytest, unittest, Karma",
      "Developer tools: Gradle, Gradle Wrapper, SDKMAN, Node.js, npm, pip, Python venv, ESLint, Jenkins",
      "Languages: Java, Python, TypeScript, JavaScript, HTML, CSS, Swift, GLSL, Shell, Batchfile",
    ],
    contactBlurb:
      "Best way to reach me is email — I respond fastest there. LinkedIn works too for a quick intro.",
    socials: [
      {
        label: "GitHub",
        href: "https://github.com/bhakthisalimath",
        icon: "/icons/github.svg",
      },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/bhakthisalimath/",
        icon: "/icons/linkedin.svg",
      },
      {
        label: "Email",
        href: "mailto:bhakthisalimath@gmail.com",
        icon: "/icons/email.svg",
      },
    ],
  },
  about: {
    cta: "View projects",
  },
  education: {
    title: "Education",
    subtitle: "My academic journey and computing foundation.",
    items: [
      {
        school: "The University of Sydney",
        degree: "Bachelor of Advanced Computing (Computer Science)",
        period: "Feb 2024 – Nov 2026",
        details:
          "Coursework includes data structures and algorithms, object-oriented programming, software engineering, and algorithm design.",
        status: "current",
      },
      {
        school: "University of Technology Sydney",
        degree: "Bachelor of Computer Science",
        period: "Feb 2023 – Nov 2023",
        details: "Additional coursework and academic foundation.",
        status: "past",
      },
    ],
  },
  featuredProjects: {
    title: "Projects",
    subtitle:
      "Selected projects involving machine learning, algorithms, and real-world software applications.",
    cta: "View all projects",
  },
  linkedin: {
    title: "From LinkedIn",
    subtitle:
      "A few posts that give extra context and reflections beyond the code.",
    posts: [
      {
        title: 'Clueless — SYNCS Hack 2025 "Cities of the Future"',
        href: "https://www.linkedin.com/in/bhakthisalimath/",
        tag: "Hackathon · Sustainability",
      },
      {
        title:
          "BiteSavr — WiT LaunchPad Hackathon (2nd place, everyday impact)",
        href: "https://www.linkedin.com/in/bhakthisalimath/",
        tag: "Hackathon · Product",
      },
      {
        title:
          "GDSC × ENGO Problem Solving Challenge (1st place, UN SDGs)",
        href: "https://www.linkedin.com/in/bhakthisalimath/",
        tag: "Leadership · SDGs",
      },
    ],
  },
  github: {
    title: "From GitHub",
    subtitle: "A quick repository view of my work — open any repo for code and docs.",
    cta: "View GitHub profile",
  },
};
