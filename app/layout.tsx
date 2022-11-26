import * as F from "fp-ts/function";
import * as E from "fp-ts/Either";
import "./globals.css";
import { Navbar } from "./components/Navbar/Navbar";
import { ThemeProvider } from "../Providers/ThemeProvider";
import { BlogErrorMessage } from "./components/BlogErrorMessage/BlogErrorMessage";
import { TokenProvider } from "../Providers/TokenProvider";
import { generate_api_token } from "../utils/api_token";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const MaybeTokenProvider = F.pipe(
    generate_api_token(),
    E.fold(
      (blog_err) => {
        const err_comp: React.FC<
          React.PropsWithChildren<Record<string, unknown>>
        > = () => <BlogErrorMessage blog_err={blog_err} />;

        return err_comp;
      },
      (token) => {
        const provider: React.FC<
          React.PropsWithChildren<Record<string, unknown>>
        > = (props) => (
          <TokenProvider token={token}>{props.children}</TokenProvider>
        );

        return provider;
      }
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
        <MaybeTokenProvider>
          <ThemeProvider>
            <Navbar />
            {children}
          </ThemeProvider>
        </MaybeTokenProvider>
      </body>
    </html>
  );
}
