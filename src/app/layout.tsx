import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/lib/cart";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Benitz Appliance Shop | Sedalia's Trusted Used & New Appliances Since 1998",
  description:
    "Shop clean, tested used appliances, new appliances, and genuine parts at Benitz Appliance Shop in Sedalia, MO. Local delivery and warranty available.",
  keywords: [
    "Sedalia appliances",
    "used appliances Sedalia MO",
    "Benitz Appliance",
    "appliance parts",
    "refrigerator",
    "washer",
    "dryer",
    "used refrigerator Sedalia",
    "appliance delivery Missouri",
    "Warrensburg appliances",
  ],
  openGraph: {
    title: "Benitz Appliance Shop",
    description: "Sedalia's Trusted Used & New Appliance Shop Since 1998",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-gray-50`}>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
