"use client";
import "../globals.css";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";

import {
  IconLayoutDashboard, // Dashboard
  IconClipboardList, // Assignments (example)
  IconCalendarEvent, // Calendar
  IconSettings, // Settings
  IconBrandBitbucket,
  IconBubbleText,
  IconGhost2,
  IconUserCircle,
  IconLogout,
} from "@tabler/icons-react";

// Font imports removed - not used in this layout

// Reusable Logo component (consider moving to a shared components folder later)
const Logo = () => {
  return (
    <Link
      href="/" // Link logo to dashboard or appropriate home for logged-in users
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black dark:text-white"
    >
      <Image
        src="/logo.png"
        alt="AxiomAI Logo"
        width={50}
        height={50}
        className="h-10 w-10 rounded-lg"
      />

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      ></motion.span>
    </Link>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [open, setOpen] = useState(false); // State for sidebar open/closed
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconLayoutDashboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Chat",
      href: "/chat",
      icon: (
        <IconBubbleText className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Genies",
      href: "/genies",
      icon: (
        <IconGhost2 className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "All Resources",
      href: "/resources",
      icon: (
        <IconBrandBitbucket className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Assignments",
      href: "/assignments",
      icon: (
        <IconClipboardList className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Calendar",
      href: "/calendar",
      icon: (
        <IconCalendarEvent className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      href: "/settings",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  // Define links/actions for the bottom of the sidebar
  const bottomLinks = [
    {
      label: "Profile",
      href: "/profile", // Profile page is outside (user) group
      icon: (
        <IconUserCircle className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  return (
    <div
      className={cn(
        "flex h-screen w-full flex-1 overflow-hidden bg-white dark:bg-neutral-900" // Adjusted background
      )}
    >
      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        {/* Enable animation */}
        <SidebarBody className="justify-between gap-10">
          {/* Top Section: Logo & Links */}
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <div className="px-3 py-2">
              <Logo />
            </div>
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>

          {/* Bottom Section: Profile & Logout */}
          <div className="flex flex-col gap-2 border-t border-neutral-700">
            {bottomLinks.map((link, idx) => (
              <SidebarLink key={`bottom-${idx}`} link={link} />
            ))}
            {/* Logout Button */}
            <button
              onClick={() => console.log("logout")}
              className="flex items-center justify-start gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <IconLogout className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            </button>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        <div className="">{children}</div>
      </main>
    </div>
  );
}
