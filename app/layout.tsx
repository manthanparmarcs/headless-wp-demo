import "./globals.css";
import { Providers } from "./providers";

export default function RootLayout({ children }: any) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}