import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://goodmorningindiaholidays.in"),
  title: {
    default: "Good Morning India Holidays",
    template: "%s | Good Morning India Holidays",
  },
  description:
    "Good Morning India Holidays crafts tailored journeys across India with curated stays, local expertise, and destination-led travel planning.",
  applicationName: "Good Morning India Holidays",
  keywords: [
    "India tours",
    "India travel agency",
    "custom India itineraries",
    "luxury India holidays",
    "Kerala tours",
    "Rajasthan holidays",
    "Ladakh trips",
    "Good Morning India Holidays",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Good Morning India Holidays",
    description:
      "Tailored journeys across India with curated stays, local insight, and beautifully planned destination experiences.",
    url: "https://goodmorningindiaholidays.in",
    siteName: "Good Morning India Holidays",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/logo.jpeg",
        width: 916,
        height: 687,
        alt: "Good Morning India Holidays logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Good Morning India Holidays",
    description:
      "Curated India journeys across heritage cities, mountains, coasts, wildlife, and cultural routes.",
    images: ["/images/logo.jpeg"],
  },
  icons: {
    icon: "/images/logo.jpeg",
    shortcut: "/images/logo.jpeg",
    apple: "/images/logo.jpeg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
