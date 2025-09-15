// app/layout.tsx
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
// import { ModalProvider } from "@/components/modals/modal-provider";

export const metadata: Metadata = {
  title: "Droplog - Project Management Platform",
  description: "Web-based project management and annotation platform for teams",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <div id="root">
          {children}
          {/* <ModalProvider /> */}
        </div>
      </body>
    </html>
  );
}