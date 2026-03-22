"use client";

import {
  type CSSProperties,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ScatterView } from "@/components/projects/ScatterView";
import { TimelineView } from "@/components/projects/TimelineView";
import { Project, projects, projectsCopy } from "@/data/projects";
import {
  getDemoYoutubeIdForProject,
  getDemoYoutubeSecondaryIdForProject,
} from "@/data/projectYoutubeDemos";
import projectGalleriesAuto from "@/data/projectGalleries.auto.json";

const fallbackAccent = "#8b5cf6";

function displayNameForSort(p: Project) {
  return (p.bookmarkLabel ?? p.name).trim();
}

export default function ProjectsPage() {
  const localizedProjects = useMemo(
    () =>
      [...projects].sort((a, b) =>
        displayNameForSort(a).localeCompare(displayNameForSort(b), undefined, {
          sensitivity: "base",
        })
      ),
    []
  );
  const [projectSearch, setProjectSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [stageReady, setStageReady] = useState(false);
  const [viewMode, setViewMode] = useState<"scatter" | "timeline">("scatter");
  const [scatterExpanded, setScatterExpanded] = useState(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    return params.get("expanded") === "1";
  });
  const detailRef = useRef<HTMLDivElement | null>(null);
  const folderRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("selected");
    const shouldExpand = params.get("expanded") === "1";
    const requestedView = params.get("view");

    if (requestedView === "scatter" || requestedView === "timeline") {
      setViewMode(requestedView);
    }

    if (requested) {
      const project = localizedProjects.find((p) => p.id === requested);
      if (project && !selectedId) {
        // Use the same path as clicking a card so detail scroll + media state behave identically.
        handlePick(project);
      }
    }

    if (shouldExpand && !scatterExpanded) {
      setScatterExpanded(true);
      requestAnimationFrame(() => {
        folderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [localizedProjects, scatterExpanded, selectedId]);

  useEffect(() => {
    if (!localizedProjects.some((p) => p.id === selectedId)) {
      setSelectedId(null);
    }
  }, [localizedProjects, selectedId]);

  useEffect(() => {
    const timer = setTimeout(() => setStageReady(true), 80);
    return () => clearTimeout(timer);
  }, []);

  if (!localizedProjects.length) return null;

  const filteredProjects = useMemo(() => {
    const q = projectSearch.trim().toLowerCase();
    if (!q) return localizedProjects;
    return localizedProjects.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(q);
      const labelMatch =
        p.bookmarkLabel?.toLowerCase().includes(q) ?? false;
      const idMatch = p.id.toLowerCase().includes(q);
      return nameMatch || labelMatch || idMatch;
    });
  }, [localizedProjects, projectSearch]);

  useEffect(() => {
    if (
      selectedId &&
      !filteredProjects.some((p) => p.id === selectedId)
    ) {
      setSelectedId(null);
    }
  }, [filteredProjects, selectedId]);

  const handlePick = (project: Project) => {
    setSelectedId(project.id);
    requestAnimationFrame(() => {
      if (detailRef.current) {
        detailRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  };

  const selectedProject = selectedId
    ? localizedProjects.find((p) => p.id === selectedId) ?? null
    : null;
  const copy = projectsCopy;
  const accent = selectedProject?.accent ?? fallbackAccent;

  const youtubeId = selectedProject
    ? getDemoYoutubeIdForProject(selectedProject)
    : null;
  const youtubeSecondaryId = selectedProject
    ? getDemoYoutubeSecondaryIdForProject(selectedProject)
    : null;
  const hasDualYoutube = Boolean(youtubeId && youtubeSecondaryId);
  const folderGallery =
    selectedProject?.id &&
    (projectGalleriesAuto as Record<string, string[]>)[selectedProject.id]
      ? (projectGalleriesAuto as Record<string, string[]>)[selectedProject.id]
      : [];

  /** Main viewer: YouTube demo(s) or expanded gallery image (by index). */
  const [mediaStage, setMediaStage] = useState<
    "youtube" | "youtube2" | number
  >("youtube");

  const galleryFocusIndex =
    typeof mediaStage === "number" &&
    mediaStage >= 0 &&
    mediaStage < folderGallery.length
      ? mediaStage
      : 0;

  const displayYoutubeId =
    mediaStage === "youtube2" && youtubeSecondaryId
      ? youtubeSecondaryId
      : youtubeId;

  useLayoutEffect(() => {
    if (!selectedProject?.id) return;
    setMediaStage(
      youtubeId ? "youtube" : folderGallery.length > 0 ? 0 : "youtube"
    );
  }, [selectedProject?.id, youtubeId, folderGallery.length]);

  useEffect(() => {
    if (!selectedProject) return;
    requestAnimationFrame(() => {
      if (detailRef.current) {
        detailRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  }, [selectedProject]);

  return (
    <div className={`projects-page ${stageReady ? "is-mounted" : ""}`}>
      <header
        className="projects-header reveal-block"
        style={{ ["--reveal-delay" as string]: "0ms" }}
      >
        <div className="projects-lede">
          <p className="projects-kicker">Projects</p>
          <h1 className="projects-title">{copy.title}</h1>
          <p className="projects-intro">{copy.intro}</p>
        </div>
      </header>

      <section
        className={`projects-folder reveal-block ${
          viewMode === "timeline" ? "is-timeline-entry" : ""
        }`}
        style={{ ["--reveal-delay" as string]: "140ms" }}
        ref={folderRef}
      >
        <div className="projects-toolbar">
          <div className="projects-toolbar-left">
            <button
              type="button"
              className={
                viewMode === "scatter"
                  ? "view-toggle-btn is-active"
                  : "view-toggle-btn"
              }
              onClick={() => setViewMode("scatter")}
            >
              Scatter
            </button>
            <button
              type="button"
              className={
                viewMode === "timeline"
                  ? "view-toggle-btn is-active"
                  : "view-toggle-btn"
              }
              onClick={() => setViewMode("timeline")}
            >
              Timeline
            </button>
          </div>

          <div className="projects-toolbar-center">
            <label
              className="projects-search-label"
              htmlFor="projects-search"
            >
              Search projects
            </label>
            <div className="projects-search-inner">
              <input
                id="projects-search"
                type="search"
                className="projects-search-input"
                placeholder="Search by name…"
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
              {projectSearch.trim() && (
                <span className="projects-search-count">
                  {filteredProjects.length} of {localizedProjects.length}
                </span>
              )}
            </div>
          </div>

          <div className="projects-toolbar-right">
            {viewMode === "scatter" ? (
              <button
                type="button"
                className={`view-toggle-btn view-toggle-expand ${
                  scatterExpanded ? "is-active" : ""
                }`}
                onClick={() => setScatterExpanded((prev) => !prev)}
                aria-expanded={scatterExpanded}
                aria-label={scatterExpanded ? "Minimize" : "Expand"}
              >
                {scatterExpanded ? "Minimize" : "Expand"}
              </button>
            ) : (
              <span className="projects-toolbar-spacer" aria-hidden />
            )}
          </div>
        </div>

        {filteredProjects.length === 0 && projectSearch.trim() ? (
          <p className="projects-search-empty">
            No projects match &ldquo;{projectSearch.trim()}&rdquo;. Clear the
            search to see all projects.
          </p>
        ) : viewMode === "scatter" ? (
          <div
            className="scatter-hover-expand"
            onMouseEnter={() => setScatterExpanded(true)}
            onTouchStart={() => setScatterExpanded(true)}
          >
            <ScatterView
              projects={filteredProjects}
              selectedId={selectedId}
              onSelect={handlePick}
              stageReady={stageReady}
              fallbackAccent={fallbackAccent}
              expanded={scatterExpanded}
              onExpandChange={setScatterExpanded}
            />
          </div>
        ) : (
          <TimelineView
            projects={filteredProjects}
            selectedId={selectedId}
            onSelect={handlePick}
            fallbackAccent={fallbackAccent}
          />
        )}
      </section>

      {selectedProject && (
        <section
          className="project-showcase is-visible reveal-block"
          style={
            {
              ["--project-accent" as string]: accent,
              ["--reveal-delay" as string]: "280ms",
            } as CSSProperties
          }
          ref={detailRef}
        >
          <div className="project-copy is-visible">
            <div className="project-selected-pill">
              Selected project
            </div>
            <p className="project-meta">
              {selectedProject.period} · {selectedProject.role}
            </p>
            <h2 className="project-headline">{selectedProject.name}</h2>
            <p className="project-description">
              {selectedProject.shortDescription}
            </p>

            <ul className="project-highlights">
              {selectedProject.highlights.map((highlight, idx) => (
                <li key={idx} className="project-highlight">
                  <span className="project-highlight-dot" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

            <div className="project-links">
              <div className="project-tags">
                {selectedProject.techStack.slice(0, 6).map((tag) => (
                  <span key={tag} className="project-tag">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="project-links-row">
                {selectedProject.link && (
                  <a
                    href={selectedProject.link}
                    target="_blank"
                    rel="noreferrer"
                    className="project-link"
                  >
                    {selectedProject.linkLabel ?? "View on GitHub →"}
                  </a>
                )}
                {selectedProject.hackathonEventUrl && (
                  <a
                    href={selectedProject.hackathonEventUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="project-link project-link--event"
                  >
                    {selectedProject.hackathonEventLabel ??
                      "Hackathon event details"}{" "}
                    →
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="project-media is-visible">
            <div className="project-media-frame">
              <div className="project-media-header">
                <span className="project-media-pill">
                  {youtubeId && folderGallery.length > 0
                    ? hasDualYoutube
                      ? "Demos & gallery"
                      : "Demo & gallery"
                    : youtubeId
                      ? hasDualYoutube
                        ? "Demo videos"
                        : "Demo video"
                      : folderGallery.length > 0
                        ? "Gallery"
                        : selectedProject?.mediaType === "video"
                          ? "Project video"
                          : "Project image"}
                </span>
                <span className="project-media-label">
                  {selectedProject?.mediaLabel ??
                    selectedProject?.name ??
                    "Select a project"}
                </span>
              </div>

              <div
                className={
                  "project-media-display" +
                  (youtubeId || folderGallery.length > 0
                    ? " project-media-display--rich"
                    : "")
                }
              >
                {youtubeId && folderGallery.length > 0 ? (
                  <>
                    <div className="project-youtube-wrap project-main-stage">
                      {mediaStage === "youtube" || mediaStage === "youtube2" ? (
                        <iframe
                          key={`${selectedProject.id}-yt-${mediaStage}`}
                          title={`${selectedProject.name} demo`}
                          className="project-youtube-iframe"
                          src={`https://www.youtube.com/embed/${displayYoutubeId}?autoplay=1&mute=1&playsinline=1&rel=0`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      ) : (
                        <img
                          src={folderGallery[galleryFocusIndex]}
                          alt={`${selectedProject.name} screenshot ${galleryFocusIndex + 1}`}
                          className="project-stage-expanded-img"
                        />
                      )}
                    </div>
                    {(mediaStage === "youtube" || mediaStage === "youtube2") && (
                      <p className="project-youtube-hint">
                        Plays automatically (muted). Tap a photo below to expand
                        it here — use a <strong>demo</strong> tab to return.
                      </p>
                    )}
                    {mediaStage !== "youtube" && mediaStage !== "youtube2" && (
                      <p className="project-youtube-hint">
                        Expanded view. Select a <strong>demo</strong> or
                        another thumbnail below.
                      </p>
                    )}
                    <div
                      className="project-media-strip"
                      role="tablist"
                      aria-label="Demo video and screenshots"
                    >
                      {hasDualYoutube ? (
                        <>
                          <button
                            type="button"
                            role="tab"
                            aria-selected={mediaStage === "youtube2"}
                            className={
                              "project-strip-demo" +
                              (mediaStage === "youtube2"
                                ? " project-strip-item--active"
                                : "")
                            }
                            onClick={() => setMediaStage("youtube2")}
                          >
                            <span
                              className="project-strip-demo-icon"
                              aria-hidden
                            >
                              ▶
                            </span>
                            Elevator pitch
                          </button>
                          <button
                            type="button"
                            role="tab"
                            aria-selected={mediaStage === "youtube"}
                            className={
                              "project-strip-demo" +
                              (mediaStage === "youtube"
                                ? " project-strip-item--active"
                                : "")
                            }
                            onClick={() => setMediaStage("youtube")}
                          >
                            <span
                              className="project-strip-demo-icon"
                              aria-hidden
                            >
                              ▶
                            </span>
                            Product demo
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          role="tab"
                          aria-selected={mediaStage === "youtube"}
                          className={
                            "project-strip-demo" +
                            (mediaStage === "youtube"
                              ? " project-strip-item--active"
                              : "")
                          }
                          onClick={() => setMediaStage("youtube")}
                        >
                          <span className="project-strip-demo-icon" aria-hidden>
                            ▶
                          </span>
                          Demo video
                        </button>
                      )}
                      {folderGallery.map((src, i) => (
                        <button
                          key={`${src}-${i}`}
                          type="button"
                          role="tab"
                          aria-selected={mediaStage === i}
                          className={
                            "project-strip-thumb" +
                            (mediaStage === i
                              ? " project-strip-item--active"
                              : "")
                          }
                          onClick={() => setMediaStage(i)}
                          aria-label={`Screenshot ${i + 1}`}
                        >
                          <img src={src} alt="" loading="lazy" />
                        </button>
                      ))}
                    </div>
                  </>
                ) : youtubeId ? (
                  hasDualYoutube ? (
                    <>
                      <div className="project-youtube-wrap project-main-stage">
                        <iframe
                          key={`${selectedProject.id}-yt-${mediaStage}`}
                          title={`${selectedProject.name} demo`}
                          className="project-youtube-iframe"
                          src={`https://www.youtube.com/embed/${displayYoutubeId}?autoplay=1&mute=1&playsinline=1&rel=0`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                      <p className="project-youtube-hint">
                        Plays automatically (muted). Switch between{" "}
                        <strong>Elevator pitch</strong> and{" "}
                        <strong>Product demo</strong> below.
                      </p>
                      <div
                        className="project-media-strip"
                        role="tablist"
                        aria-label="Demo videos"
                      >
                        <button
                          type="button"
                          role="tab"
                          aria-selected={mediaStage === "youtube2"}
                          className={
                            "project-strip-demo" +
                            (mediaStage === "youtube2"
                              ? " project-strip-item--active"
                              : "")
                          }
                          onClick={() => setMediaStage("youtube2")}
                        >
                          <span
                            className="project-strip-demo-icon"
                            aria-hidden
                          >
                            ▶
                          </span>
                          Elevator pitch
                        </button>
                        <button
                          type="button"
                          role="tab"
                          aria-selected={mediaStage === "youtube"}
                          className={
                            "project-strip-demo" +
                            (mediaStage === "youtube"
                              ? " project-strip-item--active"
                              : "")
                          }
                          onClick={() => setMediaStage("youtube")}
                        >
                          <span
                            className="project-strip-demo-icon"
                            aria-hidden
                          >
                            ▶
                          </span>
                          Product demo
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="project-youtube-wrap">
                        <iframe
                          key={selectedProject.id}
                          title={`${selectedProject.name} demo`}
                          className="project-youtube-iframe"
                          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&playsinline=1&rel=0`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                      <p className="project-youtube-hint">
                        Plays automatically (muted). Use the player to play,
                        pause, and unmute.
                      </p>
                    </>
                  )
                ) : folderGallery.length > 1 ? (
                  <>
                    <div className="project-youtube-wrap project-main-stage">
                      <img
                        src={folderGallery[galleryFocusIndex]}
                        alt={`${selectedProject.name} ${galleryFocusIndex + 1}`}
                        className="project-stage-expanded-img"
                      />
                    </div>
                    <div
                      className="project-media-strip"
                      role="tablist"
                      aria-label="Screenshots"
                    >
                      {folderGallery.map((src, i) => (
                        <button
                          key={`${src}-${i}`}
                          type="button"
                          role="tab"
                          aria-selected={mediaStage === i}
                          className={
                            "project-strip-thumb project-strip-thumb--solo" +
                            (mediaStage === i
                              ? " project-strip-item--active"
                              : "")
                          }
                          onClick={() => setMediaStage(i)}
                          aria-label={`Image ${i + 1}`}
                        >
                          <img src={src} alt="" loading="lazy" />
                        </button>
                      ))}
                    </div>
                  </>
                ) : folderGallery.length === 1 ? (
                  <div className="project-youtube-wrap project-main-stage">
                    <img
                      src={folderGallery[0]}
                      alt={selectedProject.name}
                      className="project-stage-expanded-img"
                    />
                  </div>
                ) : selectedProject?.mediaType === "video" &&
                  selectedProject.mediaSrc ? (
                  <video
                    className="project-media-asset"
                    src={selectedProject.mediaSrc}
                    poster={selectedProject.mediaPoster}
                    controls
                    playsInline
                    loop
                    muted
                  />
                ) : selectedProject?.mediaSrc ? (
                  <img
                    className="project-media-asset"
                    src={selectedProject.mediaSrc}
                    alt={selectedProject.mediaLabel ?? selectedProject.name}
                    loading="lazy"
                  />
                ) : (
                  <>
                    <div className="media-window">
                      <div className="media-play">
                        <span>▶</span>
                      </div>
                      <div className="media-bars">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>
                    <div className="media-pip">
                      <span />
                      <span />
                    </div>
                  </>
                )}
              </div>

              <p className="project-media-caption">
                {youtubeId
                  ? hasDualYoutube
                    ? "Embedded demos — switch between pitch and product without leaving this page."
                    : "Embedded demo — no need to leave this page."
                  : folderGallery.length > 0
                    ? "Screenshot collage."
                    : selectedProject?.mediaLabel ??
                      selectedProject?.shortDescription ??
                      "Choose a project to preview its image or video."}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
