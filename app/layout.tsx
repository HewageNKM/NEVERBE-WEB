import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-white text-neutral-900">
      <body
        className={`${inter.className} antialiased min-h-screen flex flex-col`}
      >
        <main className="flex-1 animate-fade">{children}</main>
      </body>
    </html>
  );
}
