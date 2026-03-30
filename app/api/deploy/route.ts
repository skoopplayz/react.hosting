import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { repoName, repoId, fullName } = await request.json();

  const vercelToken = process.env.VERCEL_TOKEN;

  if (!vercelToken) {
    // Simulate a successful deployment for demonstration if no token is provided
    console.log("No VERCEL_TOKEN found. Simulating deployment for", repoName);
    
    // Simulate a short delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return NextResponse.json({
      id: "simulated_id",
      name: repoName,
      url: `https://${repoName.toLowerCase()}.vercel.app`,
      status: "Building",
    });
  }

  try {
    // 1. Create a Vercel project connected to GitHub
    const createProjectRes = await fetch("https://api.vercel.com/v9/projects", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: repoName.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
        framework: "nextjs", // Default to Next.js
        gitRepository: {
          type: "github",
          repo: fullName,
        },
      }),
    });

    const project = await createProjectRes.json();

    if (!createProjectRes.ok) {
      throw new Error(project.error?.message || "Failed to create Vercel project");
    }

    // 2. Trigger an initial deployment
    const createDeploymentRes = await fetch("https://api.vercel.com/v13/deployments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: repoName,
        project: project.id,
        gitSource: {
          type: "github",
          ref: "main",
          repoId: repoId,
        },
      }),
    });

    const deployment = await createDeploymentRes.json();

    return NextResponse.json({
      id: project.id,
      name: project.name,
      url: `https://${deployment.url || project.name + '.vercel.app'}`,
      status: "Building",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to deploy project";
    console.error("Error deploying project:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
