"use client";

import { useState } from "react";

export default function Page() {
  const [formData, setFormData] = useState({
    "your-name": "",
    "your-email": "",
    "your-subject": "",
    "your-message": "",
  });

  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      payload.append(key, value)
    );

    try {
      const res = await fetch("/api/cf7/submit", {
        method: "POST",
        body: payload,
      });

      const data = await res.json();

      if (data.status === "mail_sent") {
        setStatus("Message sent successfully ✅");
        setFormData({
          "your-name": "",
          "your-email": "",
          "your-subject": "",
          "your-message": "",
        });
      } else {
        setStatus(`Error: ${data.message || "Something went wrong"}`);
      }
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 text-white">
        
        <h1 className="text-3xl font-bold mb-6 text-center">
          Contact Us
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <label className="block text-sm mb-1">Your Name</label>
            <input
              type="text"
              name="your-name"
              value={formData["your-name"]}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-300"
              placeholder="Enter your name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-1">Your Email</label>
            <input
              type="email"
              name="your-email"
              value={formData["your-email"]}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-300"
              placeholder="Enter your email"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm mb-1">Subject</label>
            <input
              type="text"
              name="your-subject"
              value={formData["your-subject"]}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-300"
              placeholder="Enter subject"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm mb-1">Message</label>
            <textarea
              name="your-message"
              value={formData["your-message"]}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-300"
              placeholder="Write your message..."
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition duration-300 font-semibold"
          >
            Submit
          </button>
        </form>

        {/* Status */}
        {status && (
          <p className="mt-4 text-center text-sm">
            {status}
          </p>
        )}
      </div>
    </div>
  );
}