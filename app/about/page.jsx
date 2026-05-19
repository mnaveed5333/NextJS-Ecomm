"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  HiOutlineTruck,
  HiOutlineRefresh,
  HiOutlineShieldCheck,
  HiOutlineSupport,
  HiOutlineBadgeCheck,
} from "react-icons/hi";
import {
  HiOutlineUsers,
  HiOutlineCube,
  HiOutlineFaceSmile,
} from "react-icons/hi2";

const features = [
  { icon: <HiOutlineTruck       size={17} className="text-orange-600 flex-shrink-0" />, text: "Free shipping on orders over Rs. 2,000" },
  { icon: <HiOutlineRefresh     size={17} className="text-orange-600 flex-shrink-0" />, text: "Easy 7-day returns, no questions asked"  },
  { icon: <HiOutlineShieldCheck size={17} className="text-orange-600 flex-shrink-0" />, text: "Secure payments & buyer protection"      },
  { icon: <HiOutlineSupport     size={17} className="text-orange-600 flex-shrink-0" />, text: "24/7 dedicated customer support"         },
  { icon: <HiOutlineBadgeCheck  size={17} className="text-orange-600 flex-shrink-0" />, text: "Authentic products, guaranteed quality"  },
];

const stats = [
  { icon: <HiOutlineUsers     size={22} className="text-orange-600 mx-auto mb-1" />, num: "50K+", label: "Happy Customers" },
  { icon: <HiOutlineCube      size={22} className="text-orange-600 mx-auto mb-1" />, num: "10K+", label: "Products"        },
  { icon: <HiOutlineFaceSmile size={22} className="text-orange-600 mx-auto mb-1" />, num: "98%",  label: "Satisfaction"   },
];

export default function AboutSection() {
  return (
    <>
      <Navbar />

      <section id="about" className="relative overflow-hidden bg-white px-8 py-20">

        {/* Decorative blob */}
        <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-orange-50" />

        <div className="relative z-10 mx-auto grid max-w-5xl grid-cols-1 items-center gap-16 md:grid-cols-2">

          {/* Left: text */}
          <div>
            <span className="mb-4 inline-block rounded-full bg-orange-100 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-orange-600">
              About Us
            </span>

            <h2 className="mb-5 text-4xl font-extrabold leading-tight text-gray-800">
              We Are{" "}
              <span className="text-orange-600">Quick Cart</span> —{" "}
              Your Shopping Partner
            </h2>

            <p className="mb-5 text-sm leading-relaxed text-gray-500">
              Quick Cart was built with one mission: make online shopping fast,
              reliable, and enjoyable for everyone. From everyday essentials to
              premium finds, we bring thousands of products to your fingertips
              with lightning-fast delivery and unbeatable prices.
            </p>

            <p className="text-sm leading-relaxed text-gray-500">
              Founded in 2021, our team of passionate builders works tirelessly
              to ensure every order feels personal, every delivery arrives on
              time, and every customer leaves satisfied.
            </p>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-4 text-center"
                >
                  {s.icon}
                  <span className="block text-2xl font-extrabold text-orange-600">
                    {s.num}
                  </span>
                  <span className="mt-1 block text-xs text-gray-500">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: visual card */}
          <div className="flex flex-col gap-4 rounded-2xl bg-orange-50 p-9">
            <span className="text-6xl font-extrabold leading-none text-orange-600">
              Q
            </span>
            <p className="text-lg font-medium text-gray-700">
              Fast. Reliable. Affordable.
            </p>
            <p className="text-sm leading-relaxed text-gray-500">
              Everything you love about shopping — without the hassle.
              Cart up, check out, done.
            </p>

            <ul className="flex flex-col gap-3">
              {features.map((f) => (
                <li key={f.text} className="flex items-center gap-3 text-sm text-gray-700">
                  {f.icon}
                  {f.text}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}