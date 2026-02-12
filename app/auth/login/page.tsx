"use client";

import dynamic from "next/dynamic";

// Loading skeleton that matches the auth page layout
function AuthSkeleton() {
  return (
    <div className="min-h-screen bg-dark flex">
      {/* Left Column skeleton */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden p-12 xl:p-16">
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px]" />
        <div className="relative z-10 flex flex-col justify-between w-full h-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl animate-pulse" />
            <div className="w-28 h-6 bg-white/10 rounded-lg animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="w-full h-14 bg-white/5 rounded-xl animate-pulse" />
            <div className="w-3/4 h-14 bg-white/5 rounded-xl animate-pulse" />
          </div>
          <div className="flex gap-6">
            <div className="w-16 h-12 bg-white/5 rounded-lg animate-pulse" />
            <div className="w-16 h-12 bg-white/5 rounded-lg animate-pulse" />
            <div className="w-16 h-12 bg-white/5 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
      
      {/* Right Column skeleton */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 xl:p-16 bg-background lg:rounded-l-[56px]">
        <div className="w-full max-w-[420px] space-y-8">
          <div className="flex p-1.5 bg-white/70 rounded-full">
            <div className="flex-1 h-12 bg-dark rounded-full" />
            <div className="flex-1 h-12 bg-transparent rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="w-48 h-8 bg-dark/10 rounded-lg animate-pulse" />
            <div className="w-64 h-5 bg-dark/5 rounded-lg animate-pulse" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-14 bg-white/70 rounded-2xl animate-pulse" />
            <div className="h-14 bg-white/70 rounded-2xl animate-pulse" />
          </div>
          <div className="space-y-5">
            <div className="h-16 bg-white/70 rounded-2xl animate-pulse" />
            <div className="h-16 bg-white/70 rounded-2xl animate-pulse" />
          </div>
          <div className="h-14 bg-dark rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// Dynamic import with SSR disabled to avoid hydration issues
const AuthContent = dynamic(() => import("./auth-content"), {
  ssr: false,
  loading: () => <AuthSkeleton />,
});

export default function LoginPage() {
  return <AuthContent />;
}
