import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - Layerium Cloud",
  description: "Sign in or create an account to access Layerium Cloud",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
