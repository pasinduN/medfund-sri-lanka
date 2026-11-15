import { Bricolage_Grotesque, Instrument_Sans, Noto_Sans_Sinhala } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DonateProvider } from "@/components/DonateProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { themeScript } from "@/lib/theme";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" });
const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-body" });
const sinhala = Noto_Sans_Sinhala({ subsets: ["sinhala"], weight: ["400", "600"], variable: "--font-sinhala" });

export const metadata = {
  title: "MedFund Sri Lanka — Verified medical fundraising",
  description: "Help verified patients in Sri Lanka get the treatment they can't afford alone.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning className={`${display.variable} ${body.variable} ${sinhala.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <DonateProvider>
              <Header />
              <main>{children}</main>
              <Footer />
            </DonateProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}