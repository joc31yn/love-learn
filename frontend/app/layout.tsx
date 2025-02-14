import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { StoreProvider } from "./storeProvider";
import Script from 'next/script';

// Use instead of _app.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        async
      />
      <html lang="en" className={GeistSans.className} suppressHydrationWarning>
        <body className="ground text-foreground">
          <StoreProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {/* NAVBAR START */}
              <main className="min-h-screen flex flex-col items-center flex-1 w-full">
                <nav className="w-full flex justify-center  h-16 bg-slate-950">
                  <div className="w-full max-w-5xl flex justify-between border-none items-center p-3 px-5 text-sm">
                    <div className="flex gap-5 items-center font-semibold">
                    </div>
                    {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                  </div>
                </nav>

                {/* Default show children */}
                {children}

                {/* FOOTER START */}
                <footer className="insert-x-0 bottom-0 w-full flex items-center justify-center mx-auto text-center text-xs gap-8 py-4 bg-gradient-to-b from-slate-900 to-black">
                  <p>
                    Powered by{" "}
                    <a
                      href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                      target="_blank"
                      className="font-bold hover:underline hover:text-orange-400"
                      rel="noreferrer"
                    >
                      Supabase
                    </a>
                  </p>
                  <ThemeSwitcher />
                </footer>
              </main>
            </ThemeProvider>
          </StoreProvider>
        </body>
      </html>
    </>
  );
}