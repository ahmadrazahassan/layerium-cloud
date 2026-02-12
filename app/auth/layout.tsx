import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Layerium",
    default: "Authentication | Layerium",
  },
  description: "Sign in or create an account to access Layerium Cloud services.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
