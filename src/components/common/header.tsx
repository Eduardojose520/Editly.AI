"use client";
import { useStoreUserEffect } from "@/hooks/useStoreUserEffect";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Authenticated, Unauthenticated } from "convex/react";

const UserButton = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.UserButton),
  { ssr: false },
);

const navLinks = [
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
  { name: "Contact", href: "/contact" },
];

export const Header = () => {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { isLoading } = useStoreUserEffect();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-black/70 shadow-lg backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-300 ${
          scrolled ? "py-2" : "py-4"
        }`}
      >
        <Link href="/" className="text-xl font-bold text-white">
          PhotoFi<span className="text-pink-500">.Ai</span>
        </Link>

        <nav className="relative hidden space-x-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={path === link.href ? "page" : undefined}
              className={`relative text-sm font-medium transition-colors ${
                path === link.href
                  ? "text-pink-400"
                  : "text-gray-300 hover:text-pink-300"
              }`}
            >
              {link.name}
              {path === link.href && (
                <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded bg-gradient-to-r from-pink-500 to-orange-400"></span>
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <Unauthenticated>
            <Link
              href="/sign-in"
              className="cursor-pointer rounded-lg px-4 py-2 font-medium text-white transition hover:text-pink-400"
            >
              Sign In
            </Link>

            <Link
              href="/sign-up"
              className="cursor-pointer rounded-lg bg-gradient-to-r from-pink-500 to-orange-400 px-3 py-1.5 font-medium text-white shadow-md transition hover:opacity-90"
            >
              Start Editing
            </Link>
          </Unauthenticated>

          <Authenticated>
            <Link
              href="/dashboard"
              className="cursor-pointer rounded-lg bg-pink-500 px-3 py-1.5 font-medium text-white shadow-md transition hover:bg-pink-600"
            >
              Dashboard
            </Link>

            <UserButton afterSignOutUrl="/" />
          </Authenticated>
        </div>
      </div>

      {isLoading && (
        <div className="absolute top-0 left-0 w-full">
          <div className="h-1 w-full animate-pulse bg-gradient-to-r from-pink-500 via-orange-400 to-pink-500"></div>
        </div>
      )}
    </header>
  );
};
