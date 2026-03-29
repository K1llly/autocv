import { NextRequest } from "next/server";

interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  html_url: string;
  fork: boolean;
  stargazers_count: number;
  topics: string[];
}

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username");

  if (!username) {
    return Response.json(
      { error: "GitHub username is required" },
      { status: 400 }
    );
  }

  const response = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=30`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!response.ok) {
    return Response.json(
      { error: "Failed to fetch GitHub repos" },
      { status: response.status }
    );
  }

  const repos: GitHubRepo[] = await response.json();

  const projects = repos
    .filter((repo) => !repo.fork)
    .map((repo) => ({
      name: repo.name,
      description: repo.description || "",
      language: repo.language || "",
      url: repo.html_url,
      stars: repo.stargazers_count,
      topics: repo.topics || [],
    }));

  return Response.json(projects);
}
