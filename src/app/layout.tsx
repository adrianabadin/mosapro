import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./layout/header";
import { ReduxProvider } from "./GlobalRedux/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Heroes de la pandemia",
  description:
    "Sitio del Movimiento Sanitario provincial en reconocimiento al personal de salud fallecido en la pandemia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ReduxProvider>
        <body className={inter.className}>
          <Header />

          {children}
        </body>
      </ReduxProvider>
    </html>
  );
}
