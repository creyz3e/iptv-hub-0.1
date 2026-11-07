import { SUBSCRIPTION_PLANS, FREE_TRIAL_CONFIG } from './pricing.ts';
import { INITIAL_EDITORIAL_ARTICLES, FAQ_CATALOG } from './content.ts';

export interface RouteSeoMeta {
  path: string;
  title: string;
  description: string;
  canonicalPath: string;
  robots: 'index, follow' | 'noindex, nofollow';
  ogType: 'website' | 'article';
  primaryKeyword: string;
  breadcrumbs: { name: string; path: string }[];
  jsonLd: Record<string, unknown>[];
  ssrSummaryHeading: string;
  ssrSummaryBody: string;
}

export const PUBLIC_INDEXABLE_PATHS: readonly string[] = [
  '/',
  '/pricing',
  '/free-trial',
  '/iptv-smarters-pro-subscription',
  '/iptv-players',
  '/devices',
  '/devices/android-tv',
  '/devices/fire-tv',
  '/devices/samsung-tv',
  '/devices/lg-tv',
  '/devices/apple-tv',
  '/guides',
  '/guides/how-to-set-up-iptv',
  '/guides/iptv-smarters-pro-setup',
  '/guides/iptv-smarters-pro-not-working',
  '/blog',
  ...INITIAL_EDITORIAL_ARTICLES.map((a) => `/blog/${a.slug}`),
  '/faq',
  '/contact',
  '/terms',
  '/privacy',
  '/refund-policy',
  '/copyright',
  '/compatibility-disclosure',
] as const;

export const NOINDEX_PRIVATE_PATHS: readonly string[] = [
  '/login',
  '/account',
  '/account/orders',
  '/admin',
  '/checkout',
] as const;

function buildOrganizationSchema(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Lumiq TV',
    url: baseUrl,
    description:
      'Lumiq TV is an IPTV subscription platform offering verified single-connection and multi-connection plans, 4-hour free trial evaluation, and TV player setup guides.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: `${baseUrl}/contact`,
      availableLanguage: ['English'],
    },
  };
}

function buildWebSiteSchema(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Lumiq TV',
    url: baseUrl,
  };
}

function buildBreadcrumbSchema(baseUrl: string, items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: `${baseUrl}${item.path === '/' ? '' : item.path}`,
    })),
  };
}

function buildOfferCatalogSchema(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'IPTV Subscription Plans — Lumiq TV',
    provider: {
      '@type': 'Organization',
      name: 'Lumiq TV',
      url: baseUrl,
    },
    serviceType: 'IPTV Subscription Service',
    offers: SUBSCRIPTION_PLANS.map((plan) => ({
      '@type': 'Offer',
      name: plan.name,
      description: `${plan.durationMonths} Month${plan.durationMonths > 1 ? 's' : ''} · ${plan.connections} Connection${plan.connections > 1 ? 's' : ''}`,
      price: plan.priceUsd.toFixed(2),
      priceCurrency: 'USD',
      url: `${baseUrl}/pricing`,
    })),
  };
}

function buildFaqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_CATALOG.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function getRouteSeoMeta(rawPath: string, baseUrl = 'https://lumiqtv.example.com'): RouteSeoMeta {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const path = rawPath.split('?')[0].replace(/\/+$/, '') || '/';

  const routeMap: Record<string, Omit<RouteSeoMeta, 'jsonLd'> & { extraJsonLd?: Record<string, unknown>[] }> = {
    '/': {
      path: '/',
      title: 'IPTV Subscription Plans & 4-Hour Trial | Lumiq TV',
      description:
        'Flexible IPTV subscription plans by Lumiq TV starting at $10/month. Compatible with standard M3U & Xtream players on Smart TVs, Fire TV, Android TV, and Apple TV.',
      canonicalPath: '/',
      robots: 'index, follow',
      ogType: 'website',
      primaryKeyword: 'IPTV Subscription',
      breadcrumbs: [{ name: 'Home', path: '/' }],
      ssrSummaryHeading: 'IPTV Subscription for Smart TVs, FireStick & Streaming Devices — Lumiq TV',
      ssrSummaryBody:
        'Lumiq TV delivers transparent IPTV subscription plans from 1 month ($10) to 48 months ($140), a confirmed 3-connection annual bundle ($120), and an up to 4-hour free trial.',
      extraJsonLd: [
        buildOrganizationSchema(cleanBase),
        buildWebSiteSchema(cleanBase),
        buildOfferCatalogSchema(cleanBase),
        buildFaqSchema(),
      ],
    },
    '/pricing': {
      path: '/pricing',
      title: 'IPTV Subscription Plans & Confirmed Pricing | Lumiq TV',
      description:
        'Compare confirmed IPTV subscription plans: 1 Month ($10), 3 Months ($20), 6 Months ($30), 12 Months ($50), up to 48 Months ($140), plus the 3-connection annual bundle ($120).',
      canonicalPath: '/pricing',
      robots: 'index, follow',
      ogType: 'website',
      primaryKeyword: 'IPTV Subscription Plans',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Subscription Plans & Pricing', path: '/pricing' },
      ],
      ssrSummaryHeading: 'IPTV Subscription Plans & Transparent Pricing',
      ssrSummaryBody:
        'Confirmed single-connection plans from $10 (1 Month) to $140 (48 Months) and our 3 Connections × 12 Months household bundle for $120 USD. No lifetime plans or hidden fees.',
      extraJsonLd: [buildOfferCatalogSchema(cleanBase)],
    },
    '/free-trial': {
      path: '/free-trial',
      title: 'IPTV Free Trial — Up to 4 Hours Evaluation | Lumiq TV',
      description:
        'Request an IPTV free trial for up to 4 hours with Lumiq TV. Test playlist setup and stream compatibility on your Smart TV, Fire TV, Android TV, or preferred IPTV player.',
      canonicalPath: '/free-trial',
      robots: 'index, follow',
      ogType: 'website',
      primaryKeyword: 'IPTV Free Trial',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'IPTV Free Trial', path: '/free-trial' },
      ],
      ssrSummaryHeading: `Request a 4-Hour IPTV Free Trial (${FREE_TRIAL_CONFIG.label})`,
      ssrSummaryBody:
        'Submit your email and device/player selection to request a 4-hour trial evaluation. Track approval and expiration status directly from My Account.',
    },
    '/iptv-smarters-pro-subscription': {
      path: '/iptv-smarters-pro-subscription',
      title: 'IPTV Smarters Pro Subscription Compatibility Guide | Lumiq TV',
      description:
        'Learn how an IPTV subscription works with the IPTV Smarters Pro player app using Xtream Codes API or M3U credentials, including setup steps and trademark disclosures.',
      canonicalPath: '/iptv-smarters-pro-subscription',
      robots: 'index, follow',
      ogType: 'article',
      primaryKeyword: 'IPTV Smarters Pro Subscription',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'IPTV Players', path: '/iptv-players' },
        { name: 'IPTV Smarters Pro Subscription Guide', path: '/iptv-smarters-pro-subscription' },
      ],
      ssrSummaryHeading: 'Using Your IPTV Subscription with IPTV Smarters Pro',
      ssrSummaryBody:
        'Understand the difference between the third-party IPTV Smarters Pro media player software and an IPTV subscription. Lumiq TV is an independent provider and is not affiliated with IPTV Smarters Pro.',
    },
    '/iptv-players': {
      path: '/iptv-players',
      title: 'IPTV Players & App Compatibility Resource Hub | Lumiq TV',
      description:
        'Educational guide comparing IPTV player applications (IPTV Smarters Pro, TiviMate, IBO Player, VLC) and explaining how M3U playlists and Xtream Codes API credentials work.',
      canonicalPath: '/iptv-players',
      robots: 'index, follow',
      ogType: 'website',
      primaryKeyword: 'IPTV Player Compatibility',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'IPTV Players Hub', path: '/iptv-players' },
      ],
      ssrSummaryHeading: 'IPTV Player Applications & Subscription Compatibility Hub',
      ssrSummaryBody:
        'IPTV player apps are software interfaces that decode M3U playlists and Xtream Codes API streams; they do not include content subscriptions of their own.',
    },
    '/devices': {
      path: '/devices',
      title: 'IPTV Device Compatibility — Smart TVs & Streaming Boxes | Lumiq TV',
      description:
        'Check verified IPTV device compatibility for Android TV, Amazon Fire TV, Samsung Smart TV (Tizen), LG webOS TV, and Apple TV (tvOS) with dedicated installation instructions.',
      canonicalPath: '/devices',
      robots: 'index, follow',
      ogType: 'website',
      primaryKeyword: 'IPTV for Smart TV',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Device Compatibility', path: '/devices' },
      ],
      ssrSummaryHeading: 'IPTV Subscription Compatibility for Smart TVs & Streaming Devices',
      ssrSummaryBody:
        'Explore operating-system-specific requirements, supported IPTV player apps, and network optimization steps for Android TV, Fire TV, Samsung Tizen, LG webOS, and Apple TV.',
    },
    '/devices/android-tv': {
      path: '/devices/android-tv',
      title: 'IPTV for Android TV & Google TV — Setup & Player Guide | Lumiq TV',
      description:
        'Complete guide to setting up an IPTV subscription on Android TV and Google TV boxes (Nvidia Shield, Sony Bravia, Chromecast) using Google Play Store players.',
      canonicalPath: '/devices/android-tv',
      robots: 'index, follow',
      ogType: 'article',
      primaryKeyword: 'IPTV for Android TV',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Devices', path: '/devices' },
        { name: 'Android TV & Google TV', path: '/devices/android-tv' },
      ],
      ssrSummaryHeading: 'IPTV for Android TV & Google TV: Compatibility & Setup',
      ssrSummaryBody:
        'Android TV and Google TV support native IPTV players such as TiviMate and IPTV Smarters Pro with hardware-accelerated decoding and XMLTV Electronic Program Guides.',
    },
    '/devices/fire-tv': {
      path: '/devices/fire-tv',
      title: 'IPTV for Fire TV & FireStick — Setup & Troubleshooting | Lumiq TV',
      description:
        'Step-by-step instructions for configuring an IPTV subscription on Amazon Fire TV Stick 4K, Fire TV Cube, and Fire OS televisions.',
      canonicalPath: '/devices/fire-tv',
      robots: 'index, follow',
      ogType: 'article',
      primaryKeyword: 'IPTV for Fire TV',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Devices', path: '/devices' },
        { name: 'Amazon Fire TV', path: '/devices/fire-tv' },
      ],
      ssrSummaryHeading: 'IPTV for Amazon Fire TV & FireStick: Complete Configuration Guide',
      ssrSummaryBody:
        'Configure Fire OS devices for reliable IPTV playback, manage cache storage on Fire TV Stick hardware, and enter Xtream Codes or M3U credentials accurately.',
    },
    '/devices/samsung-tv': {
      path: '/devices/samsung-tv',
      title: 'IPTV for Samsung Smart TV (Tizen OS) — Setup Guide | Lumiq TV',
      description:
        'How to use an IPTV subscription on Samsung Tizen Smart TVs via Samsung Smart Hub player apps or an external streaming device.',
      canonicalPath: '/devices/samsung-tv',
      robots: 'index, follow',
      ogType: 'article',
      primaryKeyword: 'IPTV for Samsung TV',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Devices', path: '/devices' },
        { name: 'Samsung Smart TV', path: '/devices/samsung-tv' },
      ],
      ssrSummaryHeading: 'IPTV for Samsung Smart TV (Tizen OS): App Availability & Setup',
      ssrSummaryBody:
        'Samsung Smart TVs run Tizen OS rather than Android. Learn how to install compatible Smart Hub IPTV players or pair an external streaming stick.',
    },
    '/devices/lg-tv': {
      path: '/devices/lg-tv',
      title: 'IPTV for LG Smart TV (webOS) — Installation & Player Notes | Lumiq TV',
      description:
        'Set up your IPTV subscription on LG webOS Smart TVs using LG Content Store player applications and 5 GHz Wi-Fi optimization.',
      canonicalPath: '/devices/lg-tv',
      robots: 'index, follow',
      ogType: 'article',
      primaryKeyword: 'IPTV for LG TV',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Devices', path: '/devices' },
        { name: 'LG Smart TV (webOS)', path: '/devices/lg-tv' },
      ],
      ssrSummaryHeading: 'IPTV for LG Smart TV (webOS): Content Store Players & Setup',
      ssrSummaryBody:
        'Configure compatible IPTV players from the LG Content Store on webOS televisions and optimize buffer settings for smooth playback.',
    },
    '/devices/apple-tv': {
      path: '/devices/apple-tv',
      title: 'IPTV for Apple TV (tvOS) — App Store Players & Setup | Lumiq TV',
      description:
        'Configure an IPTV subscription on Apple TV 4K and Apple TV HD using tvOS App Store IPTV players with Xtream Codes API or M3U playlists.',
      canonicalPath: '/devices/apple-tv',
      robots: 'index, follow',
      ogType: 'article',
      primaryKeyword: 'IPTV for Apple TV',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Devices', path: '/devices' },
        { name: 'Apple TV (tvOS)', path: '/devices/apple-tv' },
      ],
      ssrSummaryHeading: 'IPTV for Apple TV (tvOS): App Store Configuration Guide',
      ssrSummaryBody:
        'Use the Apple TV Remote and iOS Continuity keyboard to enter IPTV subscription credentials into tvOS App Store player applications.',
    },
    '/guides': {
      path: '/guides',
      title: 'IPTV Setup Guides, Player Tutorials & Troubleshooting | Lumiq TV',
      description:
        'Practical, step-by-step tutorials covering how to set up IPTV, IPTV Smarters Pro configuration, EPG synchronization, and troubleshooting playback issues.',
      canonicalPath: '/guides',
      robots: 'index, follow',
      ogType: 'website',
      primaryKeyword: 'IPTV Player Setup Guide',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Setup Guides', path: '/guides' },
      ],
      ssrSummaryHeading: 'IPTV Setup, Installation, and Troubleshooting Tutorials',
      ssrSummaryBody:
        'Detailed technical guides written for Smart TV, Fire TV, Android TV, and Apple TV users configuring M3U and Xtream Codes API subscriptions.',
    },
    '/guides/how-to-set-up-iptv': {
      path: '/guides/how-to-set-up-iptv',
      title: 'How to Set Up IPTV on Any Compatible Device (Step-by-Step) | Lumiq TV',
      description:
        'Learn how to set up IPTV from start to finish: choosing a compatible player app, understanding M3U URLs vs Xtream Codes API credentials, and loading your EPG.',
      canonicalPath: '/guides/how-to-set-up-iptv',
      robots: 'index, follow',
      ogType: 'article',
      primaryKeyword: 'How to Set Up IPTV',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Setup Guides', path: '/guides' },
        { name: 'How to Set Up IPTV', path: '/guides/how-to-set-up-iptv' },
      ],
      ssrSummaryHeading: 'How to Set Up IPTV: Complete Step-by-Step Configuration Tutorial',
      ssrSummaryBody:
        'Follow our numbered setup checklist to install a compatible IPTV media player, enter your server portal URL or M3U link, and verify Electronic Program Guide sync.',
    },
    '/guides/iptv-smarters-pro-setup': {
      path: '/guides/iptv-smarters-pro-setup',
      title: 'IPTV Smarters Pro Setup & Installation Tutorial | Lumiq TV',
      description:
        'Numbered instructions for IPTV Smarters Pro setup using Xtream Codes API or M3U playlist credentials, common entry mistakes to avoid, and EPG refresh steps.',
      canonicalPath: '/guides/iptv-smarters-pro-setup',
      robots: 'index, follow',
      ogType: 'article',
      primaryKeyword: 'IPTV Smarters Pro Setup',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Setup Guides', path: '/guides' },
        { name: 'IPTV Smarters Pro Setup', path: '/guides/iptv-smarters-pro-setup' },
      ],
      ssrSummaryHeading: 'IPTV Smarters Pro Setup & Credential Configuration Guide',
      ssrSummaryBody:
        'Configure IPTV Smarters Pro accurately by entering your profile name, username, password, and exact HTTP server URL without trailing whitespace.',
    },
    '/guides/iptv-smarters-pro-not-working': {
      path: '/guides/iptv-smarters-pro-not-working',
      title: 'IPTV Smarters Pro Not Working? 7 Diagnostic Fixes | Lumiq TV',
      description:
        'Troubleshooting guide for when IPTV Smarters Pro is not working: fix authorization errors, blank EPG grids, connection timeouts, and concurrent stream limits.',
      canonicalPath: '/guides/iptv-smarters-pro-not-working',
      robots: 'index, follow',
      ogType: 'article',
      primaryKeyword: 'IPTV Smarters Pro Not Working',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Setup Guides', path: '/guides' },
        { name: 'IPTV Smarters Pro Not Working', path: '/guides/iptv-smarters-pro-not-working' },
      ],
      ssrSummaryHeading: 'IPTV Smarters Pro Not Working: Systematic Troubleshooting Checklist',
      ssrSummaryBody:
        'Resolve login failures, playlist parsing errors, hardware decoder freezes, and single-connection limit conflicts with step-by-step diagnostics.',
    },
    '/blog': {
      path: '/blog',
      title: 'IPTV Subscription Guides & Streaming Blog | Lumiq TV',
      description:
        'In-depth articles covering IPTV player comparisons, FireStick 4K setup, Samsung & LG Smart TV apps, home Wi-Fi optimization, and subscription value breakdowns.',
      canonicalPath: '/blog',
      robots: 'index, follow',
      ogType: 'website',
      primaryKeyword: 'IPTV Subscription Guides',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Streaming Blog', path: '/blog' },
      ],
      ssrSummaryHeading: 'IPTV Subscription Guides & Streaming Blog',
      ssrSummaryBody:
        'Detailed guides with comparison tables and step-by-step checklists for Smart TV, FireStick, Android TV, and Apple TV viewers.',
    },
    '/faq': {
      path: '/faq',
      title: 'Frequently Asked Questions — IPTV Plans, Trials & Setup | Lumiq TV',
      description:
        'Answers to common questions about IPTV subscription pricing, connection limits, the 4-hour free trial, 7-day refund policy, and player setup.',
      canonicalPath: '/faq',
      robots: 'index, follow',
      ogType: 'website',
      primaryKeyword: 'IPTV Subscription FAQ',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'FAQ', path: '/faq' },
      ],
      ssrSummaryHeading: 'Frequently Asked Questions — IPTV Subscriptions & TV Setup',
      ssrSummaryBody:
        'Clear, accurate answers regarding confirmed subscription pricing, single vs 3-connection plans, 4-hour free trials, 7-day refund guarantee, and player compatibility.',
      extraJsonLd: [buildFaqSchema()],
    },
    '/contact': {
      path: '/contact',
      title: 'Contact Customer Support — Billing & TV Setup Help | Lumiq TV',
      description:
        'Submit a support ticket to Lumiq TV for assistance with IPTV subscription orders, payment verification, 4-hour trial requests, or TV setup.',
      canonicalPath: '/contact',
      robots: 'index, follow',
      ogType: 'website',
      primaryKeyword: 'Contact Lumiq TV Support',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Contact Support', path: '/contact' },
      ],
      ssrSummaryHeading: 'Contact Customer & Technical Support',
      ssrSummaryBody:
        'Reach our support team for order verification questions, TV setup guidance, or 4-hour free trial assistance.',
    },
    '/terms': {
      path: '/terms',
      title: 'Terms of Service — IPTV Subscription Rules & Usage | Lumiq TV',
      description:
        'Terms of Service governing IPTV subscription durations ($10–$140), simultaneous connection limits, acceptable personal household use, and account security.',
      canonicalPath: '/terms',
      robots: 'index, follow',
      ogType: 'website',
      primaryKeyword: 'Terms of Service',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Terms of Service', path: '/terms' },
      ],
      ssrSummaryHeading: 'Terms of Service — Lumiq TV',
      ssrSummaryBody: 'Terms governing IPTV subscription durations, simultaneous connection rules, and acceptable household use.',
    },
    '/privacy': {
      path: '/privacy',
      title: 'Privacy Policy — Customer Data Protection & Security | Lumiq TV',
      description:
        'How Lumiq TV minimizes, protects, and secures your email address, IPTV subscription order records, and authentication logs.',
      canonicalPath: '/privacy',
      robots: 'index, follow',
      ogType: 'website',
      primaryKeyword: 'Privacy Policy',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Privacy Policy', path: '/privacy' },
      ],
      ssrSummaryHeading: 'Privacy Policy — Lumiq TV',
      ssrSummaryBody: 'Data minimization practices, payment security, and customer privacy rights.',
    },
    '/refund-policy': {
      path: '/refund-policy',
      title: '7-Day Refund & Cancellation Policy | Lumiq TV',
      description:
        'Read our 7-day technical issue money-back guarantee for paid IPTV subscription plans, mandatory support troubleshooting step, and pending order cancellation policy.',
      canonicalPath: '/refund-policy',
      robots: 'index, follow',
      ogType: 'website',
      primaryKeyword: 'Refund Policy',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Refund Policy', path: '/refund-policy' },
      ],
      ssrSummaryHeading: '7-Day Refund & Cancellation Policy — Lumiq TV',
      ssrSummaryBody: '7-day technical issue guarantee with support troubleshooting first, plus 4-hour free trial evaluation.',
    },
    '/copyright': {
      path: '/copyright',
      title: 'Copyright & Trademark Policy | Lumiq TV',
      description:
        'Intellectual property notices, third-party trademark disclosures, nominative fair use statements, and rights-holder contact procedures.',
      canonicalPath: '/copyright',
      robots: 'index, follow',
      ogType: 'website',
      primaryKeyword: 'Copyright Policy',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Copyright Policy', path: '/copyright' },
      ],
      ssrSummaryHeading: 'Copyright & Trademark Disclosures — Lumiq TV',
      ssrSummaryBody: 'Third-party product names are trademarks of their respective owners; Lumiq TV is an independent provider.',
    },
    '/compatibility-disclosure': {
      path: '/compatibility-disclosure',
      title: 'Device & Player App Compatibility Disclosure | Lumiq TV',
      description:
        'Important disclosures distinguishing IPTV subscription credentials from third-party player apps (IPTV Smarters Pro, TiviMate, IBO Player) and Smart TV hardware.',
      canonicalPath: '/compatibility-disclosure',
      robots: 'index, follow',
      ogType: 'website',
      primaryKeyword: 'Compatibility Disclosure',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Compatibility Disclosure', path: '/compatibility-disclosure' },
      ],
      ssrSummaryHeading: 'Device & Player App Compatibility Disclosure — Lumiq TV',
      ssrSummaryBody: 'Third-party media player apps and hardware devices are separate products from an IPTV subscription.',
    },
    '/checkout': {
      path: '/checkout',
      title: 'Order Summary & Checkout | Lumiq TV',
      description: 'Complete your IPTV subscription order with transparent USD pricing.',
      canonicalPath: '/checkout',
      robots: 'noindex, nofollow',
      ogType: 'website',
      primaryKeyword: 'Checkout',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Checkout', path: '/checkout' },
      ],
      ssrSummaryHeading: 'Complete Your IPTV Subscription Order',
      ssrSummaryBody: 'Private checkout session.',
    },
    '/login': {
      path: '/login',
      title: 'Customer Login & Account Access | Lumiq TV',
      description: 'Sign in to your account to view IPTV subscription orders, active status, and 4-hour free trial requests.',
      canonicalPath: '/login',
      robots: 'noindex, nofollow',
      ogType: 'website',
      primaryKeyword: 'Customer Login',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Login', path: '/login' },
      ],
      ssrSummaryHeading: 'Sign In to Your Account',
      ssrSummaryBody: 'Private authentication route.',
    },
    '/account': {
      path: '/account',
      title: 'My Account — IPTV Subscription & Orders | Lumiq TV',
      description: 'Manage your IPTV subscription, order history, payment status, and 4-hour free trial requests.',
      canonicalPath: '/account',
      robots: 'noindex, nofollow',
      ogType: 'website',
      primaryKeyword: 'Customer Account',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'My Account', path: '/account' },
      ],
      ssrSummaryHeading: 'My Account Dashboard',
      ssrSummaryBody: 'Private customer dashboard.',
    },
    '/account/orders': {
      path: '/account/orders',
      title: 'My Orders & Payment Status | Lumiq TV',
      description: 'View your IPTV subscription orders, payment verification records, and activation dates.',
      canonicalPath: '/account/orders',
      robots: 'noindex, nofollow',
      ogType: 'website',
      primaryKeyword: 'Customer Orders',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'My Account', path: '/account' },
        { name: 'Orders', path: '/account/orders' },
      ],
      ssrSummaryHeading: 'Customer Order History',
      ssrSummaryBody: 'Private customer order history.',
    },
    '/admin': {
      path: '/admin',
      title: 'Admin Management Console | Lumiq TV',
      description: 'Administrative console for managing customers, orders, trials, editorial content, and audit logs.',
      canonicalPath: '/admin',
      robots: 'noindex, nofollow',
      ogType: 'website',
      primaryKeyword: 'Admin Console',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Admin Console', path: '/admin' },
      ],
      ssrSummaryHeading: 'Store Admin Management Console',
      ssrSummaryBody: 'Restricted administrative interface.',
    },
  };

  for (const article of INITIAL_EDITORIAL_ARTICLES) {
    const articlePath = `/blog/${article.slug}`;
    routeMap[articlePath] = {
      path: articlePath,
      title: article.seoTitle,
      description: article.seoDescription,
      canonicalPath: articlePath,
      robots: 'index, follow',
      ogType: 'article',
      primaryKeyword: article.title,
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Streaming Blog', path: '/blog' },
        { name: article.title, path: articlePath },
      ],
      ssrSummaryHeading: article.title,
      ssrSummaryBody: article.excerpt,
      extraJsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description: article.seoDescription,
          author: {
            '@type': 'Person',
            name: article.authorName,
          },
          publisher: {
            '@type': 'Organization',
            name: 'Lumiq TV',
            url: cleanBase,
          },
          datePublished: '2026-11-06',
          dateModified: '2026-11-06',
          mainEntityOfPage: `${cleanBase}${articlePath}`,
        },
      ],
    };
  }

  const matched = routeMap[path];
  if (matched) {
    const breadcrumbSchema = buildBreadcrumbSchema(cleanBase, matched.breadcrumbs);
    const jsonLd =
      matched.robots === 'index, follow'
        ? [breadcrumbSchema, ...(matched.extraJsonLd ?? [])]
        : [];
    return {
      ...matched,
      jsonLd,
    };
  }

  return {
    path,
    title: 'Page Not Found (404) | Lumiq TV',
    description: 'The requested page could not be found on Lumiq TV. Explore our IPTV subscription plans, setup guides, or device compatibility hub.',
    canonicalPath: path,
    robots: 'noindex, nofollow',
    ogType: 'website',
    primaryKeyword: '404 Not Found',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Not Found', path },
    ],
    jsonLd: [],
    ssrSummaryHeading: '404 — Page Not Found on Lumiq TV',
    ssrSummaryBody: 'Return to the homepage, view IPTV subscription plans, or browse TV setup guides.',
  };
}

export function generateXmlSitemap(baseUrl = 'https://lumiqtv.example.com'): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const lastMod = '2026-11-06';
  const urls = PUBLIC_INDEXABLE_PATHS.map((p) => {
    const priority = p === '/' ? '1.0' : p === '/pricing' || p === '/free-trial' ? '0.9' : '0.8';
    const loc = `${cleanBase}${p === '/' ? '' : p}`;
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

export function generateRobotsTxt(baseUrl = 'https://lumiqtv.example.com'): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /account',
    'Disallow: /account/orders',
    'Disallow: /login',
    'Disallow: /checkout',
    '',
    `Sitemap: ${cleanBase}/sitemap.xml`,
  ].join('\n');
}
