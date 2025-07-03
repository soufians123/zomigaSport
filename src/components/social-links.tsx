"use client";

import { useState, useEffect } from "react";
import * as React from 'react';
import { Facebook, Send } from "lucide-react";
import Link from "next/link";
import { getSocialLinks } from "@/lib/social-links-service";
import type { SocialLink } from "@/types";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";


// Custom WhatsApp Icon Component
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
);

const iconMap: Record<SocialLink['name'], React.ReactElement> = {
    WhatsApp: <WhatsAppIcon />,
    Facebook: <Facebook />,
    Telegram: <Send />,
};

const socialStyles: Record<SocialLink['name'], string> = {
    WhatsApp: "text-green-500",
    Facebook: "text-blue-600",
    Telegram: "text-sky-500",
};


export function SocialLinks() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const loadData = () => {
        setLinks(getSocialLinks());
    }
    
    loadData();
    setIsMounted(true);

    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'zomigasports_socialLinks') {
            loadData();
        }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('social-links-changed', loadData);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('social-links-changed', loadData);
    }
  }, []);

  if (!isMounted) {
    return (
        <div className="flex justify-center items-center gap-6 my-6">
            {[...Array(3)].map((_, i) => (
                 <Skeleton key={i} className="h-20 w-20 rounded-2xl" />
            ))}
        </div>
    );
  }
  
  if (links.length === 0) {
    return null;
  }

  return (
    <div className="flex justify-center items-center gap-6 my-6">
      {links.map((link) => {
        const iconData = iconMap[link.name];
        if (!iconData) return null;

        return (
          <Link
            key={link.id}
            href={link.url}
            aria-label={link.name}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center justify-center p-5 bg-card rounded-2xl shadow-xl border-2 border-transparent hover:border-primary hover:-translate-y-1 transition-all duration-300"
            )}
          >
            {React.cloneElement(iconData, {
              className: cn("h-10 w-10 transition-colors", socialStyles[link.name])
            })}
          </Link>
        );
      })}
    </div>
  );
}
