import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | NEVERBE - Become A Member",
  description:
    "Create your profile to get access to the best products and inspiration.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
