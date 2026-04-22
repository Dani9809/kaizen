import type { Metadata } from "next";
import { Poppins, Open_Sans } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "KAIZEN | Admin Portal",
  description: "Administrative dashboard for KAIZEN Social Productivity App",
};

import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${openSans.variable} font-body antialiased`}
      >
        <ThemeProvider>
          <Toaster position="top-right" richColors closeButton />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
