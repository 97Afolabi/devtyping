import { Suspense } from "react";
import type { Metadata } from "next";
import "tailwindcss/tailwind.css";
// import "./globals.css";
import Header from "../components/layouts/header";
import Footer from "../components/layouts/footer";

const { TWITTER_CREATOR, TWITTER_SITE, SITE_NAME, BASE_URL } = process.env;
const baseUrl = BASE_URL ? BASE_URL : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  description: "Improvement through repetition",
  robots: {
    follow: true,
    index: true,
  },
  ...(TWITTER_CREATOR &&
    TWITTER_SITE && {
      twitter: {
        card: "summary_large_image",
        creator: TWITTER_CREATOR,
        site: TWITTER_SITE,
      },
    }),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col h-screen">
        <Header />
        <main className="basis-11/12 bg-stone-300">
          <Suspense>{children}</Suspense>
        </main>
        <Footer />
      </body>
    </html>
  );
}
