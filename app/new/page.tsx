"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Search, RefreshCw, Rocket, Loader2 } from "lucide-react";

interface Repo {
  id: string;
  name: string;
  description: string;
  updatedAt: string;
  language: string;
  full_name: string;
}

export default function NewProject() {
  const router = useRouter();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchRepos = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/repos");
      const data = await response.json();
      setRepos(data);
    } catch (error) {
      console.error("Error fetching repositories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const handleDeploy = async (repo: Repo) => {
    setDeploying(repo.id);
    try {
      const response = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoName: repo.name,
          repoId: repo.id,
          fullName: repo.full_name || repo.name,
        }),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        const error = await response.json();
        alert(`Deployment failed: ${error.error}`);
      }
    } catch (error) {
      console.error("Error deploying repository:", error);
      alert("An unexpected error occurred during deployment.");
    } finally {
      setDeploying(null);
    }
  };

  const filteredRepos = repos.filter(repo => 
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-black dark:hover:text-white mb-8 group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Import Repository</h1>
          <p className="text-zinc-500">Select a repository to start hosting.</p>
        </header>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>
          <button 
            onClick={fetchRepos}
            className="flex items-center gap-2 px-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            <RefreshCw className={loading ? "animate-spin" : ""} size={16} />
            Refresh
          </button>
        </div>

        {/* Repository List */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p>Fetching your repositories...</p>
            </div>
          ) : filteredRepos.length > 0 ? (
            filteredRepos.map((repo, idx) => (
              <div
                key={repo.id}
                className={`p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors ${
                  idx !== filteredRepos.length - 1 ? "border-b border-zinc-100 dark:border-zinc-800" : ""
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
                    <div className="w-5 h-5 bg-zinc-400 rounded-full" />
                  </div>
                  <div className="truncate">
                    <h3 className="font-bold text-lg mb-0.5 truncate">{repo.name}</h3>
                    <p className="text-sm text-zinc-500 max-w-md line-clamp-1">{repo.description || "No description provided."}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 self-end md:self-auto">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{repo.language || "Unknown"}</p>
                    <p className="text-sm text-zinc-500">{repo.updatedAt}</p>
                  </div>
                  <button 
                    onClick={() => handleDeploy(repo)}
                    disabled={deploying !== null}
                    className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed min-w-[110px] justify-center"
                  >
                    {deploying === repo.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        Import
                        <Rocket size={16} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
              <p>No repositories found.</p>
            </div>
          )}
        </div>

        {/* Not Found / Load More */}
        <p className="text-center text-zinc-500 mt-8 text-sm">
          Don&apos;t see your repository? Make sure our GitHub App has access.
          <Link href="#" className="ml-1 text-black dark:text-white font-semibold hover:underline">Configure Permissions</Link>
        </p>
      </div>
    </div>
  );
}
