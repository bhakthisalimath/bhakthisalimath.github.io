"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ProjectCard from "@/components/ProjectCard";
import { projects, type Project } from "@/data/projects";
import { homeCopy } from "@/data/home";
import projectGalleriesAuto from "@/data/projectGalleries.auto.json";

const EMAIL_ADDRESS = "bhakthisalimath@gmail.com";
const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL_ADDRESS)}`;

export default function HomePage() {
  const router = useRouter();
  const [emailMenuOpen, setEmailMenuOpen] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const emailMenuRef = useRef<HTMLDivElement>(null);
  const githubGridRef = useRef<HTMLDivElement>(null);
  const [githubVisibleCount, setGithubVisibleCount] = useState(6);
  const content = useMemo(
    () => ({
      hero: homeCopy.hero,
      about: homeCopy.about,
      education: homeCopy.education,
      featuredProjects: homeCopy.featuredProjects,
      linkedin: homeCopy.linkedin,
      github: homeCopy.github,
    }),
    []
  );

  const githubRepos = useMemo(
    () => projects.filter((p) => !!p.link && p.link.includes("github.com")),
    []
  );

  const galleries = projectGalleriesAuto as Record<string, string[]>;

  const featuredProjects = useMemo(() => {
    return homeCopy.featuredProjects.projectIds
      .map((id) => projects.find((p) => p.id === id))
      .filter((p): p is Project => p != null);
  }, []);

  const scrollToAbout = useCallback(() => {
    document.getElementById("home-projects")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const scrollToProjects = useCallback(() => {
    document.getElementById("home-projects")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const openGmail = useCallback(() => {
    window.open(GMAIL_COMPOSE_URL, "_blank", "noopener,noreferrer");
    setEmailMenuOpen(false);
  }, []);

  const copyEmail = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(EMAIL_ADDRESS).then(() => {
        setEmailCopied(true);
        setEmailMenuOpen(false);
        setTimeout(() => setEmailCopied(false), 2000);
      });
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emailMenuRef.current &&
        !emailMenuRef.current.contains(event.target as Node)
      ) {
        setEmailMenuOpen(false);
      }
    }
    if (emailMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [emailMenuOpen]);

  useEffect(() => {
    const el = githubGridRef.current;
    if (!el) return;

    const MIN_CARD_PX = 260;
    const GAP_PX = 18; // matches ~1.1rem gap in CSS
    const ROWS = 2; // fixed "length" of the section

    const update = () => {
      const width = el.clientWidth || 0;
      if (!width) return;

      const columns = Math.max(
        1,
        Math.floor((width + GAP_PX) / (MIN_CARD_PX + GAP_PX))
      );
      setGithubVisibleCount(Math.min(githubRepos.length, columns * ROWS));
    };

    update();

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(update);
      ro.observe(el);
      window.addEventListener("resize", update);
      return () => {
        ro.disconnect();
        window.removeEventListener("resize", update);
      };
    }

    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [githubRepos.length]);

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal-on-scroll")
    );

    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("reveal-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-page">
      <section className="hero-section reveal-visible">
        {/* Background glows */}
        <div className="hero-bg">
          <div className="hero-bg-orb hero-bg-orb--left" />
          <div className="hero-bg-orb hero-bg-orb--right" />
          <div className="hero-bg-radial" />
          <div className="hero-bg-fade" />
        </div>

        {/* Main hero card */}
        <div className="hero-card">
          {/* Floating avatar */}
          <div className="hero-avatar-floating">
            <img
              src="/avatar/me1.jpg"
              alt="Bhakthi Salimath"
              className="hero-avatar-floating-img"
            />
          </div>

          {/* Greeting */}
          <header className="hero-header">
            <h1 className="hero-title">
              {content.hero.headline}{" "}
              <span className="hero-wave">{content.hero.wave}</span>
            </h1>
          </header>

          {/* Scannable snapshot — sentence + highlights (not form-like) */}
          <div className="hero-snapshot">
            <p className="hero-snapshot-title">{content.hero.snapshotTitle}</p>
            <p className="hero-snapshot-lead">{content.hero.snapshotLead}</p>

            <div className="hero-snapshot-cards" aria-label="Highlights">
              {content.hero.snapshotCards.map((card) => (
                <div key={card.title} className="hero-snapshot-card">
                  <p className="hero-snapshot-card-title">{card.title}</p>
                  <p className="hero-snapshot-card-body">{card.body}</p>
                </div>
              ))}
            </div>

            <div className="hero-snapshot-chips" aria-label="Quick tags">
              {content.hero.snapshotChips.map((chip) => {
                const sepIndex = chip.indexOf(":");
                const label =
                  sepIndex === -1 ? chip : chip.slice(0, sepIndex).trim();
                const value =
                  sepIndex === -1 ? "" : chip.slice(sepIndex + 1).trim();

                return (
                  <span key={chip} className="hero-snapshot-chip">
                    <span className="hero-snapshot-chip-label">{label}</span>
                    {value ? (
                      <span className="hero-snapshot-chip-value">{value}</span>
                    ) : null}
                  </span>
                );
              })}
            </div>
            <button
              type="button"
              className="section-cta hero-snapshot-cta"
              onClick={scrollToProjects}
            >
              {content.about.cta}
            </button>
          </div>

          {/* Social links */}
          <div id="contact" className="hero-socials">
            <p className="hero-contact-blurb">{content.hero.contactBlurb}</p>
            <div className="hero-socials-row" aria-label="Social links">
              {content.hero.socials.map((item) => {
                const isEmail = item.href.startsWith("mailto:");
                if (isEmail) {
                  return (
                    <div
                      key={item.label}
                      ref={emailMenuRef}
                      className="hero-email-wrap"
                    >
                      <button
                        type="button"
                        onClick={() => setEmailMenuOpen((open) => !open)}
                        className="hero-social-pill"
                        aria-label="Email options"
                        aria-expanded={emailMenuOpen}
                        aria-haspopup="true"
                      >
                        {item.icon && (
                          <img
                            src={item.icon}
                            alt={item.label}
                            className="hero-social-icon"
                          />
                        )}
                        <span>{item.label}</span>
                        <span className="hero-email-chevron" aria-hidden="true">
                          {emailMenuOpen ? "▲" : "▼"}
                        </span>
                      </button>
                      {emailMenuOpen && (
                        <div
                          className="hero-email-menu"
                          role="menu"
                          aria-label="Email options"
                        >
                          <a
                            href={GMAIL_COMPOSE_URL}
                            target="_blank"
                            rel="noreferrer"
                            role="menuitem"
                            className="hero-email-menu-item"
                            onClick={(e) => {
                              e.preventDefault();
                              openGmail();
                            }}
                          >
                            Open in Gmail
                          </a>
                          <button
                            type="button"
                            role="menuitem"
                            className="hero-email-menu-item"
                            onClick={copyEmail}
                          >
                            {emailCopied ? "Copied!" : "Copy email address"}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="hero-social-pill"
                  >
                    {item.icon && (
                      <img
                        src={item.icon}
                        alt={item.label}
                        className="hero-social-icon"
                      />
                    )}
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Scroll arrow */}
        <button
          type="button"
          className="hero-scroll-button"
          onClick={scrollToAbout}
          aria-label={content.hero.arrowLabel}
        >
          <span className="hero-scroll-icon">↓</span>
        </button>
      </section>

      <section
        id="home-projects"
        className="home-section home-section--projects reveal-on-scroll"
      >
        <header className="home-section-header">
          <div className="home-section-header-row">
            <h2 className="home-section-title">
              {content.featuredProjects.title}
            </h2>
            <a
              href="/projects"
              className="home-section-link home-section-link--primary"
            >
              {content.featuredProjects.cta} →
            </a>
          </div>
          <p className="home-section-subtitle">
            {content.featuredProjects.subtitle}
          </p>
        </header>

        <div className="home-projects-grid">
          {featuredProjects.map((project) => (
            <button
              key={project.id}
              type="button"
              className="reveal-on-scroll home-project-card"
              onClick={() =>
                router.push(
                  `/projects?expanded=1&view=scatter&selected=${project.id}`
                )
              }
              aria-label={`Open ${project.name} in Projects (expanded view)`}
            >
              <ProjectCard
                project={project}
                linkLabel="View on GitHub →"
                compact
                hideLink
                thumbnailSrc={galleries[project.id]?.[0] ?? null}
              />
            </button>
          ))}
        </div>

      </section>

      <section
        id="linkedin"
        className="home-section home-section--linkedin reveal-on-scroll"
      >
        <header className="home-section-header">
          <h2 className="home-section-title">{content.linkedin.title}</h2>
          <p className="home-section-subtitle">
            {content.linkedin.subtitle}
          </p>
        </header>

        <div className="linkedin-embeds">
          {content.linkedin.posts.map((post) => {
            const embedSrc = post.href.replace(
              "https://www.linkedin.com/feed/update/",
              "https://www.linkedin.com/embed/feed/update/"
            );
            return (
              <div key={post.href} className="linkedin-embed">
                <iframe
                  src={`${embedSrc}?collapsed=1`}
                  height="628"
                  width="100%"
                  frameBorder="0"
                  allowFullScreen
                  title={post.title}
                />
              </div>
            );
          })}
        </div>
        <div className="home-section-footer">
          <a
            href="https://www.linkedin.com/in/bhakthisalimath/"
            target="_blank"
            rel="noreferrer"
            className="home-section-link"
          >
            View my profile →
          </a>
        </div>
      </section>

      <section
        id="education"
        className="home-section home-section--education reveal-on-scroll"
      >
        <header className="home-section-header">
          <h2 className="home-section-title">{content.education.title}</h2>
          <p className="home-section-subtitle">{content.education.subtitle}</p>
        </header>

        <div className="education-timeline">
          {content.education.items.map((item, index) => (
            <div
              key={item.school}
              className="education-timeline-item reveal-on-scroll"
            >
              <div className="education-timeline-marker">
                <span className="education-dot" />
                {index !== content.education.items.length - 1 && (
                  <span className="education-line" />
                )}
              </div>
              <div className="education-timeline-card">
                <div className="education-card-top">
                  <div>
                    <p className="education-card-degree">{item.degree}</p>
                    <p className="education-card-school">{item.school}</p>
                  </div>
                  <span className="info-card-pill">{item.period}</span>
                </div>
                <p className="education-card-body">{item.details}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="github"
        className="home-section home-section--github reveal-on-scroll"
      >
        <header className="home-section-header">
          <h2 className="home-section-title">{content.github.title}</h2>
          <p className="home-section-subtitle">{content.github.subtitle}</p>
        </header>

        <div ref={githubGridRef} className="github-repos">
          {githubRepos.slice(0, githubVisibleCount).map((project) => (
              <a
                key={project.id}
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="github-repo-card"
                aria-label={`Open ${project.name} on GitHub`}
              >
                <div className="github-repo-top">
                  <span className="github-repo-name">{project.name}</span>
                  <span className="github-repo-pill">Repo</span>
                </div>
                <p className="github-repo-desc">{project.shortDescription}</p>
                <span className="github-repo-link">View repository →</span>
              </a>
            ))}
        </div>

        <div className="home-section-footer">
          <a
            href="https://github.com/bhakthisalimath"
            target="_blank"
            rel="noreferrer"
            className="home-section-link"
          >
            {content.github.cta} →
          </a>
        </div>
      </section>
    </div>
  );
}
