"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Server,
  ShoppingCart,
  LifeBuoy,
  Package,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Shield,
  Bell,
  Search,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, AuthProvider } from "@/hooks/use-auth";
import { routes } from "@/lib/routes";

// Admin Navigation items
const adminNav = [
  { name: "Dashboard", href: routes.admin.home, icon: LayoutDashboard },
  { name: "Users", href: routes.admin.users.list, icon: Users },
  { name: "Servers", href: routes.admin.servers.list, icon: Server },
  { name: "Orders", href: routes.admin.orders.list, icon: ShoppingCart },
  { name: "Tickets", href: routes.admin.tickets.list, icon: LifeBuoy },
  { name: "Plans", href: routes.admin.plans.list, icon: Package },
  { name: "Settings", href: routes.admin.settings, icon: Settings },
];

// Admin Logo Component
function AdminLogo() {
  return (
    <Link href={routes.admin.home} className="flex items-center gap-2.5">
      <div className="relative">
        <svg width={28} height={28} viewBox="0 0 36 36" fill="none">
          <path d="M4 24L18 32L32 24" stroke="#ff5533" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
          <path d="M4 18L18 26L32 18" stroke="#ff5533" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
          <path d="M4 12L18 20L32 12L18 4L4 12Z" fill="#ff5533" stroke="#ff5533" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-dark rounded-full flex items-center justify-center">
          <Shield className="w-2 h-2 text-primary" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-google-sans font-semibold text-[14px] text-white tracking-tight leading-none">
          Layerium
        </span>
        <span className="font-outfit text-[9px] text-white/40 uppercase tracking-wider">
          Admin Panel
        </span>
      </div>
    </Link>
  );
}

// Admin Sidebar Component
function AdminSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, signOut } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === href;
    return pathname.startsWith(href);
  };

  const userInitial = profile?.full_name?.charAt(0) || profile?.email?.charAt(0)?.toUpperCase() || "A";
  const userName = profile?.full_name || profile?.email?.split("@")[0] || "Admin";

  // Check if user is admin
  React.useEffect(() => {
    if (profile && profile.role !== "ADMIN") {
      router.push(routes.dashboard.home);
    }
  }, [profile, router]);

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
          {/* Logo Header */}
          <div className="p-4 pb-3 flex items-center justify-between">
            <AdminLogo />
            <button onClick={onClose} className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-4 h-4 text-white/60" />
            </button>
          </div>

          {/* Back to User Dashboard */}
          <div className="px-4 pb-4">
            <Link
              href={routes.dashboard.home}
              className="flex items-center justify-center gap-2 h-10 bg-white/[0.06] hover:bg-white/[0.1] text-white/70 hover:text-white font-dm-sans text-[12px] font-medium rounded-xl transition-all"
            >
              <Home className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/[0.08] mx-4" />

          {/* Main Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="mb-2 px-2">
              <span className="font-outfit text-[10px] font-semibold text-white/25 uppercase tracking-widest">Admin Menu</span>
            </div>

            <div className="space-y-1">
              {adminNav.map((item) => {
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
                        layoutId="adminActiveIndicator"
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
                  <div className="flex items-center gap-2">
                    <p className="font-dm-sans text-[13px] font-medium text-white truncate">{userName}</p>
                    <span className="px-1.5 py-0.5 bg-primary/20 rounded text-[9px] font-dm-sans font-bold text-primary uppercase">Admin</span>
                  </div>
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

// Admin Header
function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <div className="sticky top-0 z-30 bg-background border-b border-border px-4 lg:px-8 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 -ml-2 hover:bg-surface-2 rounded-xl transition-colors">
          <Menu className="w-5 h-5 text-dark-muted" />
        </button>
        
        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-surface-1 rounded-xl border border-border w-80">
          <Search className="w-4 h-4 text-dark-muted" />
          <input
            type="text"
            placeholder="Search users, servers, orders..."
            className="flex-1 bg-transparent font-outfit text-sm text-dark placeholder:text-dark-muted/50 focus:outline-none"
          />
          <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 bg-surface-2 rounded text-[10px] font-mono text-dark-muted">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2.5 hover:bg-surface-2 rounded-xl transition-colors">
          <Bell className="w-5 h-5 text-dark-muted" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
        </button>
      </div>
    </div>
  );
}

// Admin Content Wrapper
function AdminContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { profile, isLoading } = useAuth();
  const router = useRouter();

  // Redirect non-admin users
  React.useEffect(() => {
    if (!isLoading && profile && profile.role !== "ADMIN") {
      router.push(routes.dashboard.home);
    }
  }, [profile, isLoading, router]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-border border-t-primary rounded-full animate-spin" />
          <p className="font-outfit text-[13px] text-dark-muted">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Don't render if not admin
  if (profile && profile.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

// Main Admin Layout
export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
      <AdminContent>{children}</AdminContent>
    </AuthProvider>
  );
}
