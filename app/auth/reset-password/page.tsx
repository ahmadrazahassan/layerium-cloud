"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { routes } from "@/lib/routes";

function LayeriumLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <path d="M4 24L18 32L32 24" stroke="#ff5533" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
      <path d="M4 18L18 26L32 18" stroke="#ff5533" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
      <path d="M4 12L18 20L32 12L18 4L4 12Z" fill="#ff5533" stroke="#ff5533" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setError(error.message);
        return;
      }

      setIsSuccess(true);
      setTimeout(() => router.push(routes.dashboard.home), 3000);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href={routes.home} className="inline-flex items-center gap-2.5">
            <LayeriumLogo size={36} />
            <span className="font-google-sans font-semibold text-xl text-dark tracking-tight">Layerium</span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-1 rounded-[32px] border border-border p-8"
        >
          {!isSuccess ? (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-7 h-7 text-primary" />
                </div>
                <h1 className="font-google-sans font-semibold text-2xl text-dark mb-2">
                  Set new password
                </h1>
                <p className="font-outfit text-dark-muted">
                  Create a strong password for your account
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="font-outfit text-sm text-red-600">{error}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block font-dm-sans text-sm font-medium text-dark mb-2.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-5 py-4 bg-white border border-border rounded-2xl font-outfit text-dark placeholder:text-dark-muted/40 focus:outline-none focus:border-dark focus:shadow-card transition-all pr-14"
                      required
                      minLength={6}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-dark-muted hover:text-dark transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="mt-2 font-outfit text-xs text-dark-muted/60">
                    Must be at least 6 characters
                  </p>
                </div>

                <div>
                  <label className="block font-dm-sans text-sm font-medium text-dark mb-2.5">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-5 py-4 bg-white border border-border rounded-2xl font-outfit text-dark placeholder:text-dark-muted/40 focus:outline-none focus:border-dark focus:shadow-card transition-all"
                    required
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2.5 py-4 bg-dark text-white rounded-full font-dm-sans font-semibold hover:bg-primary disabled:opacity-70 transition-all"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
              </div>
              <h2 className="font-google-sans font-semibold text-2xl text-dark mb-2">
                Password updated!
              </h2>
              <p className="font-outfit text-dark-muted mb-6">
                Your password has been successfully updated.<br />
                Redirecting to dashboard...
              </p>
              <div className="w-6 h-6 border-2 border-dark/20 border-t-dark rounded-full animate-spin mx-auto" />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
