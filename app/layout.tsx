"use client";
import "./globals.css";
import { Navbar } from "./components";
import { ThemeProvider } from "../Providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>void log</title>
        <meta name="description" content="web dev blog" />
        <meta name="author" content="gabriel grover" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>

      <body>
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
