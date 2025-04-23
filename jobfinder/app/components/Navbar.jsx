"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navLinkClass = (href) =>
    `px-3 py-2 ${pathname === href ? "text-primary" : "text-gray-700"} hover:text-primary`;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-primary font-bold text-2xl">
              JobFinder
            </Link>
          </div>

          <div className="flex md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link href="/" className={navLinkClass("/")}>Home</Link>
            <Link href="/jobs" className={navLinkClass("/jobs")}>Find Jobs</Link>

            {user?.isEmployer && (
              <Link href="/post-job" className={navLinkClass("/post-job")}>Post a Job</Link>
            )}

            {!user ? (
              <>
                <Link href="/login" className={navLinkClass("/login")}>Login</Link>
                <Link href="/register" className={navLinkClass("/register")}>Register</Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="ml-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="ml-2 px-3 py-2 text-gray-700 hover:text-red-600">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <Link href="/" className={navLinkClass("/")}>Home</Link>
          <Link href="/jobs" className={navLinkClass("/jobs")}>Find Jobs</Link>

          {user?.isEmployer && (
            <Link href="/post-job" className={navLinkClass("/post-job")}>Post a Job</Link>
          )}

          {!user ? (
            <>
              <Link href="/login" className={navLinkClass("/login")}>Login</Link>
              <Link href="/register" className={navLinkClass("/register")}>Register</Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className={navLinkClass("/dashboard")}>Dashboard</Link>
              <button onClick={handleLogout} className="block text-left w-full text-gray-700 hover:text-red-600">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
