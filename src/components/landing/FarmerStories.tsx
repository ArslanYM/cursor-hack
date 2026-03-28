"use client";

import { Wheat, MapPin, Users2 } from "lucide-react";

const stories = [
  {
    id: 1,
    name: "Rashid Ahmed",
    location: "Srinagar, Kashmir",
    crop: "Saffron & Apple",
    story:
      "For 30 years, I've relied on word-of-mouth for market prices. Now, with voice commands in Kashmiri, I get real-time mandi updates without leaving my fields. My yields have improved because I know exactly when to harvest and sell.",
    impact: "45% better pricing",
    icon: Wheat,
  },
  {
    id: 2,
    name: "Priya Sharma",
    location: "Haryana, India",
    crop: "Wheat & Cotton",
    story:
      "As a woman farmer, I faced barriers accessing agricultural information. The voice interface in Hindi has given me independence to make my own decisions. Now I'm mentoring 15 other women farmers in my village.",
    impact: "15 women empowered",
    icon: Users2,
  },
  {
    id: 3,
    name: "Vikram Singh",
    location: "Punjab, India",
    crop: "Rice & Maize",
    story:
      "Weather forecasts in my language mean I can plan irrigation better. Last season, I saved ₹60,000 by avoiding a pest outbreak I was warned about. Technology should speak my language, not the other way around.",
    impact: "₹60,000 saved",
    icon: MapPin,
  },
];

export function FarmerStories() {
  return (
    <section className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-kv-bg">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-sm font-semibold text-kv-primary uppercase tracking-wider">
            Real Stories, Real Impact
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-kv-text text-pretty">
            Meet the Farmers Transforming Agriculture
          </h2>
          <p className="text-lg text-kv-text/70 max-w-2xl mx-auto">
            These are not just customers. These are innovators, mentors, and leaders in their communities.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {stories.map((story) => {
            const IconComponent = story.icon;
            return (
              <div
                key={story.id}
                className="group relative bg-white/50 dark:bg-kv-bg-secondary rounded-xl p-8 border border-kv-accent/20 hover:border-kv-accent/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Icon */}
                <div className="w-12 h-12 bg-kv-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-kv-primary/20 transition-colors">
                  <IconComponent className="w-6 h-6 text-kv-primary" />
                </div>

                {/* Farmer Info */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-kv-text mb-1">
                    {story.name}
                  </h3>
                  <p className="text-sm text-kv-text/60 mb-3">
                    {story.location}
                  </p>
                  <div className="inline-block px-3 py-1 bg-kv-primary/10 rounded-full text-sm text-kv-primary font-medium">
                    {story.crop}
                  </div>
                </div>

                {/* Story */}
                <p className="text-kv-text/80 leading-relaxed mb-6 text-sm">
                  {story.story}
                </p>

                {/* Impact Badge */}
                <div className="pt-6 border-t border-kv-accent/20">
                  <p className="text-xs text-kv-text/60 uppercase tracking-wide mb-2">
                    Direct Impact
                  </p>
                  <p className="text-lg font-bold text-kv-primary">
                    {story.impact}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
