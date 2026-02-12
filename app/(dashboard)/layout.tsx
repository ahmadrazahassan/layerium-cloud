"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Server,
  CreditCard,
  LifeBuoy,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  ExternalLink,
  Plus,
  BookOpen,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, AuthProvider } from "@/hooks/use-auth";
import { routes } from "@/lib/routes";

// Navigation items
const mainNav = [
  { name: "Overview", href: routes.dashboard.home, icon: LayoutDashboard },
  { name: "Servers", href: routes.dashboard.servers.list, icon: Server },
  { name: "Billing", href: routes.dashboard.billing.index, icon: CreditCard },
];

const secondaryNav = [
  { name: "Support", href: routes.dashboard.support.index, icon: LifeBuoy },
  { name: "Settings", href: routes.dashboard.settings.index, icon: Settings },
];

// Empty notifications - will be fetched from database when notification system is implemented
const notifications: Array<{ id: number; title: string; message: string; time: string; unread: boolean; type: string }> = [];

// Logo Component
function SidebarLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <svg width={28} height={28} viewBox="0 0 36 36" fill="none">
        <path d="M4 24L18 32L32 24" stroke="#ff5533" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
        <path d="M4 18L18 26L32 18" stroke="#ff5533" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
        <path d="M4 12L18 20L32 12L18 4L4 12Z" fill="#ff5533" stroke="#ff5533" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="font-google-sans font-semibold text-[15px] text-white tracking-tight">
        Layerium
      </span>
    </Link>
  );
}

// Notification Panel - Minimal, appears next to sidebar
function NotificationPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - subtle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
          />
          
          {/* Panel - positioned next to sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="fixed left-[276px] top-3 bottom-3 w-[320px] bg-surface-1 rounded-[24px] shadow-elevated border border-border z-50 flex flex-col overflow-hidden"
          >
            {/* Header - Minimal */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <span className="font-google-sans font-semibold text-[15px] text-dark">Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-primary/10 rounded-full text-[10px] font-dm-sans font-bold text-primary">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-surface-2 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-dark-muted" />
              </button>
            </div>

            {/* Notifications - Minimal cards */}
            <div className="flex-1 overflow-y-auto p-3">
              <div className="space-y-2">
                {notifications.map((notif, index) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className={cn(
                      "p-3.5 rounded-2xl transition-all cursor-pointer group",
                      notif.unread 
                        ? "bg-primary/[0.04] hover:bg-primary/[0.06]" 
                        : "hover:bg-surface-2/60"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0",
                        notif.type === "success" && "bg-emerald-500/10",
                        notif.type === "payment" && "bg-blue-500/10",
                        notif.type === "info" && "bg-amber-500/10",
                        notif.type === "security" && "bg-purple-500/10"
                      )}>
                        {notif.type === "success" && <Check className="w-4 h-4 text-emerald-500" />}
                        {notif.type === "payment" && <CreditCard className="w-4 h-4 text-blue-500" />}
                        {notif.type === "info" && <Bell className="w-4 h-4 text-amber-500" />}
                        {notif.type === "security" && <Settings className="w-4 h-4 text-purple-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-dm-sans text-[12px] font-semibold text-dark truncate">{notif.title}</p>
                          {notif.unread && (
                            <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="font-outfit text-[11px] text-dark-muted mt-0.5 line-clamp-2">{notif.message}</p>
                        <p className="font-outfit text-[10px] text-dark-muted/50 mt-1.5">{notif.time}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer - Minimal */}
            {unreadCount > 0 && (
              <div className="px-4 py-3 border-t border-border">
                <button className="w-full text-center font-dm-sans text-[11px] font-semibold text-primary hover:text-primary-hover transition-colors">
                  Mark all as read
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Sidebar Component
function Sidebar({ isOpen, onClose, onNotifOpen }: { isOpen: boolean; onClose: () => void; onNotifOpen: () => void }) {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  const userInitial = profile?.full_name?.charAt(0) || profile?.email?.charAt(0)?.toUpperCase() || "U";
  const userName = profile?.full_name || profile?.email?.split("@")[0] || "User";
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[260px] flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:m-3 lg:h-[calc(100vh-24px)]",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col bg-dark lg:rounded-[24px] lg:shadow-elevated">
          {/* Logo Header with Notification */}
          <div className="p-4 pb-3 flex items-center justify-between">
            <SidebarLogo />
            
            {/* Notification Bell */}
            <button
              onClick={onNotifOpen}
              className="relative p-2.5 hover:bg-white/[0.06] rounded-xl transition-colors"
            >
              <Bell className="w-5 h-5 text-white/50 hover:text-white/80 transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-dark" />
              )}
            </button>
          </div>

          {/* Mobile close */}
          <button onClick={onClose} className="lg:hidden absolute top-3 right-14 p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-4 h-4 text-white/60" />
          </button>

          {/* Deploy CTA */}
          <div className="px-4 pb-4">
            <Link
              href={routes.dashboard.deploy.index}
              onClick={onClose}
              className="group flex items-center justify-center gap-2.5 h-11 bg-primary hover:bg-primary-hover text-white font-dm-sans text-[13px] font-semibold rounded-full transition-all duration-200 shadow-[0_4px_12px_rgba(255,85,51,0.3)] hover:shadow-[0_6px_20px_rgba(255,85,51,0.4)] hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
              Deploy Server
            </Link>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/[0.08] mx-4" />

          {/* Main Navigation */}
          <nav className="flex-1 p-4">
            {/* Menu Section */}
            <div className="mb-2 px-2">
              <span className="font-outfit text-[10px] font-semibold text-white/25 uppercase tracking-widest">Menu</span>
            </div>

            <div className="space-y-1">
              {mainNav.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "group relative flex items-center gap-3 h-11 px-3 rounded-xl font-dm-sans text-[13px] transition-all duration-150",
                      active
                        ? "bg-white/[0.08] text-white font-medium"
                        : "text-white/50 hover:text-white/90 hover:bg-white/[0.04]"
                    )}
                  >
                    {active && (
                      <motion.div
                        layoutId="sidebarActiveIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    <item.icon className={cn("w-[18px] h-[18px]", active ? "text-primary" : "text-white/35 group-hover:text-white/50")} />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Help Section */}
            <div className="mt-8 mb-2 px-2">
              <span className="font-outfit text-[10px] font-semibold text-white/25 uppercase tracking-widest">Help</span>
            </div>

            <div className="space-y-1">
              {secondaryNav.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "group relative flex items-center gap-3 h-11 px-3 rounded-xl font-dm-sans text-[13px] transition-all duration-150",
                      active
                        ? "bg-white/[0.08] text-white font-medium"
                        : "text-white/50 hover:text-white/90 hover:bg-white/[0.04]"
                    )}
                  >
                    {active && (
                      <motion.div
                        layoutId="sidebarActiveIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    <item.icon className={cn("w-[18px] h-[18px]", active ? "text-primary" : "text-white/35 group-hover:text-white/50")} />
                    {item.name}
                  </Link>
                );
              })}

              {/* Docs link */}
              <a
                href="https://docs.layerium.cloud"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 h-11 px-3 rounded-xl font-dm-sans text-[13px] text-white/50 hover:text-white/90 hover:bg-white/[0.04] transition-all duration-150"
              >
                <BookOpen className="w-[18px] h-[18px] text-white/35 group-hover:text-white/50" />
                Docs
                <ExternalLink className="w-3 h-3 ml-auto text-white/20" />
              </a>
            </div>
          </nav>

          {/* User Profile at Bottom */}
          <div className="p-4 border-t border-white/[0.06]">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-dm-sans text-[14px] font-bold text-white">
                  {userInitial}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-dm-sans text-[13px] font-medium text-white truncate">{userName}</p>
                  <p className="font-outfit text-[11px] text-white/40 truncate">{profile?.email}</p>
                </div>
                <ChevronDown className={cn("w-4 h-4 text-white/40 transition-transform duration-200", userMenuOpen && "rotate-180")} />
              </button>

              {/* User dropdown */}
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full left-0 right-0 mb-2 bg-[#2a2b33] rounded-xl border border-white/10 shadow-elevated overflow-hidden"
                  >
                    <div className="p-1.5">
                      <Link
                        href={routes.dashboard.settings.index}
                        onClick={() => { setUserMenuOpen(false); onClose(); }}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-outfit text-[12px] text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
                      >
                        <Settings className="w-4 h-4" /> Account settings
                      </Link>
                      <a
                        href="https://docs.layerium.cloud"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-outfit text-[12px] text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" /> Documentation
                      </a>
                    </div>
                    <div className="border-t border-white/[0.08] p-1.5">
                      <button
                        onClick={() => signOut()}
                        className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg font-outfit text-[12px] text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// Mobile Header
function MobileHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <div className="lg:hidden sticky top-0 z-30 bg-background px-4 py-3 flex items-center gap-3">
      <button onClick={onMenuClick} className="p-2 -ml-2 hover:bg-surface-2 rounded-xl transition-colors">
        <Menu className="w-5 h-5 text-dark-muted" />
      </button>
      <Link href="/" className="flex items-center gap-2">
        <svg width={24} height={24} viewBox="0 0 36 36" fill="none">
          <path d="M4 24L18 32L32 24" stroke="#ff5533" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
          <path d="M4 18L18 26L32 18" stroke="#ff5533" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
          <path d="M4 12L18 20L32 12L18 4L4 12Z" fill="#ff5533" stroke="#ff5533" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="font-google-sans font-semibold text-[14px] text-dark">Layerium</span>
      </Link>
    </div>
  );
}

// Dashboard Content
function DashboardContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onNotifOpen={() => setNotifOpen(true)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>
      <NotificationPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
    </div>
  );
}

// Main Layout
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-border border-t-primary rounded-full animate-spin" />
          <p className="font-outfit text-[13px] text-dark-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <DashboardContent>{children}</DashboardContent>
    </AuthProvider>
  );
}
