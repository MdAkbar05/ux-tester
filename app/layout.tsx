import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UX Tester — AI + Human Simulation",
  description: "Simulate real user behavior on your website. Identify UX friction before your users do.",
  keywords: ["UX testing", "AI simulation", "user experience", "website analysis"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Syne:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-grid min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
