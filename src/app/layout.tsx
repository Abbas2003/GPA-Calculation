import type { Metadata } from "next";
import { ThemeProvider } from '@/components/theme-provider';
import "./globals.css";

export const metadata: Metadata = {
  title: "GPA Calculator",
  description: "Powered by Next JS, Tailwind CSS, and Vercel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body className="bg-background text-foreground">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </body>
  </html>
  );
}
