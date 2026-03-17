import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Habit Tracker",
  description: "Track your daily habits in style",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased bg-[#F3F5F8] text-slate-900`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}