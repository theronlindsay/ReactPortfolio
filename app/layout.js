import { Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";
// import "./crt.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Theron Lindsay Portfolio",
  description: "Portfolio website for Theron Lindsay",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>

      </head>
      <body
        className={`${outfit.variable} ${geistMono.variable} font-sans antialiased crt dark bg-background text-foreground overflow-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
