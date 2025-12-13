import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | NEVERBE - Manage Your Profile & Orders",
  description:
    "View your order history, manage your addresses, and update your profile details safely and securely on NEVERBE.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
