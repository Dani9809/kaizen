"use client";

import React from "react";
import { Shield, ExternalLink } from "lucide-react";
import { getAppVersion } from "@/lib/version";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-8 border-t border-secondary/10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-secondary/5 border border-secondary/10 flex items-center justify-center">
            <Shield className="w-4 h-4 text-secondary/60" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              Administrative Control Suite
            </p>
            <p className="text-xs font-bold text-muted-foreground/40">
              &copy; {currentYear} KAIZEN. All rights reserved.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Build Version</p>
            <p className="text-xs font-black text-secondary/60">{getAppVersion()}</p>
          </div>
          
          <div className="h-8 w-px bg-secondary/10 hidden sm:block" />

          <a 
            href="#" 
            className="flex items-center gap-2 group transition-all"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 group-hover:text-secondary transition-colors">Documentation</span>
            <ExternalLink className="w-3 h-3 text-muted-foreground/20 group-hover:text-secondary transition-colors" />
          </a>
        </div>
      </div>
    </footer>
  );
};
