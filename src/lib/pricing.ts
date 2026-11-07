import { z } from 'zod';

export type OrderStatus = 'Pending' | 'Processing' | 'Active' | 'Cancelled';
export type PaymentStatus = 'Awaiting Payment' | 'Payment Under Review' | 'Paid' | 'Refunded';
export type SubscriptionStatus = 'Pending' | 'Active' | 'Expired' | 'Cancelled';
export type TrialStatus = 'Pending' | 'Approved' | 'Active' | 'Expired' | 'Rejected';
export type PaymentMethodId = 'manual_invoice' | 'bank_transfer' | 'card_gateway_pending' | 'crypto_manual';

export interface SubscriptionPlan {
  id: string;
  name: string;
  shortLabel: string;
  durationMonths: 1 | 3 | 6 | 12 | 24 | 36 | 48;
  connections: 1 | 3;
  amountCents: number;
  priceUsd: number;
  currency: 'USD';
  isMultiConnectionBundle: boolean;
  featured?: boolean;
  targetAudience: string;
  description: string;
}

export const FREE_TRIAL_CONFIG = {
  durationHours: 4 as const,
  label: 'Up to 4 hours',
  connections: 1 as const,
  priceCents: 0 as const,
  summary:
    'Evaluate Lumiq TV stream stability, EPG responsiveness, and player compatibility on your own device for up to 4 hours before selecting a paid plan.',
};

/**
 * Single Source of Truth for confirmed Lumiq TV subscription pricing.
 * Never hardcode prices outside this module.
 */
export const SUBSCRIPTION_PLANS: readonly SubscriptionPlan[] = [
  {
    id: 'plan-1m-1c',
    name: '1 Month IPTV Subscription',
    shortLabel: '1 Month',
    durationMonths: 1,
    connections: 1,
    amountCents: 1000,
    priceUsd: 10,
    currency: 'USD',
    isMultiConnectionBundle: false,
    targetAudience: 'For short-term evaluation & flexible monthly access',
    description: 'Single-connection access for 30 days with standard M3U and Xtream Codes player compatibility.',
  },
  {
    id: 'plan-3m-1c',
    name: '3 Months IPTV Subscription',
    shortLabel: '3 Months',
    durationMonths: 3,
    connections: 1,
    amountCents: 2000,
    priceUsd: 20,
    currency: 'USD',
    isMultiConnectionBundle: false,
    targetAudience: 'For seasonal viewers seeking quarterly billing value',
    description: 'Single-connection access for 3 months at $6.67/month equivalent compared to monthly billing.',
  },
  {
    id: 'plan-6m-1c',
    name: '6 Months IPTV Subscription',
    shortLabel: '6 Months',
    durationMonths: 6,
    connections: 1,
    amountCents: 3000,
    priceUsd: 30,
    currency: 'USD',
    isMultiConnectionBundle: false,
    targetAudience: 'For semi-annual households reducing renewal frequency',
    description: 'Single-connection access for 6 months at $5.00/month equivalent — 50% lower than the 1-month rate.',
  },
  {
    id: 'plan-12m-1c',
    name: '12 Months IPTV Subscription',
    shortLabel: '12 Months',
    durationMonths: 12,
    connections: 1,
    amountCents: 5000,
    priceUsd: 50,
    currency: 'USD',
    isMultiConnectionBundle: false,
    featured: true,
    targetAudience: 'For primary home entertainment setups (Annual Plan)',
    description: 'Full 12-month single-connection subscription at $4.17/month equivalent with priority setup assistance.',
  },
  {
    id: 'plan-24m-1c',
    name: '24 Months IPTV Subscription',
    shortLabel: '24 Months',
    durationMonths: 24,
    connections: 1,
    amountCents: 9000,
    priceUsd: 90,
    currency: 'USD',
    isMultiConnectionBundle: false,
    targetAudience: 'For two-year uninterrupted single-screen access',
    description: '24-month single-connection plan at $3.75/month equivalent across two full years.',
  },
  {
    id: 'plan-36m-1c',
    name: '36 Months IPTV Subscription',
    shortLabel: '36 Months',
    durationMonths: 36,
    connections: 1,
    amountCents: 12000,
    priceUsd: 120,
    currency: 'USD',
    isMultiConnectionBundle: false,
    targetAudience: 'For long-term viewers locking in a 3-year rate',
    description: '36-month single-connection subscription at $3.33/month equivalent.',
  },
  {
    id: 'plan-48m-1c',
    name: '48 Months IPTV Subscription',
    shortLabel: '48 Months',
    durationMonths: 48,
    connections: 1,
    amountCents: 14000,
    priceUsd: 140,
    currency: 'USD',
    isMultiConnectionBundle: false,
    targetAudience: 'For maximum long-horizon value on a single connection',
    description: '48-month single-connection plan at $2.92/month equivalent — our lowest effective monthly rate.',
  },
  {
    id: 'bundle-12m-3c',
    name: '3 Connections × 12 Months Household Bundle',
    shortLabel: '12 Months · 3 Connections',
    durationMonths: 12,
    connections: 3,
    amountCents: 12000,
    priceUsd: 120,
    currency: 'USD',
    isMultiConnectionBundle: true,
    targetAudience: 'For multi-screen households streaming on up to 3 devices simultaneously',
    description: 'Confirmed 3-connection annual bundle ($120 for 12 months across 3 concurrent connections — $3.33/mo per connection).',
  },
] as const;

export const SINGLE_CONNECTION_PLANS = SUBSCRIPTION_PLANS.filter((p) => !p.isMultiConnectionBundle);
export const MULTI_CONNECTION_BUNDLE = SUBSCRIPTION_PLANS.find((p) => p.id === 'bundle-12m-3c')!;

export const BASELINE_MONTHLY_CENTS = 1000; // $10.00 for 1 Month, 1 Connection

export interface PlanSavingsAnalysis {
  monthlyEquivalentCents: number;
  monthlyEquivalentPerConnectionCents: number;
  baselineTotalCents: number;
  savedCents: number;
  savedPercentage: number;
  comparisonNote: string;
}

/**
 * Mathematically exact comparison against the confirmed 1-Month ($10) plan.
 */
export function calculatePlanSavings(plan: SubscriptionPlan): PlanSavingsAnalysis {
  const monthlyEquivalentCents = Math.round(plan.amountCents / plan.durationMonths);
  const monthlyEquivalentPerConnectionCents = Math.round(
    plan.amountCents / (plan.durationMonths * plan.connections)
  );
  const baselineTotalCents = plan.durationMonths * plan.connections * BASELINE_MONTHLY_CENTS;
  const savedCents = Math.max(0, baselineTotalCents - plan.amountCents);
  const savedPercentage =
    baselineTotalCents > 0 ? Math.round((savedCents / baselineTotalCents) * 1000) / 10 : 0;

  const comparisonNote =
    savedCents === 0
      ? 'Standard 1-month baseline rate ($10/month for 1 connection)'
      : `Saves ${formatUsdFromCents(savedCents)} (${savedPercentage}%) vs. ${plan.durationMonths} × $10 monthly rate${
          plan.connections > 1 ? ` across ${plan.connections} connections` : ''
        }`;

  return {
    monthlyEquivalentCents,
    monthlyEquivalentPerConnectionCents,
    baselineTotalCents,
    savedCents,
    savedPercentage,
    comparisonNote,
  };
}

export function getPlanById(planId: string): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find((plan) => plan.id === planId);
}

export function formatUsdFromCents(cents: number, showDecimals = false): string {
  const dollars = cents / 100;
  if (!showDecimals && cents % 100 === 0) {
    return `$${dollars.toFixed(0)}`;
  }
  return `$${dollars.toFixed(2)}`;
}

export const PAYMENT_METHODS: readonly {
  id: PaymentMethodId;
  label: string;
  verificationMode: 'Manual Admin Verification' | 'Webhook Gateway (Requires Configuration)';
  instructions: string;
}[] = [
  {
    id: 'manual_invoice',
    label: 'Direct Payment Invoice (Admin Verified)',
    verificationMode: 'Manual Admin Verification',
    instructions:
      'Your order is created in Pending status. We send a payment invoice link to your email, and an administrator activates your subscription upon verification.',
  },
  {
    id: 'bank_transfer',
    label: 'Bank / Wire Transfer (Manual Review)',
    verificationMode: 'Manual Admin Verification',
    instructions:
      'Submit your order to receive transfer reference details. Your payment status remains Awaiting Payment until verified by our billing team.',
  },
  {
    id: 'card_gateway_pending',
    label: 'Automated Card Checkout (Gateway Adapter)',
    verificationMode: 'Webhook Gateway (Requires Configuration)',
    instructions:
      'Modular webhook checkout adapter. Until live merchant credentials are configured in environment settings, orders are queued for manual invoice fulfillment.',
  },
  {
    id: 'crypto_manual',
    label: 'Digital Asset Settlement (Manual Verification)',
    verificationMode: 'Manual Admin Verification',
    instructions:
      'Generates an order reference for manual settlement review. Subscriptions activate only after on-chain confirmation by an administrator.',
  },
] as const;

export const SUPPORTED_DEVICES = [
  'Android TV / Google TV',
  'Amazon Fire TV / FireStick',
  'Samsung Smart TV (Tizen)',
  'LG Smart TV (webOS)',
  'Apple TV (tvOS)',
  'iOS / Android Mobile',
  'Windows / macOS Player',
  'MAG / Enigma2 Box',
] as const;

export const SUPPORTED_PLAYERS = [
  'IPTV Smarters Pro',
  'TiviMate IPTV Player',
  'IBO Player',
  'XCIPTV Player',
  'VLC Media Player',
  'Other M3U / Xtream Player',
] as const;

// Zod Validation Schemas synchronized with firebase-blueprint.json
export const idPattern = /^[a-zA-Z0-9_\-]+$/;

export const orderCheckoutSchema = z.object({
  planId: z
    .string()
    .min(1)
    .max(64)
    .regex(idPattern, 'Invalid plan identifier')
    .refine((val) => Boolean(getPlanById(val)), 'Selected subscription plan is not in the confirmed catalog'),
  customerEmail: z
    .string()
    .trim()
    .min(3, 'Email address is required')
    .max(254, 'Email must be 254 characters or fewer')
    .email('Please enter a valid email address'),
  deviceType: z.string().min(1, 'Please select your primary streaming device').max(64),
  paymentMethod: z.enum(['manual_invoice', 'bank_transfer', 'card_gateway_pending', 'crypto_manual']),
});

export const trialRequestSchema = z.object({
  customerEmail: z
    .string()
    .trim()
    .min(3, 'Email address is required')
    .max(254, 'Email must be 254 characters or fewer')
    .email('Please enter a valid email address'),
  deviceType: z.string().min(1, 'Please select your streaming device').max(64),
  playerApp: z.string().min(1, 'Please select your preferred IPTV player app').max(64),
});

export const supportRequestSchema = z.object({
  customerEmail: z
    .string()
    .trim()
    .min(3, 'Email address is required')
    .max(254)
    .email('Please enter a valid email address'),
  subject: z.string().trim().min(3, 'Subject must be at least 3 characters').max(160),
  category: z.enum(['setup', 'billing', 'trial', 'compatibility', 'general']),
  message: z.string().trim().min(5, 'Message must be at least 5 characters').max(2000),
});

export const articleCmsSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(128)
    .regex(idPattern, 'Slug may only contain letters, numbers, hyphens, and underscores'),
  title: z.string().trim().min(3).max(180),
  excerpt: z.string().trim().min(10).max(400),
  category: z.enum([
    'Setup Guides',
    'Player Software',
    'Device Compatibility',
    'Troubleshooting',
    'Buyer Resources',
  ]),
  content: z.string().trim().min(20).max(20000),
  authorName: z.string().trim().min(2).max(100),
  reviewStatus: z.enum(['Draft', 'In Review', 'Verified & Published']),
  seoTitle: z.string().trim().min(5).max(120),
  seoDescription: z.string().trim().min(10).max(240),
});

export type TransactionalEmailType =
  | 'welcome_account'
  | 'order_received'
  | 'payment_confirmed'
  | 'payment_requires_review'
  | 'subscription_activated'
  | 'trial_request_received'
  | 'trial_approved'
  | 'subscription_expiration_reminder'
  | 'order_cancelled'
  | 'support_request_received';

export interface RenderedEmailTemplate {
  type: TransactionalEmailType;
  title: string;
  subject: string;
  recipientEmail: string;
  deliveryModeNotice: string;
  bodyText: string;
}

export function renderTransactionalEmail(
  type: TransactionalEmailType,
  params: {
    recipientEmail: string;
    orderId?: string;
    planId?: string;
    trialId?: string;
    ticketId?: string;
    activationDate?: string;
    expirationDate?: string;
  }
): RenderedEmailTemplate {
  const plan = params.planId ? getPlanById(params.planId) ?? SINGLE_CONNECTION_PLANS[3] : SINGLE_CONNECTION_PLANS[3];
  const priceLabel = `${formatUsdFromCents(plan.amountCents)} USD (${plan.durationMonths} Month${
    plan.durationMonths > 1 ? 's' : ''
  }, ${plan.connections} Connection${plan.connections > 1 ? 's' : ''})`;
  const deliveryModeNotice =
    'Provider Status: Configurable Email Adapter (Preview Queue Mode — live SMTP/Resend credentials required before automated external delivery).';

  switch (type) {
    case 'welcome_account':
      return {
        type,
        title: 'Welcome / Account Access',
        subject: 'Welcome to Lumiq TV — Your Account Access Details',
        recipientEmail: params.recipientEmail,
        deliveryModeNotice,
        bodyText: `Hello,\n\nYour customer account (${params.recipientEmail}) is ready. From your account dashboard you can review your IPTV subscription status, track order verification, check 4-hour free trial requests, and access device setup tutorials.\n\n— Lumiq TV Support`,
      };
    case 'order_received':
      return {
        type,
        title: 'Order Received',
        subject: `IPTV Subscription Order Received (${params.orderId ?? 'ORD-PENDING'}) — ${plan.name}`,
        recipientEmail: params.recipientEmail,
        deliveryModeNotice,
        bodyText: `Hello,\n\nWe have recorded your IPTV subscription order (${params.orderId ?? 'ORD-PENDING'}).\n\nSelected Plan: ${plan.name}\nConfirmed Price: ${priceLabel}\nOrder Status: Pending\nPayment Status: Awaiting Payment\nSubscription Status: Pending\n\nNext Step: Complete payment verification as instructed in your customer dashboard. Your IPTV subscription will be activated once payment is verified.\n\n— Lumiq TV Billing`,
      };
    case 'payment_requires_review':
      return {
        type,
        title: 'Payment Requires Review',
        subject: `Payment Under Review for IPTV Subscription Order ${params.orderId ?? 'ORD-REVIEW'}`,
        recipientEmail: params.recipientEmail,
        deliveryModeNotice,
        bodyText: `Hello,\n\nYour payment submission for IPTV subscription order ${params.orderId ?? 'ORD-REVIEW'} (${priceLabel}) has been marked as "Payment Under Review". Our billing team is verifying the transaction record and will update your dashboard upon confirmation.\n\n— Lumiq TV Billing`,
      };
    case 'payment_confirmed':
      return {
        type,
        title: 'Payment Confirmed',
        subject: `Payment Verified — IPTV Subscription Order ${params.orderId ?? 'ORD-PAID'}`,
        recipientEmail: params.recipientEmail,
        deliveryModeNotice,
        bodyText: `Hello,\n\nPayment of ${priceLabel} has been verified for IPTV subscription order ${params.orderId ?? 'ORD-PAID'}.\nPayment Status: Paid\nOrder Status: Processing\n\nOur fulfillment system is provisioning your ${plan.connections}-connection playlist credentials.\n\n— Lumiq TV Billing`,
      };
    case 'subscription_activated':
      return {
        type,
        title: 'Subscription Activated',
        subject: `Your IPTV Subscription is Active — ${plan.name}`,
        recipientEmail: params.recipientEmail,
        deliveryModeNotice,
        bodyText: `Hello,\n\nYour IPTV subscription (${plan.name} · ${priceLabel}) is now Active.\nActivation Date: ${params.activationDate ?? 'Verified Today'}\nExpiration Date: ${params.expirationDate ?? 'Scheduled'}\nConnections: ${plan.connections}\n\nVisit our Setup Guides (/guides/how-to-set-up-iptv) for step-by-step instructions on configuring your preferred IPTV player application.\n\n— Lumiq TV Provisioning`,
      };
    case 'trial_request_received':
      return {
        type,
        title: 'Trial Request Received',
        subject: `IPTV Free Trial Request Received (${params.trialId ?? 'TRL-PENDING'})`,
        recipientEmail: params.recipientEmail,
        deliveryModeNotice,
        bodyText: `Hello,\n\nWe received your 4-Hour IPTV Free Trial request (${params.trialId ?? 'TRL-PENDING'}).\nTrial Duration: ${FREE_TRIAL_CONFIG.label} (${FREE_TRIAL_CONFIG.connections} connection)\nCurrent Status: Pending Admin Review\n\nYou can track the real-time status of your trial request in your account dashboard.\n\n— Lumiq TV Support`,
      };
    case 'trial_approved':
      return {
        type,
        title: 'Trial Approved',
        subject: `Your 4-Hour IPTV Free Trial is Approved (${params.trialId ?? 'TRL-ACTIVE'})`,
        recipientEmail: params.recipientEmail,
        deliveryModeNotice,
        bodyText: `Hello,\n\nYour 4-Hour IPTV Free Trial (${FREE_TRIAL_CONFIG.label}) has been approved and activated.\nActivation Window: ${params.activationDate ?? 'Now'} to ${params.expirationDate ?? '+4 Hours'}\n\nWhen the 4-hour evaluation window concludes, trial access expires automatically with zero obligation. To continue watching, choose any IPTV subscription plan at /pricing.\n\n— Lumiq TV Support`,
      };
    case 'subscription_expiration_reminder':
      return {
        type,
        title: 'Subscription Expiration Reminder',
        subject: `Upcoming IPTV Subscription Expiration Notice (${plan.name})`,
        recipientEmail: params.recipientEmail,
        deliveryModeNotice,
        bodyText: `Hello,\n\nYour current IPTV subscription (${plan.name} · ${priceLabel}) is scheduled to expire on ${params.expirationDate ?? 'soon'}. We do not auto-charge stored cards without explicit renewal. Visit /pricing to select your renewal term.\n\n— Lumiq TV Account Team`,
      };
    case 'order_cancelled':
      return {
        type,
        title: 'Order Cancelled',
        subject: `IPTV Subscription Order Cancelled (${params.orderId ?? 'ORD-CANCELLED'})`,
        recipientEmail: params.recipientEmail,
        deliveryModeNotice,
        bodyText: `Hello,\n\nIPTV subscription order ${params.orderId ?? 'ORD-CANCELLED'} (${plan.name} · ${priceLabel}) has been marked as Cancelled. If you have questions regarding this status change, please reply or submit a ticket at /contact.\n\n— Lumiq TV Billing`,
      };
    case 'support_request_received':
      return {
        type,
        title: 'Support Request Received',
        subject: `Support Ticket Logged (${params.ticketId ?? 'TKT-OPEN'})`,
        recipientEmail: params.recipientEmail,
        deliveryModeNotice,
        bodyText: `Hello,\n\nWe have logged your support request (${params.ticketId ?? 'TKT-OPEN'}). Our technical support specialists review inquiries in queue order and update ticket status directly in your account area.\n\n— Lumiq TV Technical Support`,
      };
  }
}
