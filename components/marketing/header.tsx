"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight, LayoutDashboard, LogOut, User, ChevronDown } from "lucide-react";
import { LayeriumLogo } from "@/components/ui/logo";
import { GreenTrialButton } from "@/components/ui/flip-button";
import { routes } from "@/lib/routes";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const navLinks = [
  { href: routes.vps, label: "VPS Servers" },
  { href: routes.rdp, label: "RDP Servers" },
  { href: routes.pricing, label: "Pricing" },
  { href: routes.contact, label: "Contact" },
];

// Flip text animation component
function FlipText({ children, className }: { children: string; className?: string }) {
  return (
    <span className={`relative inline-flex overflow-hidden ${className}`}>
      <span className="group-hover:-translate-y-full transition-transform duration-300 ease-[0.16,1,0.3,1]">
        {children}
      </span>
      <span className="absolute left-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[0.16,1,0.3,1]">
        {children}
      </span>
    </span>
  );
}

export function Header() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [hoverStyle, setHoverStyle] = React.useState({ left: 0, width: 0, opacity: 0 });
  const [user, setUser] = React.useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const navRef = React.useRef<HTMLDivElement>(null);
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  // Check auth state - optimized for instant UI
  React.useEffect(() => {
    const supabase = createClient();
    
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setIsLoading(false);
        supabase.auth.getUser().then(({ data: { user: verifiedUser } }) => {
          if (!verifiedUser) setUser(null);
        });
      } else {
        setUser(null);
        setIsLoading(false);
      }
    };
    
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
      if (event === "SIGNED_OUT") {
        setUserMenuOpen(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUserMenuOpen(false);
    router.push(routes.home);
    router.refresh();
  };

  const handleNavHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.currentTarget;
    const navRect = navRef.current?.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    
    if (navRect) {
      setHoverStyle({
        left: targetRect.left - navRect.left,
        width: targetRect.width,
        opacity: 1,
      });
    }
  };

  const handleNavLeave = () => {
    setHoverStyle(prev => ({ ...prev, opacity: 0 }));
  };

  const userInitial = user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || "U";
  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
      >
        {/* Announcement Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isScrolled ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          className="hidden lg:flex justify-center py-2 pointer-events-auto"
        >
          <Link
            href="#pricing"
            className="group inline-flex items-center gap-2 px-3 py-1 bg-dark/5 hover:bg-dark/8 rounded-full transition-colors"
          >
            <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="font-dm-sans text-[11px] font-medium text-dark/60">
              New: Deploy to 6 global regions
            </span>
            <ChevronRight className="w-3 h-3 text-dark/40 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        {/* Main Navigation */}
        <div className="flex justify-center px-4 pt-2 lg:pt-3">
          <motion.nav
            animate={{
              backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0.6)",
              backdropFilter: isScrolled ? "blur(20px)" : "blur(12px)",
              boxShadow: isScrolled 
                ? "0 1px 3px rgba(30, 31, 38, 0.04), 0 4px 12px rgba(30, 31, 38, 0.03), inset 0 0 0 1px rgba(30, 31, 38, 0.06)"
                : "0 0 0 1px rgba(30, 31, 38, 0.04), inset 0 0 0 1px rgba(255, 255, 255, 0.5)",
            }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-1 h-12 px-2 rounded-full pointer-events-auto"
          >
            {/* Logo - No magnetic effect */}
            <Link href="/" className="flex items-center gap-2 pl-2 pr-3 hover:opacity-80 transition-opacity">
              <LayeriumLogo size={28} />
              <span className="font-google-sans font-semibold text-[15px] text-dark tracking-tight hidden sm:block">
                Layerium
              </span>
            </Link>

            {/* Divider */}
            <div className="hidden lg:block w-px h-5 bg-dark/8 mx-1" />

            {/* Desktop Navigation */}
            <div 
              ref={navRef}
              className="hidden lg:flex items-center relative"
              onMouseLeave={handleNavLeave}
            >
              {/* Hover Background */}
              <motion.div
                className="absolute h-8 bg-dark/[0.04] rounded-full"
                animate={{
                  left: hoverStyle.left,
                  width: hoverStyle.width,
                  opacity: hoverStyle.opacity,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
              
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={(e) => handleNavHover(e)}
                  className="relative px-4 py-2 font-dm-sans text-[13px] font-medium text-dark/60 hover:text-dark transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px h-5 bg-dark/8 mx-1" />

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-1">
              {user ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-2"
                >
                  <Link
                    href={routes.dashboard.home}
                    className="group flex items-center gap-2 px-4 py-2 bg-dark text-white font-dm-sans text-[13px] font-semibold rounded-full hover:bg-primary transition-colors duration-300"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <FlipText>Dashboard</FlipText>
                  </Link>
                  
                  {/* User Menu */}
                  <div ref={userMenuRef} className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 px-2 py-1.5 hover:bg-dark/5 rounded-full transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-dm-sans text-xs font-bold text-white">
                        {userInitial}
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-dark/50 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
                    </button>
                    
                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-border shadow-elevated overflow-hidden z-50"
                        >
                          <div className="px-4 py-3 border-b border-border">
                            <p className="font-dm-sans text-sm font-semibold text-dark truncate">{userName}</p>
                            <p className="font-outfit text-xs text-dark-muted truncate">{user.email}</p>
                          </div>
                          
                          <div className="p-1.5">
                            <Link
                              href={routes.dashboard.home}
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-outfit text-sm text-dark hover:bg-surface-2 transition-colors"
                            >
                              <LayoutDashboard className="w-4 h-4 text-dark-muted" />
                              Dashboard
                            </Link>
                            <Link
                              href={routes.dashboard.settings.index}
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-outfit text-sm text-dark hover:bg-surface-2 transition-colors"
                            >
                              <User className="w-4 h-4 text-dark-muted" />
                              Account Settings
                            </Link>
                          </div>
                          
                          <div className="p-1.5 border-t border-border">
                            <button
                              onClick={handleSignOut}
                              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl font-outfit text-sm text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              Sign out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ) : !isLoading ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1"
                >
                  <Link
                    href={routes.auth.login}
                    className="group px-4 py-2 font-dm-sans text-[13px] font-medium text-dark/60 hover:text-dark transition-colors overflow-hidden"
                  >
                    <FlipText>Sign in</FlipText>
                  </Link>
                  
                  <GreenTrialButton
                    href={`${routes.auth.login}?mode=signup`}
                    size="sm"
                  >
                    Sign up
                  </GreenTrialButton>
                </motion.div>
              ) : null}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-dark/5 text-dark transition-colors ml-1"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-[18px] h-[18px]" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-[18px] h-[18px]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-dark/10 backdrop-blur-sm z-40 lg:hidden"
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-20 left-4 right-4 z-50 lg:hidden"
            >
              <div className="bg-surface-1 rounded-2xl border border-border/50 shadow-elevated overflow-hidden">
                <div className="p-2">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-3.5 font-dm-sans text-[15px] font-medium text-dark hover:bg-surface-2 rounded-xl transition-colors"
                      >
                        {link.label}
                        <ChevronRight className="w-4 h-4 text-dark/30" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
                
                <div className="p-3 pt-0 flex flex-col gap-2">
                  <div className="h-px bg-border/50 mb-2" />
                  {user ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15 }}
                      className="flex flex-col gap-2"
                    >
                      <div className="flex items-center gap-3 px-4 py-3 bg-surface-2/50 rounded-xl mb-1">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-dm-sans text-sm font-bold text-white">
                          {userInitial}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-dm-sans text-[14px] font-semibold text-dark truncate">{userName}</p>
                          <p className="font-outfit text-[12px] text-dark-muted truncate">{user.email}</p>
                        </div>
                      </div>
                      
                      <Link
                        href={routes.dashboard.home}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 w-full font-dm-sans text-[15px] font-semibold text-white bg-dark py-3.5 rounded-full hover:bg-primary transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      
                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center justify-center gap-2 w-full font-dm-sans text-[15px] font-medium text-red-500 py-3 rounded-xl hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </motion.div>
                  ) : !isLoading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15 }}
                      className="flex flex-col gap-2"
                    >
                      <Link
                        href={routes.auth.login}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full text-center font-dm-sans text-[15px] font-medium text-dark py-3 rounded-xl hover:bg-surface-2 transition-colors"
                      >
                        Sign in
                      </Link>
                      <GreenTrialButton
                        href={`${routes.auth.login}?mode=signup`}
                        className="w-full justify-center"
                      >
                        Sign up
                      </GreenTrialButton>
                    </motion.div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
