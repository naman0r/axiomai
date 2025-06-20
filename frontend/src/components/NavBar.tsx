"use client";

import React, { useState } from "react";
import { Menu, MenuItem } from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

function NavBar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const { user, isSignedIn } = useUser();

  // const displayError = loginError || authError;

  return (
    <div
      className={cn(
        "fixed top-10 inset-x-0 z-50 flex justify-center",
        className
      )}
    >
      <div className="relative mx-auto max-w-2xl overflow-hidden rounded-full font-mono">
        <div className="absolute inset-0 bg-[url('/nav-background.jpg')] bg-top bg-cover" />
        <Menu
          setActive={setActive}
          className={cn(
            "relative z-10 flex items-center justify-center space-x-8",
            "bg-white/50 dark:bg-black/50 backdrop-blur-md",
            "border border-gray-200 dark:border-gray-700",
            "px-20 py-4"
          )}
        >
          <Link href="/">
            <MenuItem setActive={setActive} active={active} item="Home" />
          </Link>
          {isSignedIn ? (
            <>
              <Link href="/hello">
                <MenuItem
                  setActive={setActive}
                  active={active}
                  item="Dashboard"
                />
              </Link>

              <Link href="/profile">
                <Image
                  width={42}
                  height={42}
                  src={user?.imageUrl}
                  alt="User Profile"
                  className="rounded-full border-2 border-violet-900 hover:border-violet-950"
                />
              </Link>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <MenuItem
                  setActive={setActive}
                  active={active}
                  item="Sign In"
                />
              </Link>
              <Link href="/sign-up">
                <MenuItem
                  setActive={setActive}
                  active={active}
                  item="Sign Up"
                />
              </Link>
            </>
          )}
          {/* <Link href="/about">
            <MenuItem setActive={setActive} active={active} item="About" />
          </Link>
          <Link href="/dashboard">
            <MenuItem setActive={setActive} active={active} item="Dashboard" />
          </Link>
          <Link href="/profile">
            <MenuItem setActive={setActive} active={active} item="Profile" />
          </Link> */}
        </Menu>
      </div>
    </div>
  );
}

export default NavBar;
