import { NextResponse } from "next/server";

// Mock database to store deployed projects
const hostedProjects = [
  {
    id: "1",
    name: "my-react-app",
    repo: "user/my-react-app",
    status: "Ready",
    url: "https://my-react-app.vercel.app",
    updatedAt: "2 hours ago",
  },
  {
    id: "2",
    name: "portfolio-site",
    repo: "user/portfolio-site",
    status: "Building",
    url: "https://portfolio-site.vercel.app",
    updatedAt: "10 minutes ago",
  },
];

interface VercelProject {
  id: string;
  name: string;
  link?: {
    repo?: string;
  };
  latestDeployments?: {
    readyState: string;
    url: string;
  }[];
  updatedAt?: number;
}

export async function GET() {
  const vercelToken = process.env.VERCEL_TOKEN;

  if (!vercelToken) {
    // Return mock data for demonstration if no token is provided
    return NextResponse.json(hostedProjects);
  }

  try {
    const listProjectsRes = await fetch("https://api.vercel.com/v9/projects", {
      headers: {
        Authorization: `Bearer ${vercelToken}`,
      },
    });

    const data = await listProjectsRes.json();
    const projects: VercelProject[] = data.projects;

    if (!listProjectsRes.ok) {
      throw new Error("Failed to fetch Vercel projects");
    }

    const deployments = projects.map((project) => ({
      id: project.id,
      name: project.name,
      repo: project.link?.repo || "Not connected",
      status: project.latestDeployments?.[0]?.readyState === "READY" ? "Ready" : "Building",
      url: `https://${project.latestDeployments?.[0]?.url || project.name + '.vercel.app'}`,
      updatedAt: project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : "",
    }));

    return NextResponse.json(deployments);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}
