"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaLock } from "react-icons/fa";
import { useAuth } from "./context/AuthContext";
import Image from "next/image";

const Login_ = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getInitials = (name) => {
    return name ? name.split(" ").map(n => n[0]).join("").toUpperCase() : "U";
  };

  const handleLanguageChange = () => {
    if (typeof window !== 'undefined') {
      const lang = 'ar'; // Or get this dynamically
      const subdomain = `${lang}.clinstitute.co.uk`;
      const currentHost = window.location.hostname;

      // Handle cases where there might not be a current host (e.g., local dev)
      if (currentHost) {
        const newHost = subdomain;
        const newUrl = window.location.href.replace(currentHost, newHost);
        window.location.href = newUrl;  // Or use router.push(newUrl) if you want to stay within Next.js
      } else {
        // For local development or cases where hostname isn't available
        const newUrl = `http://${subdomain}${window.location.pathname}${window.location.search}`; // Reconstruct URL
        window.location.href = newUrl; // Or router.push(newUrl)
      }

    }
  };

  return (
    <div className="relative flex items-center space-x-4">
      <button onClick={handleLanguageChange} className="flex items-center gap-2 border-[1px] text-xs rounded-md border-slate-50/70 p-1">
        <Image src={'/ar.webp'} height={20} width={20} alt="Arab Flag" />
        العربية
      </button>

      {isAuthenticated && user ? (
        <div className="relative">
          <button
            className="w-10 h-10 flex items-center justify-center bg-secondary text-sm text-white font-bold rounded-full focus:outline-none"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {getInitials(user.name)}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
              <div className="p-3 border-b text-gray-700">{user.name}</div>
              <Link
                href="/account"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Profile
              </Link>
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 bg-primary text-white"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <Link href="/sign-in" className="flex items-center text-white hover:text-secondary">
            <FaLock className="mr-1" color="white" /> Login
          </Link>
          <Link href="/sign-up" className="px-4 py-2 text-white rounded bg-secondary hover:bg-secondary-dark">
            Sign up
          </Link>
        </>
      )}
    </div>
  );
};

export default Login_;