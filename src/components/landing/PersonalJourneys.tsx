"use client";

import { Quote, MapPin } from "lucide-react";

export function PersonalJourneys() {
  const farmers = [
    {
      name: "Rashid Ahmed",
      location: "Srinagar, Kashmir",
      crop: "Saffron & Apples",
      story: "For 30 years, Rashid sold his apples to middlemen who dictated prices. He'd harvest 50 kg and get ₹8 per kg—sometimes less. The same apples sold for ₹25 in Delhi markets. He never knew.",
      transformation: "Now, Rashid checks mandi prices in Kashmiri before harvest. He found direct buyers in Bangalore paying ₹18. This season: ₹9 lakhs instead of ₹4 lakhs. His son is back in school.",
      statistic: "125% income increase",
    },
    {
      name: "Priya Sharma",
      location: "Haryana",
      crop: "Wheat & Cotton",
      story: "Priya manages 5 acres while raising three children. Every morning at 5 AM, the broker would call with a take-it-or-leave-it price. She had no way to verify. No time to negotiate. No options.",
      transformation: "Now she can ask KisanVoice in Hindi about daily prices while doing other chores. She's learned market patterns. She sells strategically. Her profit margins have doubled.",
      statistic: "2x profit margins",
    },
    {
      name: "Vikram Singh",
      location: "Punjab",
      crop: "Rice & Vegetables",
      story: "Vikram is 26 and inheriting his family farm. But young farmers are leaving—the work isn't valued, technology feels foreign, and incomes are unpredictable. He almost quit.",
      transformation: "With a voice-first tool in his language, farming became smart, modern, and fair. He's not just continuing his father's legacy—he's building something better. His income is stable. His future is real.",
      statistic: "Youth farming adoption",
    },
  ];

  return (
    <section className="relative w-full py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-kv-bg via-kv-primary/3 to-kv-bg">
      <div className="max-w-6xl mx-auto">
        {/* Section intro */}
        <div className="text-center space-y-6 mb-20">
          <p className="text-sm uppercase tracking-widest text-kv-primary font-semibold">
            Real Stories
          </p>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-kv-text text-balance">
            Lives transformed.
          </h2>
          
          <p className="text-lg text-kv-text/70 max-w-3xl mx-auto leading-relaxed">
            These aren&apos;t case studies. They&apos;re neighbors. Friends. People we know. Here&apos;s what changed for them.
          </p>
        </div>

        {/* Farmer stories */}
        <div className="space-y-8 lg:space-y-12">
          {farmers.map((farmer, idx) => (
            <div
              key={idx}
              className="group relative rounded-3xl overflow-hidden bg-white/50 dark:bg-kv-text/5 border border-kv-accent/20 hover:border-kv-primary/40 transition-all duration-300 hover:shadow-xl"
            >
              <div className="grid md:grid-cols-2 gap-0">
                {/* Left: Before story */}
                <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center border-r border-kv-accent/10">
                  <div className="mb-6">
                    <p className="text-sm uppercase tracking-widest text-kv-text/50 font-semibold mb-4">Before</p>
                    <h3 className="text-2xl sm:text-3xl font-bold text-kv-text mb-4">{farmer.name}</h3>
                    <div className="flex items-center gap-2 text-kv-text/70 mb-6">
                      <MapPin className="w-4 h-4" />
                      <span>{farmer.location}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="inline-block">
                      <Quote className="w-6 h-6 text-kv-primary/40" />
                    </div>
                    <p className="text-lg leading-relaxed text-kv-text/80 italic">
                      {farmer.story}
                    </p>
                  </div>
                </div>

                {/* Right: After transformation */}
                <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-kv-primary/10 to-kv-accent/5">
                  <div className="mb-6">
                    <p className="text-sm uppercase tracking-widest text-kv-primary font-semibold mb-4">After</p>
                    <h3 className="text-2xl sm:text-3xl font-bold text-kv-text mb-4">The Change</h3>
                  </div>

                  <div className="space-y-6">
                    <p className="text-lg leading-relaxed text-kv-text">
                      {farmer.transformation}
                    </p>

                    {/* Statistic highlight */}
                    <div className="pt-6 border-t border-kv-primary/20">
                      <p className="text-sm text-kv-text/70 mb-2">Impact:</p>
                      <p className="text-3xl font-bold text-kv-primary">{farmer.statistic}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Connect statement */}
        <div className="mt-16 sm:mt-20 text-center">
          <p className="text-xl sm:text-2xl text-kv-text/70 leading-relaxed">
            These transformations aren&apos;t unique. They&apos;re happening across Kashmir, Punjab, Haryana, Rajasthan. Every farmer who gets real-time information gains bargaining power. Every voice heard is another family lifted out of exploitation.
          </p>
        </div>
      </div>
    </section>
  );
}
