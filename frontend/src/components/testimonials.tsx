"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  text: string;
}

export default function Testimonials() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    text: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      name: "John Doe",
      role: "Project Manager",
      company: "Tech Company",
      text: "Maria is an exceptional developer who consistently delivers high-quality work. Her attention to detail and problem-solving skills are outstanding.",
    },
    {
      name: "Jane Smith",
      role: "Team Lead",
      company: "Software Inc",
      text: "Working with Maria was a pleasure. She is highly skilled, communicative, and always goes above and beyond to meet project requirements.",
    },
    {
      name: "Alex Johnson",
      role: "Senior Developer",
      company: "Dev Studio",
      text: "Maria's technical abilities and dedication to learning make her a valuable team member. I highly recommend her for any development project.",
    },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.role && formData.company && formData.text) {
      setTestimonials((prev) => [...prev, formData]);
      setFormData({ name: "", role: "", company: "", text: "" });
      setShowForm(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section id="testimonials" className="py-20 lg:py-32 bg-[#0f0520]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full lg:ml-24">
        {/* Section Header */}
        <motion.div 
          className="flex items-end mb-12"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Number 6 - Styled text to match design */}
          <span
            className="font-sans font-bold text-[80px] leading-none text-[#5227FF] -mr-2"
            style={{
              WebkitTextStroke: '1px #B19EEF',
              textShadow: '1px 2px 4px rgba(82, 39, 255, 0.5)',
            }}
          >
            6
          </span>
          {/* Title text with line */}
          <div className="flex items-start mb-1 -mt-4">
            <h2 className="font-sans font-semibold text-[32px] leading-none tracking-[-0.02em] text-[#F9F9F9] whitespace-nowrap ml-2">
              Testimonials
            </h2>
            {/* Line */}
            <div className="w-[380px] h-[1px] bg-[#5227FF]/50 hidden lg:block ml-3 mt-[16px]" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-[90px]">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-[#1a0a2e] border-l-4 border-[#5227FF] p-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-[#B19EEF] font-sans text-sm mb-4 italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div>
                <h4 className="text-[#F9F9F9] font-sans font-semibold text-base">
                  {testimonial.name}
                </h4>
                <p className="text-[#FF9FFC] font-sans text-sm">
                  {testimonial.role} at {testimonial.company}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Testimonial Section */}
        <motion.div
          className="mt-12 ml-[90px]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {submitted && (
            <motion.div
              className="mb-4 p-4 bg-[#5227FF]/20 border border-[#5227FF] text-[#F9F9F9] text-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              Thank you for your testimonial!
            </motion.div>
          )}

          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-[#5227FF] text-[#F9F9F9] font-sans font-semibold text-sm hover:bg-[#6B3FFF] transition-colors"
            >
              Add Your Testimonial
            </button>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              className="bg-[#1a0a2e] border-l-4 border-[#5227FF] p-6 max-w-xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-[#F9F9F9] font-sans font-semibold text-lg mb-4">
                Share Your Experience
              </h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-[#B19EEF] font-sans text-sm mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-[#0f0520] border border-[#5227FF]/50 text-[#F9F9F9] font-sans text-sm focus:outline-none focus:border-[#5227FF] transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="role" className="block text-[#B19EEF] font-sans text-sm mb-1">
                      Role *
                    </label>
                    <input
                      type="text"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-[#0f0520] border border-[#5227FF]/50 text-[#F9F9F9] font-sans text-sm focus:outline-none focus:border-[#5227FF] transition-colors"
                      placeholder="Your role"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-[#B19EEF] font-sans text-sm mb-1">
                      Company *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-[#0f0520] border border-[#5227FF]/50 text-[#F9F9F9] font-sans text-sm focus:outline-none focus:border-[#5227FF] transition-colors"
                      placeholder="Company name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="text" className="block text-[#B19EEF] font-sans text-sm mb-1">
                    Your Testimonial *
                  </label>
                  <textarea
                    id="text"
                    name="text"
                    value={formData.text}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 bg-[#0f0520] border border-[#5227FF]/50 text-[#F9F9F9] font-sans text-sm focus:outline-none focus:border-[#5227FF] transition-colors resize-none"
                    placeholder="Share your experience working with Maria..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#5227FF] text-[#F9F9F9] font-sans font-semibold text-sm hover:bg-[#6B3FFF] transition-colors"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setFormData({ name: "", role: "", company: "", text: "" });
                    }}
                    className="px-6 py-2 bg-transparent border border-[#5227FF]/50 text-[#B19EEF] font-sans font-semibold text-sm hover:border-[#5227FF] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
