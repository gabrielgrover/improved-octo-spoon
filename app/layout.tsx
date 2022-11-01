import "./globals.css";
import { Navbar } from "./Navbar/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Create Next App</title>
        <meta name="description" content="web dev blog" />
        <meta name="author" content="gabriel grover" />
        <link rel="icon" href="/favicon.ico" />
      </head>

      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
