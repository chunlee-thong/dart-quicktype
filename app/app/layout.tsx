"use client";
import { MantineProvider } from "@mantine/core";
import Head from "next/head";
import Script from "next/script";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

import { GoogleAnalytics } from "nextjs-google-analytics";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Script src={"https://accounts.google.com/gsi/client"} />
      <Head>
        <title>Dart QuickType - Convert JSON to Dart</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <meta charSet="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Convert json to Dart model class with null safety support, Also support more feature such as History and setting."
        />
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
        <GoogleAnalytics trackPageViews />
      </body>
    </html>
  );
}
