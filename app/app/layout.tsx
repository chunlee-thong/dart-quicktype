"use client";
import { MantineProvider } from "@mantine/core";
import Head from "next/head";
import Script from "next/script";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Script src={"https://accounts.google.com/gsi/client"} />
      <Head>
        <title>Dart QuickType - Convert JSON to Dart</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <body>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: "dark",
            primaryColor: "blue",
          }}>
          {children}
        </MantineProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
