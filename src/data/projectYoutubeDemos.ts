/**
 * Easy place to attach demo videos — one line per project.
 *
 * KEY = project `id` from `projects.ts`. Use quotes if the id contains hyphens:
 *   "clueless-wardrobe": "https://..."
 *
 * VALUE = any of:
 *   • Full URL: https://www.youtube.com/watch?v=VIDEO_ID
 *   • Short:    https://youtu.be/VIDEO_ID
 *   • Just ID:  VIDEO_ID  (11 characters)
 *
 * Per-project `demoYoutubeUrl` in projects.ts overrides this map if both are set.
 */
import { getYoutubeVideoId, type Project } from "@/data/projects";

export const PROJECT_YOUTUBE_DEMOS: Record<string, string> = {
  bitesavr: "https://youtu.be/IwlTOgTBVzA",
  "clueless-wardrobe": "https://www.youtube.com/watch?v=mmpRPDiMmCk",
  "bytelove-syncs": "https://www.youtube.com/watch?v=--UWuTprmd8&t=27s",
};

/** Resolves YouTube video id for the project detail player. */
export function getDemoYoutubeIdForProject(project: Project): string | null {
  const url = project.demoYoutubeUrl ?? PROJECT_YOUTUBE_DEMOS[project.id];
  if (!url?.trim()) return null;
  return getYoutubeVideoId(url.trim());
}
