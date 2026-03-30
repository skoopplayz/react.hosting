"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, ExternalLink, Activity, Package, Loader2 } from "lucide-react";

interface Project {
  id: string;
  name: string;
  repo: string;
  status: string;
  url: string;
  updatedAt: string;
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects");
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">My Projects</h1>
            <p className="text-zinc-500">Manage and monitor your hosted applications.</p>
          </div>
          <Link
            href="/new"
            className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            New Project
          </Link>
        </header>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-500">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p>Loading your projects...</p>
            </div>
          ) : (
            <>
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Package className="text-zinc-600 dark:text-zinc-400" size={20} />
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 ${
                      project.status === "Ready" 
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    }`}>
                      <Activity size={12} />
                      {project.status}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-1 truncate">{project.name}</h3>
                  <div className="flex items-center gap-2 text-zinc-500 text-sm mb-6 truncate">
                    {project.repo}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <span className="text-xs text-zinc-400">Updated {project.updatedAt}</span>
                    <Link
                      href={project.url}
                      target="_blank"
                      className="flex items-center gap-1 text-sm font-semibold hover:underline"
                    >
                      Visit site
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>
              ))}
              
              {/* Add Project Card Placeholder */}
              <Link
                href="/new"
                className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-black dark:hover:border-white transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-4 group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-colors">
                  <Plus size={24} />
                </div>
                <p className="font-bold">Connect a new project</p>
                <p className="text-sm text-zinc-500 mt-1">Select from your GitHub repositories.</p>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
