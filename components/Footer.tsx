"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface FooterLink {
  label: string;
  url: string;
}

const REFETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export default function Footer() {
  const [links, setLinks] = useState<FooterLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const callbackUrl = encodeURIComponent(window.location.href);
        const res = await fetch(`/api/footer-links?callback=${callbackUrl}`);
        const data = await res.json();
        setLinks(data.links || []);
      } catch (error) {
        console.error("Failed to fetch footer links:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
    const interval = setInterval(fetchLinks, REFETCH_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  if (loading || !links.length) return null;

  return (
    <footer className="border-t border-border bg-muted/30 py-4 px-4">
      <div className="container max-w-lg mx-auto">
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          {links.map((link, idx) => (
            <div key={link.label} className="flex items-center gap-4">
              <Link
                href={link.url}
                className="hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
              {idx < links.length - 1 && (
                <span className="text-border">·</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
