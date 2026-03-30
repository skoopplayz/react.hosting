import Link from "next/link";
import { Zap, Shield, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-24 md:py-32 flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-black to-zinc-500 dark:from-white dark:to-zinc-500">
            Deploy in Seconds.
          </h1>
          <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl mb-10">
            The fastest way to host your React applications. Connect GitHub, 
            pick a repository, and let us handle the rest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
            <Link
              href="https://github.com"
              className="flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-800 px-8 py-4 rounded-full font-bold text-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              View on GitHub
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-20 bg-zinc-50 dark:bg-zinc-950">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-12 h-12 bg-black dark:bg-white rounded-xl flex items-center justify-center mb-4">
                <Zap className="text-white dark:text-black" />
              </div>
              <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Optimized build pipeline powered by Vercel for the fastest deployments.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-12 h-12 bg-black dark:bg-white rounded-xl flex items-center justify-center mb-4">
                <Shield className="text-white dark:text-black" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure by Default</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Automatic SSL, DDoS protection, and secure environment variables.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-12 h-12 bg-black dark:bg-white rounded-xl flex items-center justify-center mb-4">
                <Globe className="text-white dark:text-black" />
              </div>
              <h3 className="text-xl font-bold mb-2">Global Edge Network</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Your content is served from the edge, ensuring low latency worldwide.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-6 py-8 border-t border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-black dark:bg-white rounded-full" />
          <span className="font-bold tracking-tight">VHost</span>
        </div>
        <p className="text-sm text-zinc-500">
          © {new Date().getFullYear()} VHost Inc. Powered by Vercel.
        </p>
        <div className="flex gap-6 text-sm text-zinc-500">
          <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms</Link>
        </div>
      </footer>
    </div>
  );
}
