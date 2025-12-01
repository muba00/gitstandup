import { simpleGit, SimpleGit } from "simple-git";
import path from "path";

interface CommitInfo {
  hash: string;
  message: string;
  author: string;
  timestamp: string;
  files: string[];
  diff: string;
  stats: {
    additions: number;
    deletions: number;
  };
}

interface RepoResult {
  name: string;
  path: string;
  commits?: CommitInfo[];
  error?: string;
}

const MAX_DIFF_LINES_PER_FILE = 500;
const MAX_DIFF_LINES_PER_COMMIT = 2000;

/**
 * Truncate a diff to stay within limits
 */
function truncateDiff(diff: string, maxLines: number): string {
  const lines = diff.split("\n");
  if (lines.length <= maxLines) {
    return diff;
  }

  const halfLines = Math.floor(maxLines / 2);
  const start = lines.slice(0, halfLines);
  const end = lines.slice(-halfLines);

  return [
    ...start,
    `\n... (${lines.length - maxLines} lines omitted) ...\n`,
    ...end,
  ].join("\n");
}

/**
 * Get the current git user email for a repository
 */
async function getCurrentUserEmail(git: SimpleGit): Promise<string | null> {
  try {
    const email = await git.raw(["config", "user.email"]);
    return email.trim();
  } catch {
    return null;
  }
}

/**
 * Collect commits from a single repository
 */
async function collectRepoCommits(
  repoPath: string,
  hoursAgo: number
): Promise<RepoResult> {
  const repoName = path.basename(repoPath);

  try {
    const git = simpleGit(repoPath);

    // Check if it's a valid git repository
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      return {
        name: repoName,
        path: repoPath,
        error: "Not a git repository",
      };
    }

    // Get current user email
    const userEmail = await getCurrentUserEmail(git);
    if (!userEmail) {
      return {
        name: repoName,
        path: repoPath,
        error: "Could not determine git user.email",
      };
    }

    // Calculate time threshold
    const since = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
    const sinceStr = since.toISOString();

    // Get commits by current user since the time threshold
    const log = await git.log({
      "--since": sinceStr,
      "--author": userEmail,
      "--all": null,
    });

    if (log.all.length === 0) {
      return {
        name: repoName,
        path: repoPath,
        commits: [],
      };
    }

    // Collect commit details with diffs
    const commits: CommitInfo[] = [];

    for (const commit of log.all) {
      try {
        // Get the diff for this commit
        const diffSummary = await git.diffSummary([
          `${commit.hash}^`,
          commit.hash,
        ]);

        // Get full diff, but limit to avoid huge output
        let fullDiff = await git.diff([`${commit.hash}^`, commit.hash]);

        // Truncate diff if too large
        fullDiff = truncateDiff(fullDiff, MAX_DIFF_LINES_PER_COMMIT);

        // Skip generated files and lock files
        const relevantFiles = diffSummary.files.filter((f: any) => {
          const fileName = f.file.toLowerCase();
          return (
            !fileName.includes("package-lock.json") &&
            !fileName.includes("yarn.lock") &&
            !fileName.includes(".min.") &&
            !fileName.endsWith(".lock")
          );
        });

        commits.push({
          hash: commit.hash.substring(0, 7),
          message: commit.message,
          author: userEmail,
          timestamp: commit.date,
          files: relevantFiles.map((f: any) => f.file),
          diff: fullDiff,
          stats: {
            additions: diffSummary.insertions,
            deletions: diffSummary.deletions,
          },
        });
      } catch (error) {
        // If we can't get diff for a commit, skip it
        console.error(`Error getting diff for commit ${commit.hash}:`, error);
      }
    }

    return {
      name: repoName,
      path: repoPath,
      commits,
    };
  } catch (error) {
    return {
      name: repoName,
      path: repoPath,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Collect commits from multiple repositories
 */
export async function collectCommits(
  repoPaths: string[],
  hoursAgo: number
): Promise<RepoResult[]> {
  const results = await Promise.all(
    repoPaths.map((path) => collectRepoCommits(path, hoursAgo))
  );

  return results;
}
