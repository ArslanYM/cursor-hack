"use client";

export function BenefitsSection() {
  return (
    <section id="benefits" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-kv-text mb-4 tracking-tight">
            Why Choose KisanVoice?
          </h2>
          <p className="text-lg text-kv-text-muted max-w-2xl mx-auto">
            Transform your farming operations with AI-powered insights designed specifically for Kashmir&apos;s agricultural landscape.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
          {/* Benefit 1 */}
          <div className="flex gap-4 sm:gap-6">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-kv-primary/20 text-kv-primary">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-kv-text mb-2">Instant Market Intelligence</h3>
              <p className="text-kv-text-muted">Get real-time mandi prices instantly. No more outdated information or guesswork when selling your produce.</p>
            </div>
          </div>

          {/* Benefit 2 */}
          <div className="flex gap-4 sm:gap-6">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-kv-primary/20 text-kv-primary">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-kv-text mb-2">Smart Recommendations</h3>
              <p className="text-kv-text-muted">AI analyzes weather, soil conditions, and market trends to suggest the best crops and timing for maximum yield.</p>
            </div>
          </div>

          {/* Benefit 3 */}
          <div className="flex gap-4 sm:gap-6">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-kv-primary/20 text-kv-primary">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-kv-text mb-2">Maximize Your Income</h3>
              <p className="text-kv-text-muted">Make data-driven decisions to improve productivity, reduce losses, and increase profitability year-round.</p>
            </div>
          </div>

          {/* Benefit 4 */}
          <div className="flex gap-4 sm:gap-6">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-kv-primary/20 text-kv-primary">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-kv-text mb-2">Always Available</h3>
              <p className="text-kv-text-muted">Access KisanVoice 24/7, even with poor connectivity. Works offline and syncs when you&apos;re back online.</p>
            </div>
          </div>

          {/* Benefit 5 */}
          <div className="flex gap-4 sm:gap-6">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-kv-primary/20 text-kv-primary">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-kv-text mb-2">Local & Relevant</h3>
              <p className="text-kv-text-muted">Specifically designed for Kashmir&apos;s climate, crops, and farming practices. Get information that matters to you.</p>
            </div>
          </div>

          {/* Benefit 6 */}
          <div className="flex gap-4 sm:gap-6">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-kv-primary/20 text-kv-primary">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-kv-text mb-2">Free to Start</h3>
              <p className="text-kv-text-muted">No subscription required. Start getting market insights and farming recommendations immediately for free.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
