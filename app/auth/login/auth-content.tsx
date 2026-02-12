"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Shield, Globe2, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { routes, buildCallbackUrl, getRedirectUrl } from "@/lib/routes";

function LayeriumLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <path d="M4 24L18 32L32 24" stroke="#ff5533" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
      <path d="M4 18L18 26L32 18" stroke="#ff5533" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
      <path d="M4 12L18 20L32 12L18 4L4 12Z" fill="#ff5533" stroke="#ff5533" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

type AuthMode = "login" | "signup";
type AuthState = "idle" | "loading" | "success" | "error";

const features = [
  { icon: Clock, text: "Deploy servers in under 60 seconds" },
  { icon: Globe2, text: "15+ global datacenter locations" },
  { icon: Shield, text: "Enterprise DDoS protection included" },
];

const stats = [
  { value: "99.99%", label: "uptime" },
  { value: "500+", label: "customers" },
  { value: "<5min", label: "response" },
];

function LoadingOverlay({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-dark flex flex-col items-center justify-center"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "0.5s" }} />
      </div>
      <div className="relative z-10 flex flex-col items-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="mb-8">
          <LayeriumLogo size={56} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative mb-8">
          <div className="w-16 h-16 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-transparent border-t-primary animate-spin" />
          <div className="absolute inset-2 w-12 h-12 rounded-full bg-primary/20 animate-pulse" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center">
          <h2 className="font-google-sans font-semibold text-xl text-white mb-2">{message}</h2>
          <p className="font-outfit text-white/50 text-sm">Preparing your dashboard...</p>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex gap-2 mt-8">
          {[0, 1, 2].map((i) => (
            <motion.div key={i} className="w-2 h-2 rounded-full bg-white/30" animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Parse URL parameters
  const modeParam = searchParams.get("mode");
  const errorParam = searchParams.get("error");
  const messageParam = searchParams.get("message");
  
  // Get redirect destination (supports both 'redirect' and 'next' params)
  const redirectTo = getRedirectUrl(searchParams);
  
  const [activeMode, setActiveMode] = React.useState<AuthMode>(modeParam === "signup" ? "signup" : "login");
  const [showPassword, setShowPassword] = React.useState(false);
  const [authState, setAuthState] = React.useState<AuthState>("idle");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(errorParam || null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(messageParam || null);
  const [loadingMessage, setLoadingMessage] = React.useState("Welcome back!");
  
  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    password: "",
    agreeTerms: false,
  });

  const supabase = createClient();

  // Build URL for mode switching while preserving redirect
  const buildModeUrl = (mode: AuthMode) => {
    const params = new URLSearchParams();
    if (mode === "signup") params.set("mode", "signup");
    if (redirectTo !== routes.dashboard.home) params.set("redirect", redirectTo);
    const queryString = params.toString();
    return `${routes.auth.login}${queryString ? `?${queryString}` : ""}`;
  };

  const handleModeChange = (mode: AuthMode) => {
    setActiveMode(mode);
    setErrorMessage(null);
    setSuccessMessage(null);
    router.push(buildModeUrl(mode), { scroll: false });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthState("loading");
    setErrorMessage(null);

    try {
      const callbackUrl = buildCallbackUrl(redirectTo);
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { full_name: formData.fullName, name: formData.fullName },
          emailRedirectTo: callbackUrl,
        },
      });

      if (error) {
        setAuthState("error");
        setErrorMessage(error.message);
        return;
      }

      if (data.user && !data.session) {
        setAuthState("idle");
        setSuccessMessage("Check your email for a confirmation link to complete your registration.");
        return;
      }

      if (data.session) {
        setAuthState("success");
        setLoadingMessage(`Welcome, ${formData.fullName || "there"}!`);
        setTimeout(() => router.push(redirectTo), 2000);
      }
    } catch {
      setAuthState("error");
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthState("loading");
    setErrorMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setAuthState("error");
        setErrorMessage(error.message);
        return;
      }

      if (data.session) {
        setAuthState("success");
        const userName = data.user?.user_metadata?.full_name || data.user?.email?.split("@")[0] || "there";
        setLoadingMessage(`Welcome back, ${userName}!`);
        setTimeout(() => router.push(redirectTo), 2000);
      }
    } catch {
      setAuthState("error");
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setAuthState("loading");
    setErrorMessage(null);

    try {
      const callbackUrl = buildCallbackUrl(redirectTo);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: callbackUrl },
      });

      if (error) {
        setAuthState("error");
        setErrorMessage(error.message);
      }
    } catch {
      setAuthState("error");
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  const handleSubmit = activeMode === "signup" ? handleSignUp : handleSignIn;

  if (authState === "success") {
    return <LoadingOverlay message={loadingMessage} />;
  }

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Left Column - Branding */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden p-12 xl:p-16">
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px]" />

        <div className="relative z-10 flex flex-col justify-between w-full h-full">
          <Link href={routes.home} className="inline-flex items-center gap-3 w-fit">
            <LayeriumLogo size={40} />
            <span className="font-google-sans font-semibold text-2xl text-white tracking-tight">Layerium</span>
          </Link>

          <div className="max-w-md">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="font-google-sans font-bold text-[3.25rem] xl:text-[3.75rem] text-white leading-[1.05] tracking-tight mb-8">
              cloud infrastructure<br /><span className="text-white/30">that just works.</span>
            </motion.h1>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="space-y-4">
              {features.map((feature) => (
                <div key={feature.text} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/[0.06] rounded-2xl flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" strokeWidth={2} />
                  </div>
                  <span className="font-outfit text-[15px] text-white/50">{feature.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="flex items-center gap-6">
              {stats.map((stat, i) => (
                <React.Fragment key={stat.label}>
                  <div>
                    <div className="font-work-sans font-bold text-xl text-white">{stat.value}</div>
                    <div className="font-outfit text-xs text-white/30">{stat.label}</div>
                  </div>
                  {i < stats.length - 1 && <div className="w-px h-8 bg-white/10" />}
                </React.Fragment>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex items-center gap-4">
              <div className="flex -space-x-2.5">
                {[
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
                ].map((avatar, i) => (
                  <img key={i} src={avatar} alt="" className="w-9 h-9 rounded-full border-2 border-dark object-cover" />
                ))}
              </div>
              <span className="font-outfit text-sm text-white/40">trusted by developers worldwide</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Column - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 xl:p-16 bg-background lg:rounded-l-[56px]">
        <div className="w-full max-w-[420px]">
          <div className="lg:hidden mb-10 text-center">
            <Link href={routes.home} className="inline-flex items-center gap-2.5">
              <LayeriumLogo size={32} />
              <span className="font-google-sans font-semibold text-xl text-dark tracking-tight">Layerium</span>
            </Link>
          </div>

          {/* Mode Switcher */}
          <div className="flex p-1.5 bg-white/70 backdrop-blur-2xl rounded-full border border-white shadow-soft mb-10">
            {(["login", "signup"] as AuthMode[]).map((mode) => (
              <button key={mode} onClick={() => handleModeChange(mode)} disabled={authState === "loading"} className={`relative flex-1 py-3.5 rounded-full font-dm-sans text-sm font-semibold transition-colors disabled:opacity-50 ${activeMode === mode ? "text-white" : "text-dark-muted hover:text-dark"}`}>
                {activeMode === mode && <motion.div layoutId="authMode" className="absolute inset-0 bg-dark rounded-full shadow-card" transition={{ type: "spring", stiffness: 500, damping: 35 }} />}
                <span className="relative z-10">{mode === "login" ? "Sign In" : "Sign Up"}</span>
              </button>
            ))}
          </div>

          {/* Messages */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -10, height: 0 }} className="mb-6">
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="font-outfit text-sm text-red-600">{errorMessage}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {successMessage && (
              <motion.div initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -10, height: 0 }} className="mb-6">
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-2xl">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <p className="font-outfit text-sm text-green-600">{successMessage}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div key={activeMode} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}>
              <div className="mb-8">
                <h2 className="font-google-sans font-semibold text-[1.75rem] text-dark mb-2 tracking-tight">
                  {activeMode === "login" ? "Welcome back" : "Create your account"}
                </h2>
                <p className="font-outfit text-dark-muted">
                  {activeMode === "login" ? "Enter your credentials to access your account" : "Start deploying in under 60 seconds"}
                </p>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                <button type="button" onClick={() => handleOAuth("google")} disabled={authState === "loading"} className="group flex items-center justify-center gap-2.5 py-4 bg-white/70 backdrop-blur-2xl border border-white rounded-2xl font-dm-sans text-sm font-medium text-dark hover:bg-white hover:shadow-card hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 transition-all duration-300">
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button type="button" onClick={() => handleOAuth("github")} disabled={authState === "loading"} className="group flex items-center justify-center gap-2.5 py-4 bg-white/70 backdrop-blur-2xl border border-white rounded-2xl font-dm-sans text-sm font-medium text-dark hover:bg-white hover:shadow-card hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 transition-all duration-300">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                  GitHub
                </button>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-dark/[0.06]" />
                <span className="font-outfit text-xs text-dark-muted/70 uppercase tracking-wider">or continue with email</span>
                <div className="flex-1 h-px bg-dark/[0.06]" />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {activeMode === "signup" && (
                  <div>
                    <label className="block font-dm-sans text-sm font-medium text-dark mb-2.5">Full Name</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="John Doe" className="w-full px-5 py-4 bg-white/70 backdrop-blur-2xl border border-white rounded-2xl font-outfit text-dark placeholder:text-dark-muted/40 focus:outline-none focus:bg-white focus:shadow-card focus:scale-[1.01] transition-all duration-300" required disabled={authState === "loading"} />
                  </div>
                )}

                <div>
                  <label className="block font-dm-sans text-sm font-medium text-dark mb-2.5">Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com" className="w-full px-5 py-4 bg-white/70 backdrop-blur-2xl border border-white rounded-2xl font-outfit text-dark placeholder:text-dark-muted/40 focus:outline-none focus:bg-white focus:shadow-card focus:scale-[1.01] transition-all duration-300" required disabled={authState === "loading"} />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="font-dm-sans text-sm font-medium text-dark">Password</label>
                    {activeMode === "login" && <Link href={routes.auth.forgotPassword} className="font-dm-sans text-sm font-medium text-primary hover:text-primary-hover transition-colors">Forgot?</Link>}
                  </div>
                  <div className="relative group">
                    <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" className="w-full px-5 py-4 bg-white/70 backdrop-blur-2xl border border-white rounded-2xl font-outfit text-dark placeholder:text-dark-muted/40 focus:outline-none focus:bg-white focus:shadow-card focus:scale-[1.01] transition-all duration-300 pr-14" required minLength={6} disabled={authState === "loading"} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-dark-muted hover:text-dark transition-colors">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {activeMode === "signup" && <p className="mt-2 font-outfit text-xs text-dark-muted/60">Must be at least 6 characters</p>}
                </div>

                {activeMode === "signup" && (
                  <div className="flex items-start gap-3 pt-1">
                    <input type="checkbox" id="terms" name="agreeTerms" checked={formData.agreeTerms} onChange={handleInputChange} className="mt-0.5 w-5 h-5 rounded-lg border-2 border-dark/10 text-primary focus:ring-primary/20 accent-primary cursor-pointer" required disabled={authState === "loading"} />
                    <label htmlFor="terms" className="font-outfit text-sm text-dark-muted leading-relaxed cursor-pointer">
                      I agree to the <Link href={routes.terms} className="text-dark font-medium hover:text-primary transition-colors">Terms</Link> and <Link href={routes.privacy} className="text-dark font-medium hover:text-primary transition-colors">Privacy Policy</Link>
                    </label>
                  </div>
                )}

                <button type="submit" disabled={authState === "loading"} className="w-full flex items-center justify-center gap-2.5 py-4 mt-2 bg-dark text-white rounded-full font-dm-sans font-semibold text-[15px] hover:bg-primary hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-dark transition-all duration-300 shadow-soft">
                  {authState === "loading" ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{activeMode === "login" ? "Signing in..." : "Creating account..."}</span>
                    </>
                  ) : (
                    <>
                      {activeMode === "login" ? "Sign In" : "Create Account"}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-8 text-center font-outfit text-sm text-dark-muted">
                {activeMode === "login" ? (
                  <>Don&apos;t have an account? <button onClick={() => handleModeChange("signup")} disabled={authState === "loading"} className="text-dark font-medium hover:text-primary transition-colors disabled:opacity-50">Sign up</button></>
                ) : (
                  <>Already have an account? <button onClick={() => handleModeChange("login")} disabled={authState === "loading"} className="text-dark font-medium hover:text-primary transition-colors disabled:opacity-50">Sign in</button></>
                )}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
