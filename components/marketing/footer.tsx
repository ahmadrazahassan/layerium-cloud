"use client";

import Link from "next/link";
import { GreenTrialButton } from "@/components/ui/flip-button";
import { routes } from "@/lib/routes";

// Same logo from header
function LayeriumLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
      <path d="M4 24L18 32L32 24" stroke="#ff5533" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
      <path d="M4 18L18 26L32 18" stroke="#ff5533" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
      <path d="M4 12L18 20L32 12L18 4L4 12Z" fill="#ff5533" stroke="#ff5533" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Social icons
const socials = [
  {
    name: "X",
    href: "https://twitter.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    name: "GitHub",
    href: "https://github.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
      </svg>
    ),
  },
  {
    name: "Discord",
    href: "https://discord.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
];

const navigation = [
  {
    title: "Product",
    links: [
      { label: "VPS Servers", href: "/vps" },
      { label: "RDP Servers", href: "/rdp" },
      { label: "Pricing", href: "/pricing" },
      { label: "DDoS Protection", href: "/ddos-protection" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "API Reference", href: "/api-docs" },
      { label: "System Status", href: "/status" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "SLA", href: "/sla" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative">
      {/* Background overlay for rounded corners */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-background" />
      
      {/* Main footer */}
      <div className="relative bg-dark rounded-t-[48px] lg:rounded-t-[64px]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          
          {/* CTA Section */}
          <div className="pt-20 lg:pt-24 pb-16 lg:pb-20 border-b border-white/[0.08]">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
              <div>
                <h2 className="font-google-sans font-bold text-[2.75rem] sm:text-5xl lg:text-[3.5rem] text-white leading-[1.05] tracking-tight">
                  Ready to deploy?
                </h2>
                <p className="font-outfit text-lg text-white/40 mt-4 max-w-md">
                  Get started in under 60 seconds. No credit card required.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <GreenTrialButton href={`${routes.auth.login}?mode=signup`} size="lg" />
                <Link
                  href={routes.contact}
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 text-white font-dm-sans font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="py-16 lg:py-20">
            <div className="flex flex-col lg:flex-row lg:justify-between gap-12">
              
              {/* Left - Brand */}
              <div className="lg:max-w-xs">
                <Link href="/" className="inline-flex items-center gap-3 mb-5">
                  <LayeriumLogo />
                  <span className="font-google-sans font-semibold text-[22px] text-white tracking-tight">
                    Layerium
                  </span>
                </Link>
                <p className="font-outfit text-[15px] text-white/40 leading-relaxed">
                  Enterprise cloud infrastructure built for performance, security, and scale.
                </p>
              </div>

              {/* Right - Navigation as horizontal pills */}
              <div className="flex-1 lg:max-w-2xl">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {navigation.map((section) => (
                    <div key={section.title}>
                      <span className="inline-block px-3 py-1.5 bg-white/[0.06] rounded-full font-dm-sans text-xs font-semibold text-white/70 mb-5">
                        {section.title}
                      </span>
                      <ul className="space-y-3">
                        {section.links.map((link) => (
                          <li key={link.label}>
                            <Link 
                              href={link.href} 
                              className="group flex items-center gap-2 font-outfit text-[15px] text-white/40 hover:text-white transition-colors duration-200"
                            >
                              <span className="w-1 h-1 bg-white/20 rounded-full group-hover:bg-primary transition-colors" />
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar with Socials */}
          <div className="py-6 border-t border-white/[0.08]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Left - Copyright & Status */}
              <div className="flex items-center gap-4">
                <span className="font-outfit text-sm text-white/30">
                  © {new Date().getFullYear()} Layerium
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.05] rounded-full">
                  <span className="w-1.5 h-1.5 bg-success rounded-full" />
                  <span className="font-outfit text-xs text-white/50">All systems operational</span>
                </span>
              </div>
              
              {/* Right - Social Links */}
              <div className="flex items-center gap-2">
                {socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/[0.05] hover:bg-white/[0.1] rounded-full text-white/50 hover:text-white transition-all duration-300"
                  >
                    {social.icon}
                    <span className="font-dm-sans text-sm font-medium">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
