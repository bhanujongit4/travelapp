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
  metadataBase: new URL("https://www.goodmorningindiaholidays.com/"),
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
    url: "https://www.goodmorningindiaholidays.com/",
    siteName: "Good Morning India Holidays",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.goodmorningindiaholidays.com/images/logo.jpeg", // 👈 absolute
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
    images: ["https://www.goodmorningindiaholidays.com/images/logo.jpeg"], // 👈 absolute
  },
  icons: {
  icon: [
    { url: "/favicon.ico" },
    { url: "/favicon32.png", sizes: "32x32", type: "image/png" },
    { url: "/favicon16.png", sizes: "16x16", type: "image/png" },
  ],
  apple: "/apple-touch-icon.jpeg",
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
