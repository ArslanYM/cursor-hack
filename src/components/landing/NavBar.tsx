"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Wheat, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/app/ThemeToggle";

export function NavBar() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGetStarted = useCallback(() => {
    if (isLoaded) {
      if (user) {
        router.push("/(authenticated)");
      } else {
        router.push("/sign-up");
      }
    }
  }, [isLoaded, user, router]);

  return (
    <header className="sticky top-0 z-50 bg-kv-bg/80 backdrop-blur-xl border-b border-kv-border/15">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Wheat className="w-8 h-8 text-kv-primary group-hover:scale-110 transition-transform" strokeWidth={2.5} />
            <span className="text-xl sm:text-2xl font-extrabold text-kv-text tracking-tight">
              KisanVoice
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-kv-text-muted hover:text-kv-text transition-colors">
              Features
            </a>
            <a href="#benefits" className="text-kv-text-muted hover:text-kv-text transition-colors">
              Benefits
            </a>
            <a href="#how-it-works" className="text-kv-text-muted hover:text-kv-text transition-colors">
              How It Works
            </a>
          </div>

          {/* Right Side - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {isLoaded && user ? (
              <Link
                href="/(authenticated)"
                className="px-6 py-2.5 bg-kv-primary text-white rounded-full font-semibold hover:bg-kv-primary/90 transition-colors active:scale-95"
              >
                Open App
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="px-6 py-2.5 text-kv-text hover:bg-kv-surface rounded-full transition-colors"
                >
                  Sign In
                </Link>
                <button
                  onClick={handleGetStarted}
                  className="px-6 py-2.5 bg-kv-primary text-white rounded-full font-semibold hover:bg-kv-primary/90 transition-colors active:scale-95"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-kv-surface hover:bg-kv-surface-hover transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-kv-text" />
              ) : (
                <Menu className="w-6 h-6 text-kv-text" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-kv-border/15 space-y-3">
            <a
              href="#features"
              className="block px-4 py-2 text-kv-text-muted hover:text-kv-text hover:bg-kv-surface rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#benefits"
              className="block px-4 py-2 text-kv-text-muted hover:text-kv-text hover:bg-kv-surface rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Benefits
            </a>
            <a
              href="#how-it-works"
              className="block px-4 py-2 text-kv-text-muted hover:text-kv-text hover:bg-kv-surface rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </a>
            <div className="pt-3 border-t border-kv-border/15 space-y-2">
              {isLoaded && user ? (
                <Link
                  href="/(authenticated)"
                  className="block w-full px-4 py-2.5 text-center bg-kv-primary text-white rounded-lg font-semibold hover:bg-kv-primary/90 transition-colors"
                >
                  Open App
                </Link>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="block w-full px-4 py-2.5 text-center text-kv-text hover:bg-kv-surface rounded-lg transition-colors"
                  >
                    Sign In
                  </Link>
                  <button
                    onClick={handleGetStarted}
                    className="w-full px-4 py-2.5 bg-kv-primary text-white rounded-lg font-semibold hover:bg-kv-primary/90 transition-colors"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
