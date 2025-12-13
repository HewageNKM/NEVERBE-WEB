import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login / Register | NEVERBE - Join Our Community",
  description:
    "Sign in to your NEVERBE account or create a new profile to access exclusive products, track orders, and faster checkout.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
