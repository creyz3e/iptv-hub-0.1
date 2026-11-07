import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowRight,
  Search,
  RefreshCw,
  LogOut,
} from 'lucide-react';
import {
  SUBSCRIPTION_PLANS,
  PAYMENT_METHODS,
  SUPPORTED_DEVICES,
  calculatePlanSavings,
  formatUsdFromCents,
  getPlanById,
  renderTransactionalEmail,
  type PaymentMethodId,
  type TransactionalEmailType,
  type OrderStatus,
  type PaymentStatus,
  type SubscriptionStatus,
  type TrialStatus,
} from '../lib/pricing';
import {
  useApp,
  type CustomerProfile,
  type OrderRecord,
  type TrialRecord,
  type EditorialArticle,
  type AuditLogRecord,
} from '../context/AppContext';
import { AppLink } from '../components/Layout';

export const CheckoutView: React.FC = () => {
  const {
    profile,
    selectedCheckoutPlanId,
    setSelectedCheckoutPlanId,
    submitOrder,
    navigate,
  } = useApp();

  const selectedPlan =
    getPlanById(selectedCheckoutPlanId) ?? getPlanById('plan-12m-1c')!;
  const savings = calculatePlanSavings(selectedPlan);

  const [customerEmail, setCustomerEmail] = useState<string>(profile?.email || '');
  const [deviceType, setDeviceType] = useState<string>(
    profile?.preferredDevice || SUPPORTED_DEVICES[0]
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('manual_invoice');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.email && !customerEmail) {
      setCustomerEmail(profile.email);
    }
  }, [profile?.email, customerEmail]);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const { order } = await submitOrder({
        planId: selectedPlan.id,
        customerEmail,
        deviceType,
        paymentMethod,
      });
      navigate(`/account?newOrder=${encodeURIComponent(order.orderId)}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to submit order.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="space-y-2 border-b border-zinc-200 pb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          Order Summary &amp; Checkout · Clear USD Pricing
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 font-display">
          Complete Your IPTV Subscription Order
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 max-w-2xl">
          Choose your IPTV subscription plan, enter your email address so we can send your TV login details, and pick how you'd like to pay.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Checkout Form */}
        <form
          onSubmit={handleCheckoutSubmit}
          className="lg:col-span-7 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-6 shadow-2xs"
          noValidate
        >
          <div className="space-y-2">
            <label htmlFor="checkout-plan-select" className="block text-xs font-semibold text-zinc-800">
              1. Choose Your IPTV Subscription Plan
            </label>
            <select
              id="checkout-plan-select"
              value={selectedPlan.id}
              onChange={(e) => setSelectedCheckoutPlanId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-300 text-sm text-zinc-900 focus:outline-none focus:border-blue-600"
            >
              {SUBSCRIPTION_PLANS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {formatUsdFromCents(p.amountCents)} ({p.durationMonths} Mo · {p.connections} {p.connections === 1 ? 'TV' : 'TVs'})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="checkout-email" className="block text-xs font-semibold text-zinc-800">
              2. Your Email Address (Where We Send Your Login)
            </label>
            <input
              id="checkout-email"
              type="email"
              required
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-300 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="checkout-device" className="block text-xs font-semibold text-zinc-800">
              3. Which TV or Device Do You Use Most?
            </label>
            <select
              id="checkout-device"
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-300 text-sm text-zinc-900 focus:outline-none focus:border-blue-600"
            >
              {SUPPORTED_DEVICES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <span className="block text-xs font-semibold text-zinc-800">
              4. Choose How You Want to Pay
            </span>
            <div className="space-y-2.5">
              {PAYMENT_METHODS.map((pm) => (
                <label
                  key={pm.id}
                  className={`block p-4 rounded-xl border cursor-pointer transition-colors ${
                    paymentMethod === pm.id
                      ? 'border-blue-600 bg-blue-50/50'
                      : 'border-zinc-200 bg-[#FAFAFA] hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={pm.id}
                        checked={paymentMethod === pm.id}
                        onChange={() => setPaymentMethod(pm.id)}
                        className="accent-blue-600"
                      />
                      <span className="text-sm font-semibold text-zinc-900">{pm.label}</span>
                    </div>
                  </div>
                  <p className="mt-1 pl-6 text-xs text-zinc-600 leading-relaxed">
                    {pm.instructions}
                  </p>
                </label>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-xs sm:text-sm text-rose-800"
            >
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-6 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>
              {submitting
                ? 'Submitting Your Order...'
                : `Place Order — ${formatUsdFromCents(selectedPlan.amountCents)}`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Right: Order Summary */}
        <aside className="lg:col-span-5 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="space-y-1 border-b border-zinc-100 pb-4">
            <p className="text-xs text-zinc-500">Order Summary</p>
            <h2 className="text-xl font-bold text-zinc-900 font-display">{selectedPlan.name}</h2>
          </div>

          <dl className="space-y-3 text-xs sm:text-sm tabular-nums">
            <div className="flex justify-between">
              <dt className="text-zinc-500">Length of Plan</dt>
              <dd className="text-zinc-900 font-semibold">
                {selectedPlan.durationMonths} {selectedPlan.durationMonths === 1 ? 'Month' : 'Months'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">TVs / Screens at Once</dt>
              <dd className="text-zinc-900 font-semibold">
                {selectedPlan.connections} {selectedPlan.connections === 1 ? 'Screen' : 'Screens'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Monthly Breakdown</dt>
              <dd className="text-blue-600 font-medium">
                {formatUsdFromCents(savings.monthlyEquivalentPerConnectionCents, true)}/mo
                {selectedPlan.connections > 1 ? ' per screen' : ''}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Your Savings</dt>
              <dd className="text-emerald-700 font-medium">
                {savings.savedCents > 0
                  ? `Save ${formatUsdFromCents(savings.savedCents)} (${savings.savedPercentage}%)`
                  : 'Standard 1-Month Rate'}
              </dd>
            </div>
            <div className="pt-3 border-t border-zinc-200 flex justify-between items-baseline text-base">
              <dt className="text-zinc-900 font-bold">Total Price</dt>
              <dd className="text-2xl font-bold text-zinc-900">
                {formatUsdFromCents(selectedPlan.amountCents)} USD
              </dd>
            </div>
          </dl>

          <div className="p-4 rounded-xl bg-[#FAFAFA] border border-zinc-200 text-xs text-zinc-600 space-y-2">
            <div className="font-semibold text-zinc-900">How It Works Next:</div>
            <ol className="space-y-1.5 list-decimal list-inside">
              <li>Your order is saved under your email address.</li>
              <li>Follow the payment instructions in My Account and click "Notify Payment Sent".</li>
              <li>Once confirmed, your subscription activates and your TV login details appear in your account.</li>
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
};

export const LoginView: React.FC = () => {
  const { signInWithEmailSession, signInWithGoogle, navigate, profile } = useApp();
  const [email, setEmail] = useState(profile?.email || '');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      await signInWithEmailSession(email);
      navigate('/account');
    } catch (err: any) {
      setErrorMsg(err.message || 'Sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoAccount = async (demoEmail: string, targetRoute = '/account') => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await signInWithEmailSession(demoEmail);
      navigate(targetRoute);
    } catch (err: any) {
      setErrorMsg(err.message || 'Quick session switch failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="space-y-1.5 border-b border-zinc-100 pb-5">
          <p className="text-xs font-semibold text-blue-600">Customer Account Access</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 font-display">
            Sign In to Your Account
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            Enter your email to view your active IPTV subscription plan, check order status, or see your 4-hour free trial.
          </p>
        </div>

        {errorMsg && (
          <div role="alert" className="p-3.5 rounded-xl border border-rose-200 bg-rose-50 text-xs text-rose-800">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleEmailSignIn} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="block text-xs font-semibold text-zinc-800">
              Your Email Address
            </label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-300 text-sm text-zinc-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
          >
            {loading ? 'Signing In...' : 'Sign In with Email'}
          </button>
        </form>

        <div className="pt-4 border-t border-zinc-100">
          <button
            type="button"
            onClick={async () => {
              try {
                await signInWithGoogle();
                navigate('/account');
              } catch (err: any) {
                setErrorMsg(err.message || 'Google Sign-In popup was closed.');
              }
            }}
            className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-900 transition-colors cursor-pointer"
          >
            Continue with Google
          </button>
        </div>

        {/* Sample Customer Accounts for Instant Preview */}
        <div className="pt-5 border-t border-zinc-100 space-y-2.5">
          <p className="text-xs font-semibold text-zinc-500">
            Quick Customer Demo Accounts:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemoAccount('alex.mercer@example.com', '/account')}
              className="p-2.5 rounded-xl border border-zinc-200 bg-[#FAFAFA] hover:border-blue-500 text-left cursor-pointer"
            >
              <div className="font-semibold text-zinc-900">Alex Mercer</div>
              <div className="text-zinc-500 text-[11px]">Active 12-Month Plan ($50)</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoAccount('claire.dubois@example.com', '/account')}
              className="p-2.5 rounded-xl border border-zinc-200 bg-[#FAFAFA] hover:border-blue-500 text-left cursor-pointer"
            >
              <div className="font-semibold text-zinc-900">Claire Dubois</div>
              <div className="text-zinc-500 text-[11px]">3-TV Family Plan ($120)</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoAccount('david.kovacs@example.com', '/account')}
              className="p-2.5 rounded-xl border border-zinc-200 bg-[#FAFAFA] hover:border-blue-500 text-left cursor-pointer"
            >
              <div className="font-semibold text-zinc-900">David Kovacs</div>
              <div className="text-zinc-500 text-[11px]">Pending 3-Month Order ($20)</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CustomerDashboardView: React.FC<{ ordersOnly?: boolean }> = ({
  ordersOnly = false,
}) => {
  const {
    profile,
    orders,
    trialRequests,
    supportRequests,
    searchParams,
    markOrderPaymentUnderReview,
    signOutUser,
  } = useApp();

  const newOrderId = searchParams.get('newOrder');
  const activeSubscriptionOrder = orders.find((o) => o.subscriptionStatus === 'Active');

  if (!profile) {
    return <LoginView />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-zinc-200 pb-6">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-blue-600">
            My Account
          </p>
          <h1 className="text-2xl sm:text-4xl font-bold text-zinc-900 font-display">
            {ordersOnly ? 'My Orders & Payment Status' : `Hi, ${profile.displayName}`}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Signed in as {profile.email} · Preferred TV: {profile.preferredDevice}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <AppLink
            href="/pricing"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            New Order
          </AppLink>
          <AppLink
            href="/login"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            Switch Account
          </AppLink>
          <button
            type="button"
            onClick={() => signOutUser()}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-zinc-200 text-zinc-600 hover:text-rose-600 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {newOrderId && (
        <div
          role="status"
          className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 space-y-1.5 text-xs sm:text-sm text-emerald-900"
        >
          <div className="font-bold text-base">
            Order {newOrderId} Received (Status: Pending · Awaiting Payment)
          </div>
          <p>
            Once you complete your payment, click <strong>"Notify Payment Sent"</strong> on your order below so our team can verify and activate your subscription.
          </p>
        </div>
      )}

      {/* Active Plan Summary */}
      {!ordersOnly && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 rounded-2xl border border-zinc-200 bg-white p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div>
                <p className="text-xs text-zinc-500">Current Plan</p>
                <h2 className="text-xl font-bold text-zinc-900 font-display">
                  {activeSubscriptionOrder
                    ? activeSubscriptionOrder.planName
                    : 'No Active Plan Yet'}
                </h2>
              </div>
              <span className="text-xs font-semibold text-emerald-700">
                {activeSubscriptionOrder
                  ? `Status: ${activeSubscriptionOrder.subscriptionStatus}`
                  : 'Status: Pending / None'}
              </span>
            </div>

            {activeSubscriptionOrder ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs tabular-nums">
                <div>
                  <span className="text-zinc-500 block">Duration</span>
                  <strong className="text-zinc-900 text-sm">
                    {activeSubscriptionOrder.durationMonths} Months
                  </strong>
                </div>
                <div>
                  <span className="text-zinc-500 block">Screens at Once</span>
                  <strong className="text-zinc-900 text-sm">
                    {activeSubscriptionOrder.connections} {activeSubscriptionOrder.connections === 1 ? 'Screen' : 'Screens'}
                  </strong>
                </div>
                <div>
                  <span className="text-zinc-500 block">Start Date</span>
                  <strong className="text-emerald-700 text-sm">
                    {activeSubscriptionOrder.activationDate}
                  </strong>
                </div>
                <div>
                  <span className="text-zinc-500 block">End Date</span>
                  <strong className="text-blue-600 text-sm">
                    {activeSubscriptionOrder.expirationDate}
                  </strong>
                </div>
              </div>
            ) : (
              <p className="text-sm text-zinc-600 leading-relaxed">
                You don't have an active plan right now. If you placed an order below, it will activate as soon as your payment is confirmed.
              </p>
            )}
          </div>

          <div className="lg:col-span-4 rounded-2xl border border-zinc-200 bg-white p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-blue-600">Need Help?</p>
              <h2 className="text-lg font-bold text-zinc-900 font-display">
                TV Setup &amp; Support
              </h2>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Follow our step-by-step guide to sign in on your {profile.preferredDevice}.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <AppLink
                href="/guides/how-to-set-up-iptv"
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white"
              >
                TV Setup Guide
              </AppLink>
              <AppLink
                href="/contact"
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-900"
              >
                Contact Support ({supportRequests.length})
              </AppLink>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-900 font-display">
            My Orders ({orders.length})
          </h2>
          {!ordersOnly && (
            <AppLink href="/account/orders" className="text-xs font-semibold text-blue-600 hover:underline">
              View All Orders →
            </AppLink>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center space-y-3">
            <p className="text-sm text-zinc-600">No orders found for {profile.email}.</p>
            <AppLink
              href="/pricing"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white"
            >
              <span>See Plans ($10–$140)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </AppLink>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-500 bg-zinc-50">
                  <th className="py-3.5 px-4 font-semibold">Order &amp; Plan</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Price</th>
                  <th className="py-3.5 px-4 font-semibold">Order Status</th>
                  <th className="py-3.5 px-4 font-semibold">Payment Status</th>
                  <th className="py-3.5 px-4 font-semibold">Subscription</th>
                  <th className="py-3.5 px-4 font-semibold">Active Dates</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 tabular-nums text-xs">
                {orders.map((ord) => (
                  <tr key={ord.orderId} className="hover:bg-zinc-50/80">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-zinc-900">{ord.orderId}</div>
                      <div className="text-zinc-500">
                        {ord.planName} ({ord.durationMonths}m · {ord.connections} TV)
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-zinc-900">
                      {formatUsdFromCents(ord.amountCents)}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-700 font-medium">{ord.orderStatus}</td>
                    <td className="py-3.5 px-4 text-amber-700 font-medium">{ord.paymentStatus}</td>
                    <td className="py-3.5 px-4 text-blue-700 font-medium">{ord.subscriptionStatus}</td>
                    <td className="py-3.5 px-4 text-zinc-500">
                      {ord.activationDate
                        ? `${ord.activationDate} → ${ord.expirationDate}`
                        : 'Waiting for Payment'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {ord.paymentStatus === 'Awaiting Payment' ? (
                        <button
                          type="button"
                          onClick={() => markOrderPaymentUnderReview(ord.orderId)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 whitespace-nowrap cursor-pointer"
                        >
                          Notify Payment Sent
                        </button>
                      ) : (
                        <span className="text-zinc-400">Up to date</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Free Trial Requests */}
      {!ordersOnly && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-zinc-900 font-display">
              My 4-Hour Free Trials ({trialRequests.length})
            </h2>
            <AppLink href="/free-trial" className="text-xs font-semibold text-blue-600 hover:underline">
              Request Trial →
            </AppLink>
          </div>

          {trialRequests.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-xs sm:text-sm text-zinc-500">
              You haven't requested a 4-hour free trial yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trialRequests.map((tr) => (
                <div
                  key={tr.trialId}
                  className="p-5 rounded-2xl border border-zinc-200 bg-white flex items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-zinc-900">
                      {tr.trialId} · Up to {tr.durationHours} Hours
                    </div>
                    <div className="text-zinc-500">
                      {tr.deviceType} · {tr.playerApp}
                    </div>
                  </div>
                  <div className="font-semibold text-blue-700">
                    Status: {tr.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const AdminDashboardView: React.FC = () => {
  const { profile, signInWithEmailSession, refreshCustomerData } = useApp();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'customers' | 'trials' | 'cms' | 'emails'
  >('overview');

  const [adminState, setAdminState] = useState<{
    metrics: {
      totalCustomers: number;
      totalOrders: number;
      paidOrders: number;
      pendingOrders: number;
      activeSubscriptions: number;
      expiredSubscriptions: number;
      trialRequestsCount: number;
      verifiedRevenueCents: number;
    };
    profiles: CustomerProfile[];
    orders: OrderRecord[];
    trialRequests: TrialRecord[];
    articles: EditorialArticle[];
    auditLogs: AuditLogRecord[];
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [customerSearch, setCustomerSearch] = useState<string>('');
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});

  // Editorial CMS State
  const [cmsSlug, setCmsSlug] = useState('');
  const [cmsTitle, setCmsTitle] = useState('');
  const [cmsExcerpt, setCmsExcerpt] = useState('');
  const [cmsCategory, setCmsCategory] = useState<
    'Setup Guides' | 'Player Software' | 'Device Compatibility' | 'Troubleshooting' | 'Buyer Resources'
  >('Setup Guides');
  const [cmsAuthor, setCmsAuthor] = useState('Marcus Vance, Senior Streaming Systems Editor');
  const [cmsReviewStatus, setCmsReviewStatus] = useState<'Draft' | 'In Review' | 'Verified & Published'>(
    'Verified & Published'
  );
  const [cmsSeoTitle, setCmsSeoTitle] = useState('');
  const [cmsSeoDesc, setCmsSeoDesc] = useState('');
  const [cmsContent, setCmsContent] = useState('');
  const [cmsSuccess, setCmsSuccess] = useState<string | null>(null);

  // Email Preview State
  const [selectedEmailType, setSelectedEmailType] =
    useState<TransactionalEmailType>('order_received');
  const [selectedEmailPlanId, setSelectedEmailPlanId] = useState<string>('plan-12m-1c');

  const adminEmail =
    profile?.role === 'admin' ? profile.email : 'getleasecheck@gmail.com';

  const fetchAdminState = useCallback(async (emailHeader: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/admin/state', {
        headers: { 'x-admin-email': emailHeader },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to load admin console state.');
      }
      setAdminState(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error loading admin console.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminState(adminEmail);
  }, [adminEmail, fetchAdminState]);

  const handleUpdateOrder = async (
    orderId: string,
    updates: {
      orderStatus?: OrderStatus;
      paymentStatus?: PaymentStatus;
      subscriptionStatus?: SubscriptionStatus;
    }
  ) => {
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': adminEmail,
        },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        await fetchAdminState(adminEmail);
        await refreshCustomerData();
      }
    } catch (err) {
      console.error('Failed to update order:', err);
    }
  };

  const handleUpdateTrial = async (trialId: string, status: TrialStatus) => {
    try {
      const res = await fetch(`/api/admin/trials/${encodeURIComponent(trialId)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': adminEmail,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        await fetchAdminState(adminEmail);
        await refreshCustomerData();
      }
    } catch (err) {
      console.error('Failed to update trial:', err);
    }
  };

  const handleSaveCustomerNote = async (uid: string) => {
    const internalNotes = noteDrafts[uid] ?? '';
    try {
      const res = await fetch(`/api/admin/profiles/${encodeURIComponent(uid)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': adminEmail,
        },
        body: JSON.stringify({ internalNotes }),
      });
      if (res.ok) {
        await fetchAdminState(adminEmail);
      }
    } catch (err) {
      console.error('Failed to save customer note:', err);
    }
  };

  const handlePublishArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setCmsSuccess(null);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': adminEmail,
        },
        body: JSON.stringify({
          slug: cmsSlug,
          title: cmsTitle,
          excerpt: cmsExcerpt,
          category: cmsCategory,
          authorName: cmsAuthor,
          reviewStatus: cmsReviewStatus,
          seoTitle: cmsSeoTitle,
          seoDescription: cmsSeoDesc,
          content: cmsContent,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not save article.');
      }
      setCmsSuccess(`Saved article "${data.article.title}" (${data.article.reviewStatus}).`);
      await fetchAdminState(adminEmail);
      await refreshCustomerData();
    } catch (err: any) {
      setErrorMsg(err.message || 'CMS error.');
    }
  };

  const filteredOrders =
    adminState?.orders.filter((o) =>
      orderStatusFilter === 'All' ? true : o.orderStatus === orderStatusFilter || o.paymentStatus === orderStatusFilter
    ) ?? [];

  const filteredCustomers =
    adminState?.profiles.filter(
      (p) =>
        p.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
        p.displayName.toLowerCase().includes(customerSearch.toLowerCase())
    ) ?? [];

  const emailPreview = renderTransactionalEmail(selectedEmailType, {
    recipientEmail: 'customer@example.com',
    orderId: 'ORD-2026-1001',
    planId: selectedEmailPlanId,
    trialId: 'TRL-2026-402',
    ticketId: 'TKT-2026-901',
    activationDate: '2026-11-06',
    expirationDate: '2027-11-06',
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-blue-600">
            Lumiq TV Store Admin ({adminEmail})
          </p>
          <h1 className="text-2xl sm:text-4xl font-bold text-zinc-900 font-display">
            Store &amp; Content Management
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {profile?.role !== 'admin' && (
            <button
              type="button"
              onClick={() => signInWithEmailSession('getleasecheck@gmail.com')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            >
              Sign In as Admin
            </button>
          )}
          <button
            type="button"
            onClick={() => fetchAdminState(adminEmail)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        role="tablist"
        aria-label="Admin Console Sections"
        className="flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-zinc-100 border border-zinc-200"
      >
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'orders', label: `Orders (${adminState?.orders.length ?? 0})` },
          { id: 'trials', label: `Free Trials (${adminState?.trialRequests.length ?? 0})` },
          { id: 'customers', label: `Customers (${adminState?.profiles.length ?? 0})` },
          { id: 'cms', label: `Blog & SEO CMS (${adminState?.articles.length ?? 0})` },
          { id: 'emails', label: 'Email Templates & Activity' },
        ].map((tab) => (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white text-zinc-900 font-semibold shadow-2xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {errorMsg && (
        <div role="alert" className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-xs text-rose-800">
          {errorMsg}
        </div>
      )}

      {loading && !adminState ? (
        <div className="p-12 text-center text-sm text-zinc-500">Loading store records...</div>
      ) : (
        adminState && (
          <>
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 tabular-nums">
                  <div className="p-5 rounded-2xl border border-zinc-200 bg-white">
                    <p className="text-xs text-zinc-500">Confirmed Paid Revenue</p>
                    <p className="text-lg sm:text-xl font-bold text-emerald-700 mt-1.5 whitespace-nowrap">
                      {formatUsdFromCents(adminState.metrics.verifiedRevenueCents)} USD
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl border border-zinc-200 bg-white">
                    <p className="text-xs text-zinc-500">Total Orders / Paid</p>
                    <p className="text-lg sm:text-xl font-bold text-zinc-900 mt-1.5 whitespace-nowrap">
                      {adminState.metrics.totalOrders} Orders · {adminState.metrics.paidOrders} Paid
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl border border-zinc-200 bg-white">
                    <p className="text-xs text-zinc-500">Active / Pending</p>
                    <p className="text-lg sm:text-xl font-bold text-blue-600 mt-1.5 whitespace-nowrap">
                      {adminState.metrics.activeSubscriptions} Active · {adminState.metrics.pendingOrders} Pending
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl border border-zinc-200 bg-white">
                    <p className="text-xs text-zinc-500">Customers &amp; Trials</p>
                    <p className="text-lg sm:text-xl font-bold text-zinc-900 mt-1.5 whitespace-nowrap">
                      {adminState.metrics.totalCustomers} Cust · {adminState.metrics.trialRequestsCount} Trials
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4">
                  <h2 className="text-lg font-bold text-zinc-900 font-display">
                    Recent Store Activity
                  </h2>
                  <div className="divide-y divide-zinc-100 text-xs">
                    {adminState.auditLogs.slice(0, 6).map((log) => (
                      <div key={log.logId} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="font-semibold text-blue-600">{log.logId}</span>
                          <span className="mx-2 text-zinc-300">·</span>
                          <strong className="text-zinc-900">{log.action}</strong>
                          <p className="text-zinc-500 mt-0.5">{log.details}</p>
                        </div>
                        <span className="text-zinc-400 shrink-0">
                          {log.createdAt.slice(0, 19).replace('T', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ORDER MANAGEMENT */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h2 className="text-xl font-bold text-zinc-900 font-display">
                    Customer Orders
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {['All', 'Pending', 'Active', 'Payment Under Review', 'Paid', 'Cancelled'].map(
                      (st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setOrderStatusFilter(st)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                            orderStatusFilter === st
                              ? 'bg-blue-600 text-white font-semibold'
                              : 'bg-white text-zinc-600 border border-zinc-200'
                          }`}
                        >
                          {st}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-zinc-200 text-zinc-500 bg-zinc-50">
                        <th className="py-3.5 px-4 font-semibold">Order &amp; Customer</th>
                        <th className="py-3.5 px-4 font-semibold">Plan &amp; Price</th>
                        <th className="py-3.5 px-4 font-semibold">Order Status</th>
                        <th className="py-3.5 px-4 font-semibold">Payment</th>
                        <th className="py-3.5 px-4 font-semibold">Subscription</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 tabular-nums">
                      {filteredOrders.map((ord) => (
                        <tr key={ord.orderId} className="hover:bg-zinc-50/80">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-zinc-900">{ord.orderId}</div>
                            <div className="text-zinc-600">{ord.customerEmail}</div>
                            <div className="text-zinc-400">{ord.deviceType}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="text-zinc-900 font-medium">{ord.planName}</div>
                            <div className="text-blue-600 font-semibold">
                              {formatUsdFromCents(ord.amountCents)} · {ord.paymentMethod}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-zinc-800">{ord.orderStatus}</td>
                          <td className="py-3.5 px-4 text-amber-700 font-medium">{ord.paymentStatus}</td>
                          <td className="py-3.5 px-4 text-emerald-700 font-medium">
                            <div>{ord.subscriptionStatus}</div>
                            {ord.activationDate && (
                              <div className="text-[11px] text-zinc-400">
                                {ord.activationDate}..{ord.expirationDate}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateOrder(ord.orderId, {
                                  orderStatus: 'Active',
                                  paymentStatus: 'Paid',
                                  subscriptionStatus: 'Active',
                                })
                              }
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-semibold transition-colors cursor-pointer"
                            >
                              Mark Paid &amp; Activate
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateOrder(ord.orderId, {
                                  orderStatus: 'Cancelled',
                                  subscriptionStatus: 'Cancelled',
                                })
                              }
                              className="px-2.5 py-1.5 rounded-lg bg-zinc-100 text-zinc-700 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateOrder(ord.orderId, {
                                  paymentStatus: 'Refunded',
                                  subscriptionStatus: 'Cancelled',
                                })
                              }
                              className="px-2.5 py-1.5 rounded-lg bg-zinc-100 text-zinc-700 hover:text-amber-700 transition-colors cursor-pointer"
                            >
                              Refund
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: TRIAL MANAGEMENT */}
            {activeTab === 'trials' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-zinc-900 font-display">
                  4-Hour Free Trial Requests
                </h2>
                <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-zinc-200 text-zinc-500 bg-zinc-50">
                        <th className="py-3.5 px-4 font-semibold">Trial ID &amp; Email</th>
                        <th className="py-3.5 px-4 font-semibold">TV &amp; Player App</th>
                        <th className="py-3.5 px-4 font-semibold">Length</th>
                        <th className="py-3.5 px-4 font-semibold">Status</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 tabular-nums">
                      {adminState.trialRequests.map((tr) => (
                        <tr key={tr.trialId} className="hover:bg-zinc-50/80">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-zinc-900">{tr.trialId}</div>
                            <div className="text-zinc-600">{tr.customerEmail}</div>
                          </td>
                          <td className="py-3.5 px-4 text-zinc-700">
                            {tr.deviceType} · {tr.playerApp}
                          </td>
                          <td className="py-3.5 px-4 text-blue-600 font-medium">Up to {tr.durationHours} Hours</td>
                          <td className="py-3.5 px-4">
                            <div className="text-amber-700 font-semibold">{tr.status}</div>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleUpdateTrial(tr.trialId, 'Active')}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-semibold cursor-pointer"
                            >
                              Approve (4h)
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateTrial(tr.trialId, 'Expired')}
                              className="px-2.5 py-1.5 rounded-lg bg-zinc-100 text-zinc-700 hover:bg-zinc-200 cursor-pointer"
                            >
                              Expire
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateTrial(tr.trialId, 'Rejected')}
                              className="px-2.5 py-1.5 rounded-lg bg-zinc-100 text-rose-700 hover:bg-rose-50 cursor-pointer"
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: CUSTOMER MANAGEMENT */}
            {activeTab === 'customers' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-xl font-bold text-zinc-900 font-display">
                    Customers
                  </h2>
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="search"
                      aria-label="Search customers"
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      placeholder="Search email or name..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredCustomers.map((cust) => {
                    const custOrders = adminState.orders.filter(
                      (o) => o.customerEmail.toLowerCase() === cust.email.toLowerCase()
                    );
                    const currentNote =
                      noteDrafts[cust.uid] !== undefined
                        ? noteDrafts[cust.uid]
                        : cust.internalNotes;
                    return (
                      <div
                        key={cust.uid}
                        className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-base font-bold text-zinc-900 font-display">
                              {cust.displayName}
                            </h3>
                            <p className="text-xs text-blue-600 font-medium">{cust.email}</p>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              TV: {cust.preferredDevice} · Orders: {custOrders.length}
                            </p>
                          </div>
                          <span className="text-xs text-zinc-400">{cust.role}</span>
                        </div>

                        <div className="space-y-2">
                          <label
                            htmlFor={`note-${cust.uid}`}
                            className="block text-xs font-semibold text-zinc-700"
                          >
                            Admin Notes
                          </label>
                          <div className="flex gap-2">
                            <input
                              id={`note-${cust.uid}`}
                              type="text"
                              value={currentNote}
                              onChange={(e) =>
                                setNoteDrafts((prev) => ({ ...prev, [cust.uid]: e.target.value }))
                              }
                              className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveCustomerNote(cust.uid)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 5: EDITORIAL CMS */}
            {activeTab === 'cms' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <form
                  onSubmit={handlePublishArticle}
                  className="lg:col-span-7 rounded-2xl border border-zinc-200 bg-white p-6 space-y-4"
                >
                  <h2 className="text-xl font-bold text-zinc-900 font-display">
                    Publish New SEO Blog Article
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Articles marked "Verified &amp; Published" automatically appear on /blog and join /sitemap.xml.
                  </p>

                  {cmsSuccess && (
                    <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-xs text-emerald-900">
                      {cmsSuccess}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cms-slug" className="block text-xs font-semibold text-zinc-800 mb-1">
                        URL Slug
                      </label>
                      <input
                        id="cms-slug"
                        type="text"
                        required
                        value={cmsSlug}
                        onChange={(e) => setCmsSlug(e.target.value)}
                        placeholder="e.g., fire-tv-setup-tips"
                        className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900"
                      />
                    </div>
                    <div>
                      <label htmlFor="cms-status" className="block text-xs font-semibold text-zinc-800 mb-1">
                        Status
                      </label>
                      <select
                        id="cms-status"
                        value={cmsReviewStatus}
                        onChange={(e) => setCmsReviewStatus(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900"
                      >
                        <option value="Draft">Draft (Hidden)</option>
                        <option value="In Review">In Review</option>
                        <option value="Verified & Published">Verified &amp; Published (Live)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cms-title" className="block text-xs font-semibold text-zinc-800 mb-1">
                      Article Title
                    </label>
                    <input
                      id="cms-title"
                      type="text"
                      required
                      value={cmsTitle}
                      onChange={(e) => setCmsTitle(e.target.value)}
                      placeholder="Article headline..."
                      className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cms-cat" className="block text-xs font-semibold text-zinc-800 mb-1">
                        Category
                      </label>
                      <select
                        id="cms-cat"
                        value={cmsCategory}
                        onChange={(e) => setCmsCategory(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900"
                      >
                        <option value="Setup Guides">Setup Guides</option>
                        <option value="Player Software">Player Software</option>
                        <option value="Device Compatibility">Device Compatibility</option>
                        <option value="Troubleshooting">Troubleshooting</option>
                        <option value="Buyer Resources">Buyer Resources</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="cms-seo-title" className="block text-xs font-semibold text-zinc-800 mb-1">
                        SEO Meta Title
                      </label>
                      <input
                        id="cms-seo-title"
                        type="text"
                        required
                        value={cmsSeoTitle}
                        onChange={(e) => setCmsSeoTitle(e.target.value)}
                        placeholder="Title Tag | Lumiq TV"
                        className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cms-excerpt" className="block text-xs font-semibold text-zinc-800 mb-1">
                      Short Summary
                    </label>
                    <input
                      id="cms-excerpt"
                      type="text"
                      required
                      value={cmsExcerpt}
                      onChange={(e) => setCmsExcerpt(e.target.value)}
                      placeholder="Short summary..."
                      className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900"
                    />
                  </div>

                  <div>
                    <label htmlFor="cms-seo-desc" className="block text-xs font-semibold text-zinc-800 mb-1">
                      SEO Meta Description
                    </label>
                    <input
                      id="cms-seo-desc"
                      type="text"
                      required
                      value={cmsSeoDesc}
                      onChange={(e) => setCmsSeoDesc(e.target.value)}
                      placeholder="Google search snippet description..."
                      className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900"
                    />
                  </div>

                  <div>
                    <label htmlFor="cms-content" className="block text-xs font-semibold text-zinc-800 mb-1">
                      Article Content
                    </label>
                    <textarea
                      id="cms-content"
                      rows={5}
                      required
                      value={cmsContent}
                      onChange={(e) => setCmsContent(e.target.value)}
                      placeholder="Write helpful article content..."
                      className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                  >
                    Publish Article
                  </button>
                </form>

                <div className="lg:col-span-5 space-y-4">
                  <h3 className="text-base font-bold text-zinc-900 font-display">
                    Published Articles ({adminState.articles.length})
                  </h3>
                  {adminState.articles.map((art) => (
                    <div
                      key={art.articleId}
                      className="p-4 rounded-2xl border border-zinc-200 bg-white space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-blue-600 font-medium">{art.category}</span>
                        <span className="text-emerald-700 font-medium">{art.reviewStatus}</span>
                      </div>
                      <div className="font-bold text-zinc-900 text-sm">{art.title}</div>
                      <p className="text-zinc-500">URL: /blog/{art.slug}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: TRANSACTIONAL EMAIL TEMPLATES & AUDIT LOG */}
            {activeTab === 'emails' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-6 rounded-2xl border border-zinc-200 bg-white p-6 space-y-4">
                  <h2 className="text-lg font-bold text-zinc-900 font-display">
                    Customer Email Previews
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Preview the automated emails sent to customers for orders, trials, and support.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="email-type-select" className="block text-xs text-zinc-700 mb-1">
                        Email Type
                      </label>
                      <select
                        id="email-type-select"
                        value={selectedEmailType}
                        onChange={(e) =>
                          setSelectedEmailType(e.target.value as TransactionalEmailType)
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900"
                      >
                        <option value="welcome_account">1. Welcome Email</option>
                        <option value="order_received">2. Order Received</option>
                        <option value="payment_requires_review">3. Payment Under Review</option>
                        <option value="payment_confirmed">4. Payment Confirmed</option>
                        <option value="subscription_activated">5. Subscription Activated</option>
                        <option value="trial_request_received">6. Trial Requested</option>
                        <option value="trial_approved">7. Trial Approved (4h)</option>
                        <option value="subscription_expiration_reminder">
                          8. Renewal Reminder
                        </option>
                        <option value="order_cancelled">9. Order Cancelled</option>
                        <option value="support_request_received">10. Support Ticket Received</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="email-plan-select" className="block text-xs text-zinc-700 mb-1">
                        Sample Plan
                      </label>
                      <select
                        id="email-plan-select"
                        value={selectedEmailPlanId}
                        onChange={(e) => setSelectedEmailPlanId(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900"
                      >
                        {SUBSCRIPTION_PLANS.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({formatUsdFromCents(p.amountCents)})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-zinc-200 bg-[#FAFAFA] space-y-2 text-xs">
                    <div className="text-zinc-900 font-bold">Subject: {emailPreview.subject}</div>
                    <div className="pt-2 border-t border-zinc-200 whitespace-pre-line text-zinc-600 leading-relaxed">
                      {emailPreview.bodyText}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 rounded-2xl border border-zinc-200 bg-white p-6 space-y-4">
                  <h2 className="text-lg font-bold text-zinc-900 font-display">
                    Store Activity Log ({adminState.auditLogs.length})
                  </h2>
                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                    {adminState.auditLogs.map((log) => (
                      <div
                        key={log.logId}
                        className="p-3.5 rounded-xl border border-zinc-200 bg-[#FAFAFA] text-xs space-y-1"
                      >
                        <div className="flex justify-between text-blue-600 font-medium">
                          <span>{log.logId} · {log.targetType.toUpperCase()} ({log.targetId})</span>
                          <span className="text-zinc-400">{log.createdAt.slice(0, 19).replace('T', ' ')}</span>
                        </div>
                        <div className="font-bold text-zinc-900">{log.action}</div>
                        <div className="text-zinc-600">{log.details}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )
      )}
    </div>
  );
};
