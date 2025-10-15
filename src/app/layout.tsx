import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "WesalPulse – Smart Experiences, Simplify Data, Amplify Growth",
  description: "WesalPulse provides smart experiences that simplify data complexity and amplify business growth through advanced analytics and insights.",
  keywords: ["WesalPulse", "Smart Experiences", "Data Analytics", "Business Growth", "Performance Dashboard", "Queue Management", "Customer Experience"],
  authors: [{ name: "WesalCX" }],
  openGraph: {
    title: "WesalPulse – Smart Experiences, Simplify Data, Amplify Growth",
    description: "Smart experiences that simplify data complexity and amplify business growth through advanced analytics and insights.",
    url: "https://app.wesalpulse.com",
    siteName: "WesalPulse",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WesalPulse – Smart Experiences, Simplify Data, Amplify Growth",
    description: "Smart experiences that simplify data complexity and amplify business growth through advanced analytics and insights.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased bg-background text-foreground"
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
