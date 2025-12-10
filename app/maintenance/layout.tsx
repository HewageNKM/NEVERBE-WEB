export const metadata = {
  title: "Maintenance | NEVERBE",
  description:
    "NEVERBE is currently undergoing scheduled maintenance. We’ll be back shortly with an improved experience.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  openGraph: {
    title: "NEVERBE - Maintenance",
    description:
      "We’re performing scheduled maintenance. The website will be back online shortly.",
    url: "https://neverbe.com/maintenance",
    siteName: "NEVERBE",
  },
  alternates: {
    canonical: "https://neverbe.com/maintenance",
  },
};

export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="min-h-screen w-full">
      <body>{children}</body>
    </html>
  );
}
