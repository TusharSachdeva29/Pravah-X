    import type { Metadata } from "next";
    import { Inter } from "next/font/google";
    import "./globals.css";
    import { SessionProvider } from "next-auth/react";
    import { Providers } from "./provider";
    import { ThemeProvider } from "../providers/theme-provider"
    import { Navbar } from "@/components/navbar";

    const inter = Inter({ subsets: ["latin"] });

    export const metadata: Metadata = {
      title: "Pravah-X",
      description: "Coding practice platform for codeforces beginners",

    };

    export default function RootLayout({
      children,
    }: Readonly<{
      children: React.ReactNode;
    }>) {
      return (
        <html lang="en" suppressHydrationWarning>
          <body className={inter.className}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Providers>
                {children}
              </Providers>
            </ThemeProvider>
          </body>
        </html>
      );
    }
