"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, CheckCircle2, AlertCircle, Shield, Clock, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { routes, buildCallbackUrl } from "@/lib/routes";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

function LayeriumLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <path d="M4 24L18 32L32 24" stroke="#ff5533" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
      <path d="M4 18L18 26L32 18" stroke="#ff5533" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
      <path d="M4 12L18 20L32 12L18 4L4 12Z" fill="#ff5533" stroke="#ff5533" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const securityFeatures = [
  { icon: Shield, text: "Secure reset link" },
  { icon: Clock, text: "Expires in 1 hour" },
];

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const resetUrl = buildCallbackUrl(routes.auth.resetPassword);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: resetUrl,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setIsSuccess(true);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-[45%] bg-dark relative overflow-hidden p-12 xl:p-16">
        {/* Background Effects */}
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px]" />
        
        {/* Dot Pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full">
            <defs>
              <pattern id="forgot-dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#forgot-dots)" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col w-full h-full">
          {/* Logo */}
          <Link href={routes.home} className="inline-flex items-center gap-3 w-fit">
            <LayeriumLogo size={40} />
            <span className="font-google-sans font-semibold text-2xl text-white tracking-tight">Layerium</span>
          </Link>

          {/* Content - positioned higher */}
          <div className="max-w-md mt-24 xl:mt-32">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
              className="font-google-sans font-bold text-[2.5rem] xl:text-[2.75rem] text-white leading-[1.1] tracking-tight mb-6"
            >
              reset your<br />
              <span className="text-white/30">password securely.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
              className="font-outfit text-lg text-white/50 leading-relaxed"
            >
              We'll send you a secure link to reset your password. Your account security is our priority.
            </motion.p>

          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 xl:p-16 lg:rounded-l-[56px] lg:bg-background lg:-ml-14 relative z-10">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-10">
            <Link href={routes.home} className="inline-flex items-center gap-2.5">
              <LayeriumLogo size={32} />
              <span className="font-google-sans font-semibold text-xl text-dark tracking-tight">Layerium</span>
            </Link>
          </div>

          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease }}
              >
                {/* Header Pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-dark text-white rounded-full text-sm font-dm-sans font-semibold">
                    <Mail className="w-3.5 h-3.5" />
                    Password Reset
                  </span>
                </div>

                <h1 className="font-google-sans font-semibold text-[1.75rem] text-dark mb-2 tracking-tight">
                  Forgot your password?
                </h1>
                <p className="font-outfit text-dark-muted mb-8">
                  No worries, we'll send you reset instructions
                </p>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="mb-6"
                    >
                      <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="font-outfit text-sm text-red-600">{error}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block font-dm-sans text-sm font-medium text-dark mb-2.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-5 py-4 bg-white/70 backdrop-blur-2xl border border-white rounded-2xl font-outfit text-dark placeholder:text-dark-muted/40 focus:outline-none focus:bg-white focus:shadow-card focus:scale-[1.01] transition-all duration-300 pr-12"
                        required
                        disabled={isLoading}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Mail className="w-5 h-5 text-dark-muted/40" />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2.5 py-4 bg-dark text-white rounded-full font-dm-sans font-semibold text-[15px] hover:bg-primary hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-dark transition-all duration-300 shadow-soft"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending link...</span>
                      </>
                    ) : (
                      <>
                        Send Reset Link
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Security Info Pills */}
                <div className="flex flex-wrap gap-2 mt-8 justify-center">
                  {securityFeatures.map((feature) => (
                    <span
                      key={feature.text}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-dark/[0.03] rounded-full text-xs font-outfit text-dark-muted border border-dark/[0.06]"
                    >
                      <feature.icon className="w-3 h-3" />
                      {feature.text}
                    </span>
                  ))}
                </div>

                {/* Back to Login */}
                <div className="mt-8 pt-6 border-t border-dark/[0.06] text-center">
                  <Link
                    href={routes.auth.login}
                    className="group inline-flex items-center gap-2 px-5 py-2.5 bg-surface-1 rounded-full font-dm-sans text-sm font-medium text-dark-muted hover:text-dark hover:bg-surface-2 transition-all duration-300 border border-border"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back to sign in
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease }}
                className="text-center"
              >
                {/* Success Animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                  className="relative w-20 h-20 mx-auto mb-8"
                >
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
                  <div className="relative w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                </motion.div>

                {/* Success Pills */}
                <div className="flex justify-center mb-6">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-full text-sm font-dm-sans font-semibold border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Email Sent
                  </span>
                </div>

                <h2 className="font-google-sans font-semibold text-[1.75rem] text-dark mb-3 tracking-tight">
                  Check your inbox
                </h2>
                <p className="font-outfit text-dark-muted mb-4">
                  We've sent a password reset link to
                </p>
                
                {/* Email Pill */}
                <div className="inline-flex items-center gap-2 px-5 py-3 bg-dark text-white rounded-full font-outfit text-sm mb-8">
                  <Mail className="w-4 h-4 text-primary" />
                  {email}
                </div>

                {/* Instructions */}
                <div className="bg-surface-1 rounded-[20px] border border-border p-5 mb-8">
                  <div className="space-y-3">
                    {[
                      { step: "1", text: "Open the email we sent you" },
                      { step: "2", text: "Click the reset link" },
                      { step: "3", text: "Create a new password" },
                    ].map((item) => (
                      <div key={item.step} className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-dark rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="font-work-sans font-bold text-xs text-white">{item.step}</span>
                        </div>
                        <span className="font-outfit text-sm text-dark-muted">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setEmail("");
                    }}
                    className="w-full py-3.5 bg-surface-1 text-dark rounded-full font-dm-sans text-sm font-medium border border-border hover:bg-surface-2 hover:border-dark/20 transition-all duration-300"
                  >
                    Didn't receive it? Try again
                  </button>
                  <Link
                    href={routes.auth.login}
                    className="group w-full inline-flex items-center justify-center gap-2 py-3.5 bg-dark text-white rounded-full font-dm-sans text-sm font-semibold hover:bg-primary hover:scale-[1.02] transition-all duration-300"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back to sign in
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
