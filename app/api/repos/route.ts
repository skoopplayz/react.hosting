import { NextResponse } from "next/server";
import { Octokit } from "octokit";

export async function GET() {
  const token = process.env.GITHUB_ACCESS_TOKEN;

  if (!token) {
    // Return mock data for demonstration if no token is provided
    return NextResponse.json([
      { id: "1", name: "my-react-app", description: "My first React app.", updatedAt: "2024-03-30", language: "TypeScript" },
      { id: "2", name: "portfolio-site", description: "Personal portfolio website.", updatedAt: "2024-03-28", language: "JavaScript" },
      { id: "3", name: "nextjs-blog", description: "A simple blog using Next.js.", updatedAt: "2024-03-25", language: "TypeScript" },
      { id: "4", name: "ecommerce-store", description: "Next.js + Tailwind CSS + Shopify.", updatedAt: "2024-03-20", language: "JavaScript" },
    ]);
  }

  try {
    const octokit = new Octokit({ auth: token });
    const { data } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: "updated",
      per_page: 100,
    });

    const repos = data.map((repo) => ({
      id: repo.id.toString(),
      name: repo.name,
      description: repo.description,
      updatedAt: repo.updated_at ? new Date(repo.updated_at).toLocaleDateString() : "",
      language: repo.language,
      full_name: repo.full_name,
    }));

    return NextResponse.json(repos);
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return NextResponse.json({ error: "Failed to fetch repositories" }, { status: 500 });
  }
}
