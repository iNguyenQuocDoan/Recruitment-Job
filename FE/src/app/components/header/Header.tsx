"use client";

import Link from "next/link";
import { FaBars, FaXmark, FaBriefcase } from "react-icons/fa6";
import { HeaderMenu } from "./HeaderMenu";
import { useState } from "react";
import { HeaderAccount } from "./HeaderAccount";

export const Header = () => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-primary-800/95 backdrop-blur-md border-b border-primary-900">
        <div className="container-page">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white font-extrabold sm:text-heading-md text-heading-sm"
            >
              <span className="inline-flex items-center justify-center w-9 h-9 rounded bg-accent-500">
                <FaBriefcase className="text-white text-lg" />
              </span>
              ITJobs
            </Link>

            <HeaderMenu showMenu={showMenu} onClose={() => setShowMenu(false)} />

            <div className="flex items-center gap-3">
              <HeaderAccount />
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="lg:hidden text-white text-xl p-2 rounded hover:bg-primary-900 transition-colors"
                aria-label="Toggle menu"
              >
                {showMenu ? <FaXmark /> : <FaBars />}
              </button>
            </div>
          </div>
        </div>
      </header>
      {showMenu && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 animate-fade-in"
          onClick={() => setShowMenu(false)}
        />
      )}
    </>
  );
};
