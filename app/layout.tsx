import "./globals.css";
import * as F from "fp-ts/function";
import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import { Navbar } from "./components/Navbar/Navbar";
import { ThemeProvider } from "../Providers/ThemeProvider";
import { TokenProvider } from "../Providers/TokenProvider";
import { generate_api_token } from "../utils/api_token";

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const maybe_token = F.pipe(
    generate_api_token(),
    E.fold(
      () => O.none,
      (token) => O.some(token)
    )
  );

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
        <TokenProvider token={maybe_token}>
          <ThemeProvider>
            <Navbar />
            {children}
          </ThemeProvider>
        </TokenProvider>
      </body>
    </html>
  );
}
