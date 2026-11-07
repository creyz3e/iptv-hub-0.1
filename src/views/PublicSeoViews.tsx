import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  Search,
  Send,
} from 'lucide-react';
import { AppLink } from '../components/Layout';
import { PricingSection } from '../components/PricingSection';
import { FaqAccordion } from '../components/FaqAccordion';
import {
  FREE_TRIAL_CONFIG,
  SUPPORTED_DEVICES,
  SUPPORTED_PLAYERS,
  SINGLE_CONNECTION_PLANS,
  MULTI_CONNECTION_BUNDLE,
  formatUsdFromCents,
} from '../lib/pricing';
import {
  DEVICE_GUIDES,
  SETUP_TUTORIAL_GUIDES,
  IPTV_PLAYERS_CATALOG,
  FAQ_CATALOG,
  INITIAL_EDITORIAL_ARTICLES,
  LEGAL_DOCUMENTS_CATALOG,
} from '../lib/content';
import { useApp } from '../context/AppContext';

export const PricingView: React.FC = () => {
  return (
    <div className="space-y-10 pb-16">
      <PricingSection showFullComparisonTable={true} headingLevel="h1" />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-10 space-y-6">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              How to Choose the Right Plan
            </p>
            <h2 className="text-2xl font-bold text-zinc-900 font-display">
              Comparing Monthly, Yearly &amp; Family IPTV Subscription Plans
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-zinc-600 leading-relaxed">
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-zinc-900 font-display">
                1 Month ($10) to 6 Months ($30)
              </h3>
              <p>
                Ideal if you prefer short-term access without a long commitment. The 3-month plan ($20) lowers your cost to $6.67/mo, and the 6-month plan ($30) brings it down to $5.00/mo.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-zinc-900 font-display">
                12 Months ($50) to 48 Months ($140)
              </h3>
              <p>
                Our 12-month plan ($50, or $4.17/mo) is our most popular choice. You can also lock in 24 months ($90), 36 months ($120), or 48 months ($140 — just $2.92/mo).
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-zinc-900 font-display">
                3-TV Family Plan ($120) &amp; Fixed-Term Policy
              </h3>
              <p>
                Watching on multiple TVs at once? Pick our 3 Connections × 12 Months plan for $120. We never sell risky "lifetime" plans—only transparent fixed durations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export const FreeTrialView: React.FC = () => {
  const { profile, trialRequests, submitTrialRequest } = useApp();
  const [customerEmail, setCustomerEmail] = useState<string>(profile?.email || '');
  const [deviceType, setDeviceType] = useState<string>(SUPPORTED_DEVICES[0]);
  const [playerApp, setPlayerApp] = useState<string>(SUPPORTED_PLAYERS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [createdTrialId, setCreatedTrialId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const res = await submitTrialRequest({
        customerEmail,
        deviceType,
        playerApp,
      });
      setCreatedTrialId(res.trial.trialId);
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to submit trial request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Trial Explanation */}
        <div className="lg:col-span-7 space-y-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Try Before You Buy · {FREE_TRIAL_CONFIG.label} · $0
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-zinc-900 font-display tracking-tight">
            Request a 4-Hour IPTV Free Trial
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 leading-relaxed">
            Test our IPTV subscription on your Smart TV, FireStick, or Apple TV before choosing a paid plan. No credit card is required.
          </p>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4">
            <h2 className="text-lg font-bold text-zinc-900 font-display">
              How the 4-Hour Free Trial Works
            </h2>
            <ol className="space-y-3 text-sm text-zinc-600">
              <li>
                <strong className="text-zinc-900">1. Up to 4 Hours of Access:</strong> Test live playback and the TV guide on 1 device.
              </li>
              <li>
                <strong className="text-zinc-900">2. Just Your Email &amp; TV Type:</strong> Tell us your email and which TV/app you use so we send the matching setup guide.
              </li>
              <li>
                <strong className="text-zinc-900">3. Quick Review &amp; Activation:</strong> To prevent automated spam bots, our team reviews each request and activates your 4-hour window. Check your status anytime in <AppLink href="/account" className="text-blue-600 underline">My Account</AppLink>.
              </li>
              <li>
                <strong className="text-zinc-900">4. No Automatic Charges:</strong> When the 4 hours finish, the trial ends automatically. If you're ready to subscribe, you can pick any plan starting at $10 on our <AppLink href="/pricing" className="text-blue-600 underline">Plans &amp; Pricing</AppLink> page.
              </li>
            </ol>
          </div>

          {trialRequests.length > 0 && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-zinc-900 font-display">
                  Your Trial Requests
                </h2>
                <AppLink href="/account" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                  Go to My Account →
                </AppLink>
              </div>
              <div className="space-y-3">
                {trialRequests.map((tr) => (
                  <div
                    key={tr.trialId}
                    className="p-4 rounded-xl border border-zinc-200 bg-[#FAFAFA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="text-zinc-900 font-semibold">
                        {tr.trialId} · {tr.customerEmail}
                      </div>
                      <div className="text-zinc-500">
                        {tr.deviceType} · {tr.playerApp} · Up to {tr.durationHours} Hours
                      </div>
                    </div>
                    <div className="font-semibold text-blue-700 shrink-0">
                      Status: {tr.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Request Form */}
        <div className="lg:col-span-5 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-1 border-b border-zinc-100 pb-4">
            <h2 className="text-xl font-bold text-zinc-900 font-display">
              Request Your Free Trial
            </h2>
            <p className="text-xs text-zinc-500">
              Up to 4 hours · 1 TV / Device · No credit card needed
            </p>
          </div>

          {createdTrialId && (
            <div
              role="status"
              className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-xs sm:text-sm text-emerald-900 space-y-1.5"
            >
              <div className="font-bold">
                Trial Request {createdTrialId} Received!
              </div>
              <p>
                We logged your 4-hour trial request for <strong>{customerEmail}</strong>. You can check its status anytime in <AppLink href="/account" className="underline font-semibold text-emerald-950">My Account</AppLink>.
              </p>
            </div>
          )}

          {errorMsg && (
            <div
              role="alert"
              className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-xs sm:text-sm text-rose-800"
            >
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="trial-email" className="block text-xs font-semibold text-zinc-800">
                Your Email Address
              </label>
              <input
                id="trial-email"
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-300 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="trial-device" className="block text-xs font-semibold text-zinc-800">
                Which TV or Device Will You Use?
              </label>
              <select
                id="trial-device"
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-300 text-sm text-zinc-900 focus:outline-none focus:border-blue-600"
              >
                {SUPPORTED_DEVICES.map((dev) => (
                  <option key={dev} value={dev}>
                    {dev}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="trial-player" className="block text-xs font-semibold text-zinc-800">
                Preferred Player App
              </label>
              <select
                id="trial-player"
                value={playerApp}
                onChange={(e) => setPlayerApp(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-300 text-sm text-zinc-900 focus:outline-none focus:border-blue-600"
              >
                {SUPPORTED_PLAYERS.map((pl) => (
                  <option key={pl} value={pl}>
                    {pl}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap cursor-pointer"
            >
              <span>{submitting ? 'Sending Request...' : 'Start Free 4-Hour Trial'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-zinc-100 text-xs text-zinc-500">
            Ready to pick a full plan instead?{' '}
            <AppLink href="/pricing" className="text-blue-600 hover:underline font-semibold">
              View Plans ($10–$140)
            </AppLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SmartersProLandingView: React.FC = () => {
  const { navigate, setSelectedCheckoutPlanId } = useApp();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-8 space-y-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Works With IPTV Smarters Pro
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-zinc-900 font-display tracking-tight">
            IPTV Smarters Pro Subscription &amp; TV Setup Guide
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 leading-relaxed">
            Looking for an <strong className="text-zinc-900">IPTV Smarters Pro subscription</strong>? Here is how it works: <strong className="text-zinc-900">IPTV Smarters Pro</strong> is a free video player app you download on your TV, and your <strong className="text-zinc-900">IPTV subscription</strong> provides the login details you enter into the app to watch channels.
          </p>

          <div className="flex flex-wrap items-center gap-3.5">
            <AppLink
              href="/pricing"
              className="px-5 py-3 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <span>Choose a Plan ($10/mo)</span>
              <ArrowRight className="w-4 h-4" />
            </AppLink>
            <AppLink
              href="/free-trial"
              className="px-5 py-3 rounded-xl text-sm font-semibold bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-200 transition-colors whitespace-nowrap"
            >
              Try 4 Hours Free
            </AppLink>
            <AppLink
              href="/guides/iptv-smarters-pro-setup"
              className="px-4 py-3 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap"
            >
              Step-by-Step Setup Guide →
            </AppLink>
          </div>
        </div>

        <div className="lg:col-span-4 rounded-2xl border border-zinc-200 bg-white p-6 space-y-3">
          <h2 className="text-sm font-bold text-zinc-900 font-display">
            Good to Know
          </h2>
          <p className="text-xs text-zinc-600 leading-relaxed">
            <strong>IPTV Smarters Pro</strong> is an independent app developed by its own creators. Lumiq TV is not affiliated with IPTV Smarters Pro—our IPTV subscription plans provide standard login credentials (Xtream Codes &amp; M3U) that work inside the app.
          </p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-5">
        <h2 className="text-2xl font-bold text-zinc-900 font-display">
          The Player App vs. Your IPTV Subscription
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-xs text-zinc-500 bg-zinc-50">
                <th className="py-3 px-4 font-semibold">Feature</th>
                <th className="py-3 px-4 font-semibold">IPTV Smarters Pro (The App)</th>
                <th className="py-3 px-4 font-semibold">IPTV Subscription (Lumiq TV)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs sm:text-sm text-zinc-600">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-zinc-900">What It Does</td>
                <td className="py-3.5 px-4">Plays video &amp; displays the TV guide on your screen</td>
                <td className="py-3.5 px-4">Provides your login details, channels &amp; TV guide data</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-zinc-900">Has Channels Built-In?</td>
                <td className="py-3.5 px-4">No — the app is empty until you sign in</td>
                <td className="py-3.5 px-4">Yes — unlocks everything as soon as your order is active</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-zinc-900">Price</td>
                <td className="py-3.5 px-4">Free download on most TV app stores</td>
                <td className="py-3.5 px-4">$10 (1 Mo) to $140 (48 Mo) · $120 for 3 TVs (12 Mo)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Plan Cards */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 font-display">
              Pick an IPTV Subscription Plan for Smarters Pro
            </h2>
            <p className="text-sm text-zinc-600">
              Every plan below gives you Xtream Codes &amp; M3U login details once verified.
            </p>
          </div>
          <AppLink href="/guides/iptv-smarters-pro-not-working" className="text-xs font-semibold text-blue-600 hover:underline">
            App not working? See 7 quick fixes →
          </AppLink>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[SINGLE_CONNECTION_PLANS[0], SINGLE_CONNECTION_PLANS[1], SINGLE_CONNECTION_PLANS[3], MULTI_CONNECTION_BUNDLE].map((plan) => (
            <div key={plan.id} className="p-5 rounded-2xl border border-zinc-200 bg-white flex flex-col justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs text-zinc-500">
                  {plan.connections} {plan.connections > 1 ? 'TVs at Once' : 'TV / Device'} · {plan.durationMonths} Month{plan.durationMonths > 1 ? 's' : ''}
                </p>
                <h3 className="text-base font-bold text-zinc-900 font-display">{plan.name}</h3>
                <div className="text-2xl font-bold text-zinc-900 tabular-nums pt-1">
                  {formatUsdFromCents(plan.amountCents)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedCheckoutPlanId(plan.id);
                  navigate(`/checkout?plan=${encodeURIComponent(plan.id)}`);
                }}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
              >
                Select Plan ({formatUsdFromCents(plan.amountCents)})
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const PlayersHubView: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="max-w-3xl space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          Compatible TV Apps
        </p>
        <h1 className="text-3xl sm:text-5xl font-bold text-zinc-900 font-display tracking-tight">
          Best IPTV Player Apps for Your TV
        </h1>
        <p className="text-base text-zinc-600 leading-relaxed">
          You can use your IPTV subscription with any standard player app on Android TV, FireStick, Apple TV, Samsung, LG, or your computer. Here are the most popular apps our customers use:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {IPTV_PLAYERS_CATALOG.map((player) => (
          <div
            key={player.id}
            className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-blue-600">
                Supports: {player.protocols.join(' · ')}
              </p>
              <h2 className="text-xl font-bold text-zinc-900 font-display">{player.name}</h2>
              <p className="text-sm text-zinc-600 leading-relaxed">{player.bestFor}</p>
              <div className="pt-2 border-t border-zinc-100 space-y-1.5 text-xs text-zinc-500">
                <p>
                  <strong className="text-zinc-800">Works On:</strong> {player.platforms.join(', ')}
                </p>
                <p>
                  <strong className="text-zinc-800">TV Guide (EPG):</strong> {player.epgSupport}
                </p>
                <p>
                  <strong className="text-zinc-800">App Cost:</strong> {player.licenseModel}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
              <AppLink href="/guides/how-to-set-up-iptv" className="text-blue-600 hover:underline font-semibold">
                How to Set It Up →
              </AppLink>
              <AppLink href="/free-trial" className="text-zinc-600 hover:text-zinc-900 font-medium">
                Try 4 Hours Free
              </AppLink>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DevicesHubView: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="max-w-3xl space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          Supported TVs &amp; Devices
        </p>
        <h1 className="text-3xl sm:text-5xl font-bold text-zinc-900 font-display tracking-tight">
          IPTV Subscription Compatibility: Smart TVs &amp; Streaming Devices
        </h1>
        <p className="text-base text-zinc-600 leading-relaxed">
          Select your television or streaming device below to see which player app to download and how to get started in 3 steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DEVICE_GUIDES.map((dev) => (
          <div
            key={dev.slug}
            className="rounded-2xl border border-zinc-200 bg-white p-6 flex flex-col justify-between space-y-5"
          >
            <div className="space-y-2.5">
              <p className="text-xs font-medium text-blue-600">{dev.osName}</p>
              <h2 className="text-xl font-bold text-zinc-900 font-display">{dev.name}</h2>
              <p className="text-sm text-zinc-600 leading-relaxed">{dev.summary}</p>
              <p className="text-xs text-zinc-500">
                <strong className="text-zinc-800">Recommended Apps:</strong>{' '}
                {dev.recommendedPlayers.join(' · ')}
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-100">
              <AppLink
                href={`/devices/${dev.slug}`}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-blue-600 text-white inline-flex items-center justify-center gap-2 transition-colors"
              >
                <span>View {dev.shortName} Setup Steps</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </AppLink>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DeviceDetailView: React.FC<{ slug: string }> = ({ slug }) => {
  const device = DEVICE_GUIDES.find((d) => d.slug === slug);
  if (!device) {
    return <NotFoundView />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="space-y-3 border-b border-zinc-200 pb-8">
        <p className="text-xs font-semibold text-blue-600">
          {device.osName} · 3-Minute Setup Guide
        </p>
        <h1 className="text-3xl sm:text-5xl font-bold text-zinc-900 font-display tracking-tight">
          {device.primaryKeyword}: Setup &amp; Player Guide
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 leading-relaxed">{device.summary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-zinc-200 bg-white space-y-1">
          <p className="text-xs text-zinc-500">How to Get the App</p>
          <p className="text-sm font-semibold text-zinc-900">{device.appStoreMethod}</p>
        </div>
        <div className="p-5 rounded-2xl border border-zinc-200 bg-white space-y-1">
          <p className="text-xs text-zinc-500">Recommended Player Apps</p>
          <p className="text-sm font-semibold text-zinc-900">{device.recommendedPlayers.join(' · ')}</p>
        </div>
        <div className="p-5 rounded-2xl border border-zinc-200 bg-white space-y-1">
          <p className="text-xs text-zinc-500">Recommended Internet Speed</p>
          <p className="text-sm font-semibold text-zinc-900">{device.networkRequirements}</p>
        </div>
      </div>

      {/* Step-by-Step Setup Instructions */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-6">
        <h2 className="text-2xl font-bold text-zinc-900 font-display">
          Step-by-Step {device.shortName} Setup
        </h2>
        <ol className="space-y-5">
          {device.setupSteps.map((step) => (
            <li key={step.stepNumber} className="space-y-1.5 border-b border-zinc-100 pb-5 last:border-b-0 last:pb-0">
              <h3 className="text-base font-bold text-zinc-900 font-display">
                Step {step.stepNumber}: {step.title}
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">{step.detail}</p>
              <p className="text-xs text-blue-600 font-medium">Where to click: {step.interfaceRef}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Helpful Tips & Quick Fixes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4">
          <h2 className="text-lg font-bold text-zinc-900 font-display">
            Helpful Tips for {device.shortName}
          </h2>
          <ul className="space-y-3 text-sm text-zinc-600">
            {device.compatibilityNotes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-blue-600 shrink-0 mt-1" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4">
          <h2 className="text-lg font-bold text-zinc-900 font-display">
            Quick Troubleshooting Fixes
          </h2>
          <div className="space-y-3">
            {device.troubleshooting.map((tr, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#FAFAFA] border border-zinc-200 space-y-1 text-xs">
                <p className="font-semibold text-zinc-900">Problem: {tr.symptom}</p>
                <p className="text-zinc-500">Why it happens: {tr.cause}</p>
                <p className="text-blue-700 font-medium">How to fix: {tr.resolution}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-zinc-900 font-display">
            Ready to Set Up Your IPTV Subscription on {device.shortName}?
          </h2>
          <p className="text-sm text-zinc-600">
            Plans start at $10/month, or try it free for up to 4 hours first.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <AppLink
            href="/pricing"
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            View Plans
          </AppLink>
          <AppLink
            href="/free-trial"
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-100 transition-colors"
          >
            Try 4 Hours Free
          </AppLink>
        </div>
      </div>
    </div>
  );
};

export const GuidesHubView: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="max-w-3xl space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          Step-by-Step Setup Instructions
        </p>
        <h1 className="text-3xl sm:text-5xl font-bold text-zinc-900 font-display tracking-tight">
          How to Set Up IPTV &amp; Fix Common Issues
        </h1>
        <p className="text-base text-zinc-600 leading-relaxed">
          Follow our step-by-step guides to configure your TV player app in minutes or resolve common playback questions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SETUP_TUTORIAL_GUIDES.map((guide) => (
          <article
            key={guide.slug}
            className="rounded-2xl border border-zinc-200 bg-white p-6 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-2.5">
              <p className="text-xs font-medium text-blue-600">
                {guide.category} · {guide.readingTime}
              </p>
              <h2 className="text-xl font-bold text-zinc-900 font-display">
                <AppLink href={`/guides/${guide.slug}`} className="hover:text-blue-600 transition-colors">
                  {guide.title}
                </AppLink>
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">{guide.summary}</p>
            </div>

            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
              <span className="text-zinc-500">Updated {guide.lastUpdated}</span>
              <AppLink
                href={`/guides/${guide.slug}`}
                className="font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                <span>Read Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </AppLink>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export const GuideDetailView: React.FC<{ slug: string }> = ({ slug }) => {
  const guide = SETUP_TUTORIAL_GUIDES.find((g) => g.slug === slug);
  if (!guide) {
    return <NotFoundView />;
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <header className="space-y-3 border-b border-zinc-200 pb-8">
        <p className="text-xs font-semibold text-blue-600">
          {guide.category} · {guide.readingTime} · Updated {guide.lastUpdated}
        </p>
        <h1 className="text-3xl sm:text-5xl font-bold text-zinc-900 font-display tracking-tight">
          {guide.title}
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 leading-relaxed">{guide.summary}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-2xl border border-zinc-200 bg-white p-6 space-y-3">
          <h2 className="text-base font-bold text-zinc-900 font-display">Key Takeaways</h2>
          <ul className="space-y-2 text-xs sm:text-sm text-zinc-600">
            {guide.keyTakeaways.map((tk, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>{tk}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5 rounded-2xl border border-zinc-200 bg-white p-6 space-y-3">
          <h2 className="text-base font-bold text-zinc-900 font-display">Steps in This Guide</h2>
          <ol className="space-y-2 text-xs sm:text-sm text-blue-600 font-medium">
            {guide.steps.map((s) => (
              <li key={s.number}>
                <a href={`#step-${s.number}`} className="hover:underline">
                  {s.number}. {s.heading}
                </a>
              </li>
            ))}
            <li>
              <a href="#troubleshooting-matrix" className="hover:underline">
                Troubleshooting Chart
              </a>
            </li>
          </ol>
        </div>
      </div>

      <div className="space-y-5">
        {guide.steps.map((step) => (
          <section
            key={step.number}
            id={`step-${step.number}`}
            className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-2.5"
          >
            <p className="text-xs font-bold text-blue-600">Step {step.number}</p>
            <h2 className="text-xl font-bold text-zinc-900 font-display">{step.heading}</h2>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">{step.body}</p>
            <p className="text-xs text-zinc-500 pt-1">
              Menu Path: <span className="text-zinc-800 font-medium">{step.uiPath}</span>
            </p>
            {step.commonMistake && (
              <div className="mt-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <strong>Helpful Tip:</strong> {step.commonMistake}
              </div>
            )}
          </section>
        ))}
      </div>

      <section id="troubleshooting-matrix" className="space-y-4">
        <h2 className="text-2xl font-bold text-zinc-900 font-display">
          Troubleshooting Chart
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500 bg-zinc-50">
                <th className="py-3.5 px-4 font-semibold">Problem</th>
                <th className="py-3.5 px-4 font-semibold">Usual Cause</th>
                <th className="py-3.5 px-4 font-semibold">Recommended Fix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-600">
              {guide.troubleshootingTable.map((row, idx) => (
                <tr key={idx}>
                  <td className="py-3.5 px-4 font-semibold text-zinc-900">{row.issue}</td>
                  <td className="py-3.5 px-4 text-zinc-500">{row.probableCause}</td>
                  <td className="py-3.5 px-4 text-blue-700 font-medium">{row.verifiedFix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-zinc-900 font-display">Common Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guide.faqs.map((f, i) => (
            <div key={i} className="p-6 rounded-2xl border border-zinc-200 bg-white space-y-2">
              <h3 className="text-base font-bold text-zinc-900 font-display">{f.question}</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
};

export const BlogHubView: React.FC = () => {
  const { publishedArticles } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Setup Guides',
    'Player Software',
    'Device Compatibility',
    'Troubleshooting',
    'Buyer Resources',
  ];

  const filtered =
    selectedCategory === 'All'
      ? publishedArticles
      : publishedArticles.filter((a) => a.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-zinc-200 pb-8">
        <div className="space-y-2.5 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Streaming Tips &amp; Buyer Guides
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-zinc-900 font-display tracking-tight">
            IPTV Subscription Guides &amp; Streaming Blog
          </h1>
          <p className="text-base text-zinc-600 leading-relaxed">
            Practical guides on choosing an IPTV subscription, improving your TV Wi-Fi speed, and configuring your favorite player apps.
          </p>
        </div>

        <div
          role="group"
          aria-label="Filter articles by category"
          className="flex flex-wrap gap-1.5"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-white text-zinc-600 border border-zinc-200 hover:text-zinc-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((article) => (
          <article
            key={article.articleId}
            className="rounded-2xl border border-zinc-200 bg-white p-6 flex flex-col justify-between space-y-5"
          >
            <div className="space-y-2.5">
              <p className="text-xs text-blue-600 font-medium">
                {article.category} · {article.readingTime}
              </p>
              <h2 className="text-xl font-bold text-zinc-900 font-display leading-snug">
                <AppLink href={`/blog/${article.slug}`} className="hover:text-blue-600 transition-colors">
                  {article.title}
                </AppLink>
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">{article.excerpt}</p>
            </div>

            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
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
  );
};

function renderFormattedInlineText(text: string): React.ReactNode {
  // Parse markdown links [Label](/path) and bold **text**
  const tokenRegex = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-semibold text-zinc-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      return (
        <AppLink
          key={idx}
          href={href}
          className="font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-4"
        >
          {label.replace(/\*\*/g, '')}
        </AppLink>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

export const BlogArticleView: React.FC<{ slug: string }> = ({ slug }) => {
  const { publishedArticles } = useApp();
  const article = publishedArticles.find((a) => a.slug === slug);
  const seedMeta = INITIAL_EDITORIAL_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return <NotFoundView />;
  }

  // Parse ### headings into structured sections
  const rawBlocks = article.content.split(/\n(?=###\s)/).filter(Boolean);
  const parsedSections = rawBlocks.map((block, index) => {
    const lines = block.trim().split('\n');
    const firstLine = lines[0] ?? '';
    if (firstLine.startsWith('### ')) {
      return {
        id: `section-${index + 1}`,
        heading: firstLine.replace(/^###\s+/, '').trim(),
        paragraphs: lines
          .slice(1)
          .join('\n')
          .split(/\n\n+/)
          .map((p) => p.trim())
          .filter(Boolean),
      };
    }
    return {
      id: `section-${index + 1}`,
      heading: `Overview`,
      paragraphs: block
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter(Boolean),
    };
  });

  const keyTakeaways = seedMeta?.keyTakeaways ?? [];
  const comparisonTable = seedMeta?.comparisonTable;
  const checklist = seedMeta?.checklist;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <header className="space-y-3 border-b border-zinc-200 pb-8">
        <p className="text-xs font-semibold text-blue-600">
          {article.category} · {article.readingTime} · Updated {article.lastUpdated}
        </p>
        <h1 className="text-3xl sm:text-5xl font-bold text-zinc-900 font-display tracking-tight leading-tight">
          {article.title}
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 leading-relaxed">{article.excerpt}</p>
        <p className="text-xs text-zinc-500">Written by {article.authorName}</p>
      </header>

      {/* Top Summary Grid: Key Takeaways + Table of Contents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {keyTakeaways.length > 0 && (
          <div className="lg:col-span-7 rounded-2xl border border-zinc-200 bg-white p-6 space-y-3 shadow-2xs">
            <h2 className="text-base font-bold text-zinc-900 font-display">
              Key Takeaways
            </h2>
            <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-600 leading-relaxed">
              {keyTakeaways.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div
          className={`${
            keyTakeaways.length > 0 ? 'lg:col-span-5' : 'lg:col-span-12'
          } rounded-2xl border border-zinc-200 bg-white p-6 space-y-3 shadow-2xs`}
        >
          <h2 className="text-base font-bold text-zinc-900 font-display">
            In This Guide
          </h2>
          <ol className="space-y-2 text-xs sm:text-sm text-blue-600 font-medium">
            {parsedSections.map((sec) => (
              <li key={sec.id}>
                <a href={`#${sec.id}`} className="hover:underline">
                  {sec.heading}
                </a>
              </li>
            ))}
            {comparisonTable && (
              <li>
                <a href="#article-comparison-table" className="hover:underline">
                  Comparison Table
                </a>
              </li>
            )}
            {checklist && (
              <li>
                <a href="#article-checklist" className="hover:underline">
                  Step-by-Step Checklist
                </a>
              </li>
            )}
          </ol>
        </div>
      </div>

      {/* Article Body Sections */}
      <div className="space-y-6">
        {parsedSections.map((sec) => (
          <section
            key={sec.id}
            id={sec.id}
            className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-3 shadow-2xs"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 font-display">
              {sec.heading}
            </h2>
            <div className="space-y-3 text-sm sm:text-base text-zinc-600 leading-relaxed">
              {sec.paragraphs.map((para, pIdx) => (
                <p key={pIdx}>{renderFormattedInlineText(para)}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Comparison Table */}
      {comparisonTable && (
        <section id="article-comparison-table" className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-900 font-display">
            {comparisonTable.title}
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-2xs">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-600">
                  {comparisonTable.headers.map((h, i) => (
                    <th key={i} className="py-3.5 px-4 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-600 tabular-nums">
                {comparisonTable.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-zinc-50/70">
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className={`py-3.5 px-4 ${
                          cIdx === 0 ? 'font-semibold text-zinc-900' : ''
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Action Checklist */}
      {checklist && (
        <section
          id="article-checklist"
          className="rounded-2xl border border-zinc-200 bg-[#FAFAFA] p-6 sm:p-8 space-y-4"
        >
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Quick Action Checklist
            </p>
            <h2 className="text-xl font-bold text-zinc-900 font-display">
              {checklist.title}
            </h2>
          </div>
          <ol className="space-y-3">
            {checklist.items.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-zinc-200 text-xs sm:text-sm text-zinc-700"
              >
                <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Conversion Banner */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 font-display">
            Ready to Choose Your IPTV Subscription Plan?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600">
            Plans start at $10 (1 Month) or $50 (12 Months), backed by a free 4-hour trial and our 7-day technical guarantee.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <AppLink
            href="/pricing"
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700"
          >
            View Plans ($10–$140)
          </AppLink>
          <AppLink
            href="/free-trial"
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-100"
          >
            4-Hour Free Trial
          </AppLink>
        </div>
      </div>
    </article>
  );
};

export const FaqView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All');

  const categories = ['All', 'Pricing & Plans', 'Free Trial', 'Players & Devices', 'Orders & Account'];
  const filtered = FAQ_CATALOG.filter((item) => {
    const matchesCat = category === 'All' || item.category === category;
    const matchesQuery =
      item.question.toLowerCase().includes(query.toLowerCase()) ||
      item.answer.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Help Center</p>
        <h1 className="text-3xl sm:text-5xl font-bold text-zinc-900 font-display tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-base text-zinc-600">
          Answers about our IPTV subscription plans, the free 4-hour trial, our 7-day technical refund policy, and how to watch on your TV.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div role="group" aria-label="Filter FAQs by category" className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                category === cat
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-white text-zinc-600 border border-zinc-200 hover:text-zinc-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <label htmlFor="faq-page-search" className="sr-only">
            Search FAQs
          </label>
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="faq-page-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-zinc-200 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>

      <FaqAccordion
        items={filtered}
        searchQuery={query}
        onResetSearch={() => {
          setQuery('');
          setCategory('All');
        }}
      />
    </div>
  );
};

export const ContactView: React.FC = () => {
  const { profile, submitSupportRequest } = useApp();
  const [customerEmail, setCustomerEmail] = useState(profile?.email || '');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<'setup' | 'billing' | 'trial' | 'compatibility' | 'general'>('setup');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const res = await submitSupportRequest({
        customerEmail,
        subject,
        category,
        message,
      });
      setTicketId(res.ticket.ticketId);
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to submit support inquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="max-w-2xl space-y-2.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Customer Assistance</p>
        <h1 className="text-3xl sm:text-5xl font-bold text-zinc-900 font-display tracking-tight">
          Contact Customer Support
        </h1>
        <p className="text-base text-zinc-600 leading-relaxed">
          Need help setting up your TV, checking an IPTV subscription order, or activating your 4-hour free trial? Send us a message below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-zinc-900 font-display">Send Us a Message</h2>

          {ticketId && (
            <div
              role="status"
              className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-xs sm:text-sm text-emerald-900"
            >
              Message <strong>{ticketId}</strong> sent! You can view updates in{' '}
              <AppLink href="/account" className="underline font-semibold">
                My Account
              </AppLink>.
            </div>
          )}

          {errorMsg && (
            <div
              role="alert"
              className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-xs sm:text-sm text-rose-800"
            >
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="support-email" className="block text-xs font-semibold text-zinc-800">
                Your Email Address
              </label>
              <input
                id="support-email"
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-300 text-sm text-zinc-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="support-category" className="block text-xs font-semibold text-zinc-800">
                What Can We Help With?
              </label>
              <select
                id="support-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-300 text-sm text-zinc-900 focus:outline-none focus:border-blue-600"
              >
                <option value="setup">Help Setting Up My TV</option>
                <option value="billing">Order &amp; Payment Question</option>
                <option value="trial">4-Hour Free Trial</option>
                <option value="compatibility">Device Compatibility</option>
                <option value="general">Other Question</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="support-subject" className="block text-xs font-semibold text-zinc-800">
                Subject
              </label>
              <input
                id="support-subject"
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Help signing in on my FireStick"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-300 text-sm text-zinc-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="support-message" className="block text-xs font-semibold text-zinc-800">
                Message
              </label>
              <textarea
                id="support-message"
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us which TV or app you are using and your Order ID if you have one..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-300 text-sm text-zinc-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Sending...' : 'Send Message'}</span>
            </button>
          </form>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-3">
            <h2 className="text-base font-bold text-zinc-900 font-display">
              TV Setup Guides
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Need help right away? Check our step-by-step TV setup guides:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-blue-600 font-medium">
              <li>
                <AppLink href="/guides/how-to-set-up-iptv" className="hover:underline">
                  How to Set Up IPTV on Any TV →
                </AppLink>
              </li>
              <li>
                <AppLink href="/guides/iptv-smarters-pro-setup" className="hover:underline">
                  IPTV Smarters Pro Setup Steps →
                </AppLink>
              </li>
              <li>
                <AppLink href="/guides/iptv-smarters-pro-not-working" className="hover:underline">
                  IPTV Smarters Pro Not Working: 7 Fixes →
                </AppLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LegalDocumentView: React.FC<{
  type: 'terms' | 'privacy' | 'refund' | 'copyright' | 'compatibility';
}> = ({ type }) => {
  const active = LEGAL_DOCUMENTS_CATALOG[type];
  const allPolicies = Object.values(LEGAL_DOCUMENTS_CATALOG);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      {/* Policy Navigation Tabs */}
      <div className="space-y-6 border-b border-zinc-200 pb-8">
        <div
          role="navigation"
          aria-label="Legal & Service Policies"
          className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-zinc-100 border border-zinc-200"
        >
          {allPolicies.map((doc) => {
            const isCurrent = doc.type === type;
            return (
              <AppLink
                key={doc.type}
                href={doc.path}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                  isCurrent
                    ? 'bg-white text-zinc-900 font-semibold shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {doc.shortLabel}
              </AppLink>
            );
          })}
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
            <span className="font-semibold text-blue-600">Lumiq TV Service Policies</span>
            <span aria-hidden="true">·</span>
            <span>Effective Date: {active.effectiveDate}</span>
            <span aria-hidden="true">·</span>
            <span>Last Updated: {active.lastUpdated}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-zinc-900 font-display tracking-tight">
            {active.title}
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-3xl">
            {active.summary}
          </p>
        </div>
      </div>

      {/* Plain-English Summary Callout Box */}
      <section className="rounded-2xl border border-blue-200 bg-blue-50/50 p-6 sm:p-8 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Key Highlights at a Glance
          </p>
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 font-display">
            Summary in Plain English
          </h2>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm text-zinc-700 leading-relaxed">
          {active.plainEnglishBullets.map((bullet, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-zinc-200/90"
            >
              <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Two-Column Layout: Sticky Jump Index + Detailed Policy Clauses */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <aside className="lg:col-span-4 lg:sticky lg:top-24 rounded-2xl border border-zinc-200 bg-white p-5 space-y-4 shadow-2xs">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Sections in This Policy
          </h2>
          <ol className="space-y-2 text-xs sm:text-sm font-medium text-zinc-700">
            {active.sections.map((sec) => (
              <li key={sec.id}>
                <a
                  href={`#${sec.id}`}
                  className="block py-1 hover:text-blue-600 transition-colors leading-snug"
                >
                  {sec.heading}
                </a>
              </li>
            ))}
          </ol>

          <div className="pt-4 border-t border-zinc-100 space-y-2 text-xs text-zinc-500">
            <p className="font-semibold text-zinc-800">Have a question about this policy?</p>
            <p>Our support team is available to assist with billing, trials, or technical questions.</p>
            <AppLink
              href="/contact"
              className="inline-flex items-center gap-1.5 text-blue-600 font-semibold hover:underline pt-1"
            >
              <span>Contact Customer Support</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </AppLink>
          </div>
        </aside>

        <div className="lg:col-span-8 space-y-5">
          {active.sections.map((sec) => (
            <section
              key={sec.id}
              id={sec.id}
              className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-3.5 shadow-2xs"
            >
              <h2 className="text-xl font-bold text-zinc-900 font-display">{sec.heading}</h2>
              <div className="space-y-3 text-sm sm:text-base text-zinc-600 leading-relaxed">
                {sec.paragraphs.map((p, pIdx) => (
                  <p key={pIdx}>{renderFormattedInlineText(p)}</p>
                ))}
              </div>
              {sec.bullets && sec.bullets.length > 0 && (
                <ul className="pt-1 space-y-2 text-xs sm:text-sm text-zinc-600">
                  {sec.bullets.map((b, bIdx) => (
                    <li
                      key={bIdx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAFAFA] border border-zinc-200/80 leading-relaxed"
                    >
                      <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{renderFormattedInlineText(b)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export const NotFoundView: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-5">
      <p className="text-xs font-semibold text-blue-600">Page Not Found</p>
      <h1 className="text-3xl sm:text-5xl font-bold text-zinc-900 font-display">
        We Couldn't Find That Page
      </h1>
      <p className="text-base text-zinc-600 max-w-lg mx-auto">
        Use the buttons below to view our IPTV subscription plans, request a free 4-hour trial, or read our TV setup guides.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <AppLink
          href="/"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700"
        >
          Go to Homepage
        </AppLink>
        <AppLink
          href="/pricing"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-zinc-900 text-white hover:bg-zinc-800"
        >
          View Plans ($10–$140)
        </AppLink>
        <AppLink
          href="/guides"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100"
        >
          TV Setup Guides
        </AppLink>
      </div>
    </div>
  );
};
