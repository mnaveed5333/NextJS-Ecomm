"use client"
// Quick Cart — Contact Section with WhatsApp form
// ⚠️  PUT YOUR WHATSAPP NUMBER BELOW (country code, no + or spaces)
// Example Pakistan number: 923001234567

const WHATSAPP_NUMBER = "923065333425";

import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import {
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineClock,
} from "react-icons/hi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Contact() {
  const [form, setForm] = useState({
    fname: "", lname: "", phone: "", subject: "", message: "",
  });
  const [sent, setSent] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const sendToWhatsApp = () => {
    if (!form.fname.trim()) { alert("Please enter your first name."); return; }
    if (!form.subject)       { alert("Please select a subject.");     return; }
    if (!form.message.trim()){ alert("Please write a message.");      return; }

    const fullName = form.lname
      ? `${form.fname} ${form.lname}`
      : form.fname;

    const lines = [
      "*New Message from Quick Cart Website*",
      "",
      `*Name:* ${fullName}`,
      form.phone ? `*Phone:* ${form.phone}` : null,
      `*Subject:* ${form.subject}`,
      "",
      "*Message:*",
      form.message,
      "",
      "─────────────────",
      "_Sent via Quick Cart Contact Form_",
    ]
      .filter(Boolean)
      .join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`;
    window.open(url, "_blank");
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  const inputCls =
    "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition";

  const infoCards = [
    {
      icon: <HiOutlineLocationMarker size={22} className="text-orange-600" />,
      title: "Our Location",
      value: "Faisalabad, Punjab, Pakistan",
    },
    {
      icon: <HiOutlinePhone size={22} className="text-orange-600" />,
      title: "WhatsApp / Phone",
      value: "+92 XXX XXXXXXX",
    },
    {
      icon: <HiOutlineMail size={22} className="text-orange-600" />,
      title: "Email Address",
      value: "support@quickcart.pk",
    },
    {
      icon: <HiOutlineClock size={22} className="text-orange-600" />,
      title: "Working Hours",
      value: (
        <>
          Mon – Sat: 9 AM – 9 PM
          <br />
          Sunday: 11 AM – 6 PM
        </>
      ),
    },
  ];

  return (
    <>
      <Navbar />

      <section id="contact" className="bg-gray-50 px-8 py-20">
        <div className="mx-auto max-w-5xl">

          {/* Header */}
          <div className="mb-14 text-center">
            <span className="mb-3 inline-block rounded-full bg-orange-100 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-orange-600">
              Get In Touch
            </span>
            <h2 className="mb-3 text-4xl font-extrabold text-gray-800">
              Have Questions?{" "}
              <span className="text-orange-600">We&apos;re Here</span>
            </h2>
            <p className="text-sm text-gray-500">
              Fill the form and your message goes straight to our WhatsApp — we
              reply within minutes.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[1fr_1.5fr]">

            {/* Info cards */}
            <div className="flex flex-col gap-5">
              {infoCards.map((c) => (
                <div
                  key={c.title}
                  className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5"
                >
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-orange-50">
                    {c.icon}
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-medium text-gray-800">{c.title}</p>
                    <p className="text-sm text-gray-500">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-9">
              <h3 className="mb-1 text-xl font-bold text-gray-800">
                Send Us a Message
              </h3>
              <p className="mb-7 text-sm text-gray-500">
                We&apos;ll respond on WhatsApp within minutes ✅
              </p>

              {/* Name row */}
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    First Name *
                  </label>
                  <input
                    name="fname"
                    value={form.fname}
                    onChange={handleChange}
                    placeholder="Ali"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    name="lname"
                    value={form.lname}
                    onChange={handleChange}
                    placeholder="Hassan"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-medium text-gray-700">
                  Your Phone / WhatsApp
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  type="tel"
                  placeholder="+92 300 1234567"
                  className={inputCls}
                />
              </div>

              {/* Subject */}
              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-medium text-gray-700">
                  Subject *
                </label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className={inputCls}
                >
                  <option value="">-- Select a topic --</option>
                  <option>Order Inquiry</option>
                  <option>Return / Refund</option>
                  <option>Product Question</option>
                  <option>Delivery Issue</option>
                  <option>Partnership / Wholesale</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Message */}
              <div className="mb-5">
                <label className="mb-1.5 block text-xs font-medium text-gray-700">
                  Your Message *
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your question or issue in detail..."
                  className={`${inputCls} resize-y`}
                />
              </div>

              {/* Submit */}
              <button
                onClick={sendToWhatsApp}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-orange-600 py-3.5 text-sm font-medium text-white transition hover:bg-orange-700 active:scale-95"
              >
                <FaWhatsapp size={20} />
                Send via WhatsApp
              </button>

              {sent && (
                <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-5 py-3.5 text-center text-sm text-green-800">
                  <FaWhatsapp size={16} className="text-green-600" />
                  Opening WhatsApp with your message… We&apos;ll reply shortly!
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}