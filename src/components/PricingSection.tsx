import React, { useState } from 'react';
import { ArrowRight, Check, Users, Clock, ShieldCheck } from 'lucide-react';
import {
  SINGLE_CONNECTION_PLANS,
  MULTI_CONNECTION_BUNDLE,
  FREE_TRIAL_CONFIG,
  calculatePlanSavings,
  formatUsdFromCents,
  type SubscriptionPlan,
} from '../lib/pricing';
import { useApp } from '../context/AppContext';
import { AppLink } from './Layout';

export const PricingSection: React.FC<{
  showFullComparisonTable?: boolean;
  headingLevel?: 'h1' | 'h2';
}> = ({ showFullComparisonTable = true, headingLevel = 'h2' }) => {
  const { navigate, setSelectedCheckoutPlanId } = useApp();
  const [horizonFilter, setHorizonFilter] = useState<'all' | 'standard' | 'extended'>('all');

  const filteredPlans = SINGLE_CONNECTION_PLANS.filter((plan) => {
    if (horizonFilter === 'standard') return plan.durationMonths <= 12;
    if (horizonFilter === 'extended') return plan.durationMonths >= 12;
    return true;
  });

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedCheckoutPlanId(plan.id);
    navigate(`/checkout?plan=${encodeURIComponent(plan.id)}`);
  };

  const bundleSavings = calculatePlanSavings(MULTI_CONNECTION_BUNDLE);
  const HeadingTag = headingLevel;

  return (
    <section aria-labelledby="pricing-catalog-heading" className="py-14 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Clean, Customer-Friendly Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-zinc-200 pb-8">
          <div className="space-y-2.5 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Clear USD Pricing · No Hidden Fees · No Forced Auto-Renewal
            </p>
            <HeadingTag
              id="pricing-catalog-heading"
              className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight font-display"
            >
              IPTV Subscription Plans &amp; Pricing
            </HeadingTag>
            <p className="text-base text-zinc-600 leading-relaxed">
              Choose the duration that fits your household. Every IPTV subscription plan includes TV setup instructions, an Electronic Program Guide (EPG), and works on Smart TVs, FireStick, Android TV, Apple TV, phones, and computers.
            </p>
          </div>

          {/* Simple Duration Filter */}
          <div
            role="group"
            aria-label="Filter subscription plans by duration"
            className="inline-flex items-center gap-1 p-1 bg-zinc-100 border border-zinc-200 rounded-lg self-start lg:self-auto"
          >
            <button
              type="button"
              onClick={() => setHorizonFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                horizonFilter === 'all'
                  ? 'bg-white text-zinc-900 font-semibold shadow-2xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              All 7 Plans
            </button>
            <button
              type="button"
              onClick={() => setHorizonFilter('standard')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                horizonFilter === 'standard'
                  ? 'bg-white text-zinc-900 font-semibold shadow-2xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              1 to 12 Months
            </button>
            <button
              type="button"
              onClick={() => setHorizonFilter('extended')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                horizonFilter === 'extended'
                  ? 'bg-white text-zinc-900 font-semibold shadow-2xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              1 to 4 Years
            </button>
          </div>
        </div>

        {/* Single-Device Plans Grid (1 Connection) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredPlans.map((plan) => {
            const savings = calculatePlanSavings(plan);
            const isFeatured = Boolean(plan.featured);
            return (
              <div
                key={plan.id}
                className={`flex flex-col justify-between rounded-2xl p-6 transition-all bg-white ${
                  isFeatured
                    ? 'border-2 border-blue-600 shadow-md'
                    : 'border border-zinc-200/90 hover:border-zinc-300 shadow-2xs'
                }`}
              >
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p
                      className={`text-xs font-medium whitespace-nowrap truncate ${
                        isFeatured ? 'text-blue-600 font-semibold' : 'text-zinc-500'
                      }`}
                    >
                      {isFeatured ? 'Most Popular · Best Yearly Value' : `1 TV / Device · ${plan.shortLabel}`}
                    </p>
                    <h3 className="text-xl font-bold text-zinc-900 font-display">
                      {plan.shortLabel}
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed min-h-[2rem]">
                      {plan.targetAudience}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-100">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-bold text-zinc-900 tabular-nums">
                        {formatUsdFromCents(plan.amountCents)}
                      </span>
                      <span className="text-xs text-zinc-500">
                        one-time for {plan.durationMonths} {plan.durationMonths === 1 ? 'mo' : 'mos'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-medium text-emerald-700 tabular-nums whitespace-nowrap">
                      {savings.savedCents > 0
                        ? `${formatUsdFromCents(savings.monthlyEquivalentCents, true)}/mo · Save ${formatUsdFromCents(savings.savedCents)} (${Math.round(savings.savedPercentage)}%)`
                        : '$10.00/mo standard monthly rate'}
                    </p>
                  </div>

                  <ul className="space-y-2 pt-2 text-xs text-zinc-600">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>
                        Full access for <strong className="text-zinc-900">{plan.durationMonths} {plan.durationMonths === 1 ? 'Month' : 'Months'}</strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>
                        Watch on <strong className="text-zinc-900">1 screen at a time</strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>Works on Smart TV, FireStick &amp; Apple TV</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>Includes TV Channel Guide (EPG)</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-5 mt-5 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => handleSelectPlan(plan)}
                    aria-label={`Choose ${plan.shortLabel} plan for ${formatUsdFromCents(plan.amountCents)}`}
                    className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isFeatured
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-zinc-900 text-white hover:bg-zinc-800'
                    }`}
                  >
                    <span>Select {plan.shortLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Multi-Screen Family Bundle (3 Connections × 12 Months = $120) */}
        <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-2.5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700">
                <Users className="w-4 h-4" />
                <span>Family &amp; Multi-Room Bundle · Watch on 3 TVs at the Same Time</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 font-display">
                3 TVs / Devices for 12 Months — {formatUsdFromCents(MULTI_CONNECTION_BUNDLE.amountCents)} Total
              </h3>
              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-2xl">
                Want to watch in the living room, bedroom, and on a phone or tablet at the exact same time? Our 3-Connection Annual Bundle gives your household{' '}
                <strong className="text-zinc-900">3 simultaneous streams for a full year</strong>—working out to just{' '}
                <strong className="text-zinc-900">
                  {formatUsdFromCents(bundleSavings.monthlyEquivalentPerConnectionCents, true)}/month per screen
                </strong>{' '}
                (saves $240 vs. monthly billing).
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between gap-4 border-t lg:border-t-0 lg:border-l border-blue-200/80 pt-5 lg:pt-0 lg:pl-8">
              <div className="lg:text-right">
                <div className="text-3xl sm:text-4xl font-bold text-zinc-900 tabular-nums">
                  {formatUsdFromCents(MULTI_CONNECTION_BUNDLE.amountCents)}
                </div>
                <p className="text-xs text-zinc-600 mt-0.5">
                  Full Year (12 Months) · 3 Simultaneous Screens
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleSelectPlan(MULTI_CONNECTION_BUNDLE)}
                className="py-3 px-6 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
              >
                <span>Choose 3-TV Family Plan ($120)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Simple 2-Box Reassurance Row: 4-Hour Free Trial & Honest Fixed-Term Policy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
                <Clock className="w-4 h-4" />
                <span>Try Before You Buy · {FREE_TRIAL_CONFIG.label} · $0</span>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 font-display">
                Want to Test It on Your TV First?
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Request a free trial (up to 4 hours) to test the setup and channel guide on your own Smart TV or FireStick before paying anything. No credit card needed.
              </p>
            </div>
            <div>
              <AppLink
                href="/free-trial"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-900 transition-colors whitespace-nowrap shrink-0"
              >
                <span>Request 4-Hour Free Trial</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </AppLink>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <ShieldCheck className="w-4 h-4" />
                <span>Honest Pricing Promise</span>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 font-display">
                No Fake Discounts or Risky "Lifetime" Traps
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Quality TV streaming costs money every month to keep fast and reliable. That is why we offer clear fixed plans from 1 month ($10) to 48 months ($140)—with zero surprise auto-charges.
              </p>
            </div>
            <div>
              <AppLink
                href="/blog/evaluating-iptv-subscription-durations-and-lifetime-claims"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <span>Why we don't sell fake "lifetime" plans</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </AppLink>
            </div>
          </div>
        </div>

        {/* Side-by-Side Price & Savings Comparison Table (Preserved for SEO & Easy Comparison) */}
        {showFullComparisonTable && (
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-900 font-display">
                Price &amp; Savings Comparison Chart
              </h3>
              <p className="text-xs text-zinc-500">
                Compare all IPTV subscription plans side by side against our standard $10/month rate.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-xs text-zinc-500 bg-zinc-50">
                    <th className="py-3.5 px-4 font-semibold">Plan</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Screens at Once</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Total Price</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Cost Per Month</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Total Savings</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Choose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 tabular-nums text-xs sm:text-sm">
                  {[...SINGLE_CONNECTION_PLANS, MULTI_CONNECTION_BUNDLE].map((plan) => {
                    const s = calculatePlanSavings(plan);
                    return (
                      <tr key={plan.id} className="hover:bg-zinc-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-medium text-zinc-900">
                          {plan.name}
                        </td>
                        <td className="py-3.5 px-4 text-right text-zinc-600">
                          {plan.connections} {plan.connections === 1 ? 'Screen' : 'Screens'}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-zinc-900">
                          {formatUsdFromCents(plan.amountCents)}
                        </td>
                        <td className="py-3.5 px-4 text-right text-zinc-700">
                          {formatUsdFromCents(s.monthlyEquivalentPerConnectionCents, true)}/mo
                          {plan.connections > 1 ? ' per screen' : ''}
                        </td>
                        <td className="py-3.5 px-4 text-right font-medium text-emerald-700">
                          {s.savedCents > 0
                            ? `Save ${formatUsdFromCents(s.savedCents)} (${s.savedPercentage}%)`
                            : 'Standard Rate'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleSelectPlan(plan)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors whitespace-nowrap cursor-pointer"
                          >
                            Select
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
