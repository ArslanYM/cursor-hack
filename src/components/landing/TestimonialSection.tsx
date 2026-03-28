"use client";

import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    quote:
      "For the first time in my 45 years of farming, I feel like I have equal information. The mandi prices come directly to me in Kashmiri. This app gave me back my power.",
    author: "Ghulam Rasool",
    location: "Anantnag, Kashmir",
    role: "Apple & Walnut Farmer",
  },
  {
    id: 2,
    quote:
      "My grandmother uses this more than I do. The voice interface means she can ask questions in her own language. She&apos;s 68 and finally feels included in modern agriculture.",
    author: "Neha Patel",
    location: "Ahmedabad, Gujarat",
    role: "Cotton Farmer & Mentor",
  },
  {
    id: 3,
    quote:
      "The offline feature saved me. I was in a field with no signal, but I could still access yesterday&apos;s prices and weather forecast. That knowledge got me ₹8,000 extra that day.",
    author: "Harpreet Singh",
    location: "Jalandhar, Punjab",
    role: "Wheat Farmer",
  },
  {
    id: 4,
    quote:
      "What impressed me most? They asked us first. They didn&apos;t assume. They listened to what we actually needed, not what they thought was good for us.",
    author: "Anita Kumar",
    location: "Mathura, Uttar Pradesh",
    role: "Dairy & Crop Farmer",
  },
];

export function TestimonialSection() {
  return (
    <section className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-kv-bg">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-sm font-semibold text-kv-primary uppercase tracking-wider">
            In Their Words
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-kv-text text-pretty">
            What Farmers Are Saying
          </h2>
          <p className="text-lg text-kv-text/70 max-w-2xl mx-auto">
            These are unfiltered, authentic voices from the people using KisanVoice every day.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="relative group bg-white/50 dark:bg-kv-bg-secondary rounded-lg p-8 border border-kv-accent/20 hover:border-kv-primary/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              {/* Quote Mark Background */}
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg
                  className="w-16 h-16 text-kv-primary"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-4.5-5-7-5zm0 0h3l7 8c0 7-4 11-7 11v-2c2 0 3-3 3-6V7c0-4.5-1-6-3-6h-3z" />
                </svg>
              </div>

              <div className="relative">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-kv-primary text-kv-primary"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-lg leading-relaxed text-kv-text mb-6 italic">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="pt-6 border-t border-kv-accent/20">
                  <p className="font-bold text-kv-text">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-kv-text/60 mb-1">
                    {testimonial.role}
                  </p>
                  <p className="text-xs text-kv-text/50">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg text-kv-text/80 mb-4">
            Ready to join thousands of farmers transforming their futures?
          </p>
          <p className="text-sm text-kv-text/60 max-w-2xl mx-auto">
            Your story matters. Your voice deserves to be heard. Let&apos;s grow together.
          </p>
        </div>
      </div>
    </section>
  );
}
