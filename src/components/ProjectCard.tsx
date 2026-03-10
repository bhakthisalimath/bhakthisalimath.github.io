// components/ProjectCard.tsx
import { Project } from "@/data/projects";

type Props = {
  project: Project;
  compact?: boolean;
  linkLabel?: string;
  hideLink?: boolean;
};

export default function ProjectCard({
  project,
  compact,
  linkLabel,
  hideLink,
}: Props) {
  return (
    <div className="project-card">
      <div className="project-card-header">
        <h3 className="project-card-title">{project.name}</h3>
        <span className="project-card-period">{project.period}</span>
      </div>

      <p className="project-card-role">{project.role}</p>

      <p className="project-card-description">{project.shortDescription}</p>

      <div className="project-card-tags">
        {project.techStack.slice(0, compact ? 4 : 8).map((tech) => (
          <span key={tech} className="project-card-tag">
            {tech}
          </span>
        ))}
        {project.techStack.length > 8 && !compact && (
          <span className="project-card-tag-more">
            +{project.techStack.length - 8} more
          </span>
        )}
      </div>

      {!compact && (
        <ul className="project-card-highlights">
          {project.highlights.map((h, i) => (
            <li key={i} className="flex gap-2">
              <span className="project-card-dot" />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      )}

      {project.link && !hideLink && (
        <a
          href={project.link}
          target="_blank"
          rel="noreferrer"
          className="project-card-link"
        >
          {linkLabel ?? "View on GitHub →"}
        </a>
      )}
    </div>
  );
}
