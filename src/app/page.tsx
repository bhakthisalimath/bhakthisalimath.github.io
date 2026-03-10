"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";
import { homeCopy } from "@/data/home";

const EMAIL_ADDRESS = "bhakthisalimath@gmail.com";
const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL_ADDRESS)}`;

export default function HomePage() {
  const [emailMenuOpen, setEmailMenuOpen] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const emailMenuRef = useRef<HTMLDivElement>(null);
  const content = useMemo(
    () => ({
      hero: homeCopy.hero,
      about: homeCopy.about,
      education: homeCopy.education,
      featuredProjects: homeCopy.featuredProjects,
      linkedin: homeCopy.linkedin,
    }),
    []
  );

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

          {/* Meta info */}
          <div className="hero-meta">
            <div className="hero-meta-row">
              <div className="hero-current">
                <span className="hero-rocket">🚀</span>
                <span>{content.hero.currently}</span>
              </div>
              <div className="hero-location">
                {content.hero.currentLocation}
              </div>
            </div>

            <p className="hero-role">{content.hero.currentRole}</p>
            <p className="hero-previous">{content.hero.previousTitle}</p>
          </div>

          {/* Creator line */}
          <p className="hero-creator">{content.hero.creator}</p>
          <div className="hero-about-inline">
            <div className="about-text">
              {content.about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <ul className="about-facts">
              {content.about.facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
            <button
              type="button"
              className="section-cta"
              onClick={scrollToProjects}
            >
              {content.about.cta}
            </button>
          </div>

          {/* Social links */}
          <div id="contact" className="hero-socials">
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
          <h2 className="home-section-title">
            {content.featuredProjects.title}
          </h2>
          <p className="home-section-subtitle">
            {content.featuredProjects.subtitle}
          </p>
        </header>

        <div className="home-projects-grid">
          {projects.slice(0, 3).map((project) => (
            <div key={project.id} className="reveal-on-scroll">
              <ProjectCard
                project={project}
                linkLabel="View on GitHub →"
                compact
              />
            </div>
          ))}
        </div>

        <div className="home-section-footer">
          <a href="/projects" className="home-section-link">
            {content.featuredProjects.cta} →
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
          {/* Latest → oldest */}
          <div className="linkedin-embed">
            <iframe
              src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7391697614162812928?collapsed=1"
              height="628"
              width="100%"
              frameBorder="0"
              allowFullScreen
              title="LinkedIn post 7391697614162812928"
            />
          </div>
          <div className="linkedin-embed">
            <iframe
              src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7249947272107450369?collapsed=1"
              height="628"
              width="100%"
              frameBorder="0"
              allowFullScreen
              title="LinkedIn post 7249947272107450369"
            />
          </div>
          <div className="linkedin-embed">
            <iframe
              src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7220277783887794176?collapsed=1"
              height="628"
              width="100%"
              frameBorder="0"
              allowFullScreen
              title="LinkedIn post 7220277783887794176"
            />
          </div>
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
    </div>
  );
}
