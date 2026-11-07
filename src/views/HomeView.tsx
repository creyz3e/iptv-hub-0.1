import React, { useState } from 'react';
import {
  ArrowRight,
  Tv,
  CheckCircle2,
  Search,
} from 'lucide-react';
import { AppLink } from '../components/Layout';
import { PricingSection } from '../components/PricingSection';
import { FaqAccordion } from '../components/FaqAccordion';
import {
  DEVICE_GUIDES,
  SETUP_TUTORIAL_GUIDES,
  IPTV_PLAYERS_CATALOG,
  FAQ_CATALOG,
} from '../lib/content';
import { useApp } from '../context/AppContext';

export const HomeView: React.FC = () => {
  const { publishedArticles } = useApp();
  const [selectedDeviceSlug, setSelectedDeviceSlug] = useState<string>('fire-tv');
  const [faqQuery, setFaqQuery] = useState<string>('');

  const activeDevice =
    DEVICE_GUIDES.find((d) => d.slug === selectedDeviceSlug) ?? DEVICE_GUIDES[0];

  const filteredFaqs = FAQ_CATALOG.filter(
    (item) =>
      item.question.toLowerCase().includes(faqQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(faqQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(faqQuery.toLowerCase())
  );

  return (
    <div className="space-y-2">
      {/* HERO SECTION — Targeting primary keyword "IPTV Subscription" */}
      <section className="border-b border-zinc-200 bg-white pt-10 pb-14 sm:pt-16 sm:pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Primary Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <p className="text-xs sm:text-sm font-semibold text-blue-600">
                Works on Smart TVs, FireStick &amp; Apple TV · 4-Hour Free Trial Available
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-zinc-900 tracking-tight leading-[1.12] font-display">
                IPTV Subscription for Smart TVs, FireStick &amp; Streaming Devices
              </h1>

              <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-xl">
                Watch on your Smart TV, Amazon FireStick, Apple TV, Android TV, or phone in minutes. Choose a flexible plan starting at{' '}
                <strong className="text-zinc-900">$10 for 1 month</strong> or{' '}
                <strong className="text-zinc-900">$50 for a full year</strong>—or test it on your TV first with our{' '}
                <strong className="text-zinc-900">free 4-hour trial</strong>.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <AppLink
                  href="/pricing"
                  className="px-6 py-3.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 shadow-xs"
                >
                  <span>View Plans &amp; Pricing ($10/mo)</span>
                  <ArrowRight className="w-4 h-4" />
                </AppLink>

                <AppLink
                  href="/free-trial"
                  className="px-6 py-3.5 rounded-xl text-sm font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-900 inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Try Free for 4 Hours ($0)</span>
                </AppLink>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-zinc-500">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Setup takes 3 minutes</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>No automatic monthly charges</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>1-Screen &amp; 3-Screen Family Plans</span>
                </span>
              </div>
            </div>

            {/* Right Column: Visual "How Your IPTV Subscription Works" Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-zinc-200 bg-[#FAFAFA] p-6 sm:p-7 space-y-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                  <div>
                    <p className="text-xs font-medium text-blue-600">3-Minute TV Setup</p>
                    <h2 className="text-lg font-bold text-zinc-900 font-display">
                      How Your IPTV Subscription Works
                    </h2>
                  </div>
                  <Tv className="w-6 h-6 text-blue-600 shrink-0" />
                </div>

                <ol className="space-y-4">
                  <li className="flex items-start gap-3.5">
                    <span className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-bold text-zinc-900">
                        Pick a Plan or Free 4-Hour Trial
                      </h3>
                      <p className="text-xs text-zinc-600 leading-relaxed">
                        Start with 1 Month ($10), 12 Months ($50), our 3-TV Family Plan ($120), or test free for up to 4 hours.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3.5">
                    <span className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-bold text-zinc-900">
                        Open Any TV Player App
                      </h3>
                      <p className="text-xs text-zinc-600 leading-relaxed">
                        Download a compatible player app like IPTV Smarters Pro, TiviMate, or IBO Player on your TV or FireStick.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3.5">
                    <span className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-bold text-zinc-900">
                        Enter Your Login &amp; Watch
                      </h3>
                      <p className="text-xs text-zinc-600 leading-relaxed">
                        Type in your subscription login details—your channels and TV guide load automatically.
                      </p>
                    </div>
                  </li>
                </ol>

                <div className="pt-4 border-t border-zinc-200 space-y-2.5">
                  <p className="text-xs font-semibold text-zinc-700">
                    Select your TV to view setup instructions:
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <AppLink
                      href="/devices/fire-tv"
                      className="p-2.5 rounded-xl border border-zinc-200 bg-white hover:border-blue-500 text-center transition-colors"
                    >
                      <div className="font-semibold text-zinc-900">FireStick</div>
                      <div className="text-[11px] text-zinc-500">Amazon TV</div>
                    </AppLink>
                    <AppLink
                      href="/devices/samsung-tv"
                      className="p-2.5 rounded-xl border border-zinc-200 bg-white hover:border-blue-500 text-center transition-colors"
                    >
                      <div className="font-semibold text-zinc-900">Samsung</div>
                      <div className="text-[11px] text-zinc-500">Smart TV</div>
                    </AppLink>
                    <AppLink
                      href="/devices/android-tv"
                      className="p-2.5 rounded-xl border border-zinc-200 bg-white hover:border-blue-500 text-center transition-colors"
                    >
                      <div className="font-semibold text-zinc-900">Google TV</div>
                      <div className="text-[11px] text-zinc-500">Android TV</div>
                    </AppLink>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4-Column Quick Highlights Bar */}
          <div className="mt-12 pt-8 border-t border-zinc-200/80 grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-zinc-500">Monthly Starter Plan</p>
              <p className="text-xl font-bold text-zinc-900 tabular-nums mt-0.5">
                $10 · 1 Month
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">1 Connection · Flexible monthly access</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Most Popular Annual Plan</p>
              <p className="text-xl font-bold text-blue-600 tabular-nums mt-0.5">
                $50 · 12 Months
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">$4.17/mo · Save $70 (58%)</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">3-Screen Family Bundle</p>
              <p className="text-xl font-bold text-zinc-900 tabular-nums mt-0.5">
                $120 · 12 Months
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">Watch on 3 TVs at the same time</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Test Before Buying</p>
              <p className="text-xl font-bold text-emerald-700 tabular-nums mt-0.5">
                Free 4-Hour Trial
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">No credit card required</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: PRICING PLANS */}
      <div className="border-b border-zinc-200">
        <PricingSection showFullComparisonTable={true} headingLevel="h2" />
      </div>

      {/* SECTION 2: Interactive TV & Device Setup Picker */}
      <section className="py-14 sm:py-20 border-b border-zinc-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Supported TVs &amp; Devices
              </p>
              <h2 className="text-3xl font-bold text-zinc-900 font-display tracking-tight">
                Set Up Your IPTV Subscription on Smart TVs, FireStick &amp; Apple TV
              </h2>
              <p className="text-base text-zinc-600 leading-relaxed">
                Select your television or streaming device below to see which player app to install and how to sign in.
              </p>
            </div>
            <AppLink
              href="/devices"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <span>View All Supported Devices</span>
              <ArrowRight className="w-4 h-4" />
            </AppLink>
          </div>

          {/* Device Tabs */}
          <div
            role="group"
            aria-label="Select device platform"
            className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-zinc-100 border border-zinc-200"
          >
            {DEVICE_GUIDES.map((dev) => (
              <button
                key={dev.slug}
                type="button"
                onClick={() => setSelectedDeviceSlug(dev.slug)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedDeviceSlug === dev.slug
                    ? 'bg-white text-zinc-900 font-semibold shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {dev.shortName}
              </button>
            ))}
          </div>

          {/* Selected Device Card */}
          <div className="rounded-2xl border border-zinc-200 bg-[#FAFAFA] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-5">
              <div className="space-y-2">
                <p className="text-xs font-medium text-blue-600">
                  {activeDevice.osName}
                </p>
                <h3 className="text-2xl font-bold text-zinc-900 font-display">
                  {activeDevice.name}
                </h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  {activeDevice.summary}
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-zinc-200 text-xs sm:text-sm text-zinc-600">
                <p>
                  <strong className="text-zinc-900">Recommended Apps:</strong>{' '}
                  {activeDevice.recommendedPlayers.join(' · ')}
                </p>
                <p>
                  <strong className="text-zinc-900">Where to Download:</strong>{' '}
                  {activeDevice.appStoreMethod}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <AppLink
                  href={`/devices/${activeDevice.slug}`}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Full {activeDevice.shortName} Setup Guide</span>
                  <ArrowRight className="w-4 h-4" />
                </AppLink>
                <AppLink
                  href="/free-trial"
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-800 transition-colors whitespace-nowrap shrink-0"
                >
                  Try 4 Hours Free on {activeDevice.shortName}
                </AppLink>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-3 border-t lg:border-t-0 lg:border-l border-zinc-200 pt-6 lg:pt-0 lg:pl-8">
              <h4 className="text-sm font-bold text-zinc-900">
                {activeDevice.shortName} Setup Steps:
              </h4>
              <ol className="space-y-3">
                {activeDevice.setupSteps.map((st) => (
                  <li key={st.stepNumber} className="text-xs sm:text-sm text-zinc-600 space-y-0.5">
                    <div className="font-semibold text-zinc-900">
                      Step {st.stepNumber}: {st.title}
                    </div>
                    <p className="text-zinc-600 leading-relaxed">{st.detail}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: IPTV Smarters Pro & Player Explanation */}
      <section className="py-14 sm:py-20 border-b border-zinc-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Works With IPTV Smarters Pro, TiviMate &amp; IBO Player
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 font-display">
                Using Your IPTV Subscription with IPTV Smarters Pro or TiviMate
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
                Many viewers searching for an <strong className="text-zinc-900">IPTV Smarters Pro subscription</strong> wonder why the app is empty when they first open it. Apps like IPTV Smarters Pro, TiviMate, and IBO Player are standalone <strong className="text-zinc-900">video players</strong>—they do not include any channels on their own.
              </p>
              <p className="text-sm text-zinc-600 leading-relaxed">
                When you order an <strong className="text-zinc-900">IPTV subscription</strong>, you receive the login details (Xtream Codes or M3U link) that you enter into those player apps to load your channels and TV guide.
              </p>
              <p className="text-xs text-zinc-400">
                Note: Lumiq TV is an independent subscription provider and is not affiliated with IPTV Smarters Pro or any third-party app developer.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <AppLink
                  href="/iptv-smarters-pro-subscription"
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                >
                  <span>IPTV Smarters Pro Setup Guide</span>
                  <ArrowRight className="w-4 h-4" />
                </AppLink>
                <AppLink
                  href="/iptv-players"
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-900 transition-colors whitespace-nowrap shrink-0"
                >
                  Compare Compatible Player Apps
                </AppLink>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-3">
              {IPTV_PLAYERS_CATALOG.slice(0, 3).map((player) => (
                <div
                  key={player.id}
                  className="p-4 rounded-xl border border-zinc-200 bg-[#FAFAFA] space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-zinc-900">{player.name}</h3>
                    <span className="text-xs font-medium text-blue-600">
                      Compatible
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600">{player.bestFor}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Setup Guides & Blog Resources */}
      <section className="py-14 sm:py-20 border-b border-zinc-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Setup Tutorials &amp; Buyer Resources
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 font-display">
                IPTV Setup Guides &amp; Streaming Articles
              </h2>
            </div>
            <div className="flex items-center gap-4 text-xs sm:text-sm font-semibold">
              <AppLink href="/guides" className="text-blue-600 hover:text-blue-700">
                All Setup Guides →
              </AppLink>
              <AppLink href="/blog" className="text-zinc-600 hover:text-zinc-900">
                All Blog Articles →
              </AppLink>
            </div>
          </div>

          {/* 3 Setup Tutorial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SETUP_TUTORIAL_GUIDES.map((guide) => (
              <article
                key={guide.slug}
                className="rounded-2xl border border-zinc-200 bg-[#FAFAFA] p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <p className="text-xs font-medium text-blue-600">
                    {guide.category} · {guide.readingTime}
                  </p>
                  <h3 className="text-lg font-bold text-zinc-900 font-display leading-snug">
                    <AppLink
                      href={`/guides/${guide.slug}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {guide.title}
                    </AppLink>
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    {guide.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-200/80 flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Step-by-step guide</span>
                  <AppLink
                    href={`/guides/${guide.slug}`}
                    className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </AppLink>
                </div>
              </article>
            ))}
          </div>

          {/* 3 Latest Blog Articles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {publishedArticles.slice(0, 3).map((article) => (
              <article
                key={article.articleId}
                className="rounded-2xl border border-zinc-200 bg-white p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <p className="text-xs text-zinc-500">
                    {article.category} · {article.readingTime}
                  </p>
                  <h3 className="text-base font-bold text-zinc-900 font-display leading-snug">
                    <AppLink
                      href={`/blog/${article.slug}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {article.title}
                    </AppLink>
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                  <span>Updated {article.lastUpdated}</span>
                  <AppLink
                    href={`/blog/${article.slug}`}
                    className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </AppLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: Searchable Frequently Asked Questions */}
      <section className="py-14 sm:py-20 border-b border-zinc-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Help &amp; Answers
              </p>
              <h2 className="text-3xl font-bold text-zinc-900 font-display tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="relative w-full sm:w-72">
              <label htmlFor="home-faq-search" className="sr-only">
                Search Frequently Asked Questions
              </label>
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="home-faq-search"
                type="search"
                value={faqQuery}
                onChange={(e) => setFaqQuery(e.target.value)}
                placeholder="Search price, trial, TV setup..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-zinc-200 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <FaqAccordion
            items={filteredFaqs}
            searchQuery={faqQuery}
            onResetSearch={() => setFaqQuery('')}
          />

          <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
            <span>Click any question above to expand its answer.</span>
            <AppLink href="/faq" className="font-semibold text-blue-600 hover:underline">
              View Full FAQ &amp; Help Center →
            </AppLink>
          </div>
        </div>
      </section>

      {/* SECTION 6: Final Call to Action */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-zinc-200 bg-[#FAFAFA] p-8 sm:p-12 text-center space-y-5">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 font-display max-w-xl mx-auto">
              Choose Your IPTV Subscription Plan Today
            </h2>
            <p className="text-base text-zinc-600 max-w-lg mx-auto leading-relaxed">
              Start with $10 for 1 month, get a full year for $50, or test on your TV first with our 4-hour free trial.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <AppLink
                href="/pricing"
                className="px-6 py-3.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 shadow-xs"
              >
                <span>View All Plans ($10–$140)</span>
                <ArrowRight className="w-4 h-4" />
              </AppLink>
              <AppLink
                href="/free-trial"
                className="px-6 py-3.5 rounded-xl text-sm font-semibold bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-200 inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
              >
                <span>Request 4-Hour Free Trial</span>
              </AppLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
