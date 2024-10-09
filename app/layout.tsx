'use client';
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from '../components/sidebar';
import { Toaster } from "react-hot-toast";
import { store } from "@/store";
import { Provider } from "react-redux";
import { getColor, ThemeProvider, useTheme } from "@/components/ThemeContext";
import { useMemo } from "react";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ backgroundColor: getColor('background-primary') }}>
      <Provider store={store}>
        <ThemeProvider>

          <body className={inter.className}>
            <Toaster />
            {/* <CheckUserInfo /> */}
            <div>
              {children}
            </div>
            <Sidebar />
          </body>
        </ThemeProvider>

      </Provider>
    </html>
  );
}
