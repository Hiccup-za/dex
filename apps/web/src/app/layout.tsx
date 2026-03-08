import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { Databuddy } from "@databuddy/sdk/react";
import { AppProvider } from "@/context/AppContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dex",
  description: "Track your Pokémon party, Pokédex progress, and gym badges across your games.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistMono.variable}>
      <body className={GeistMono.className}>
        <AppProvider>
          {children}
          <Databuddy clientId="7dc83a82-ee26-483a-ab17-88e9da816371" />
        </AppProvider>
      </body>
    </html>
  );
}
