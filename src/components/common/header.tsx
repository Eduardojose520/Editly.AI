"use client";
import { useStoreUserEffect } from "@/hooks/useStoreUserEffect";
import { UserButton } from "@clerk/nextjs";
import { BarLoader } from "react-spinners";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Authenticated, Unauthenticated } from "convex/react";

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
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
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
              className={`relative text-sm font-medium transition-colors ${
                path === link.href
                  ? "text-neutral-400"
                  : "text-gray-300 hover:text-neutral-700"
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
            <Link href="/sign-in">
              <button className="cursor-pointer rounded-lg px-4 py-2 font-medium text-white transition hover:text-pink-400">
                Sign In
              </button>
            </Link>

            <Link href="/sign-up">
              <button className="cursor-pointer rounded-lg bg-gradient-to-r from-pink-500 to-orange-400 px-3 py-1.5 font-medium text-white shadow-md transition hover:opacity-90">
                Start Editing
              </button>
            </Link>
          </Unauthenticated>

          <Authenticated>
            <UserButton afterSignOutUrl="/" />
          </Authenticated>
        </div>
        {isLoading && (
          <div className="fixed bottom-0 left-0 z-40 flex w-full justify-center">
            <BarLoader width={500} color="#06b6d4" />
          </div>
        )}
      </div>
    </header>
  );
};
