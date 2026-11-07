import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import * as dotenv from 'dotenv';
import {
  SUBSCRIPTION_PLANS,
  getPlanById,
  orderCheckoutSchema,
  trialRequestSchema,
  supportRequestSchema,
  articleCmsSchema,
  renderTransactionalEmail,
  type OrderStatus,
  type PaymentStatus,
  type SubscriptionStatus,
  type TrialStatus,
} from './src/lib/pricing.ts';
import {
  getRouteSeoMeta,
  generateXmlSitemap,
  generateRobotsTxt,
  PUBLIC_INDEXABLE_PATHS,
} from './src/lib/seo.ts';
import { INITIAL_EDITORIAL_ARTICLES } from './src/lib/content.ts';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '.data');
const DB_FILE = path.join(DATA_DIR, 'lumiq-store.json');

export interface StoredProfile {
  uid: string;
  email: string;
  displayName: string;
  preferredDevice: string;
  role: 'customer' | 'admin';
  internalNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredOrder {
  orderId: string;
  userId: string;
  customerEmail: string;
  planId: string;
  planName: string;
  durationMonths: number;
  connections: number;
  amountCents: number;
  currency: 'USD';
  paymentMethod: 'manual_invoice' | 'bank_transfer' | 'card_gateway_pending' | 'crypto_manual';
  deviceType: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  subscriptionStatus: SubscriptionStatus;
  activationDate: string;
  expirationDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredTrialRequest {
  trialId: string;
  userId: string;
  customerEmail: string;
  deviceType: string;
  playerApp: string;
  status: TrialStatus;
  durationHours: 4;
  activationDate: string;
  expirationDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredSupportRequest {
  ticketId: string;
  userId: string;
  customerEmail: string;
  subject: string;
  category: 'setup' | 'billing' | 'trial' | 'compatibility' | 'general';
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  updatedAt: string;
}

export interface StoredArticle {
  articleId: string;
  slug: string;
  title: string;
  excerpt: string;
  category: 'Setup Guides' | 'Player Software' | 'Device Compatibility' | 'Troubleshooting' | 'Buyer Resources';
  content: string;
  authorName: string;
  reviewStatus: 'Draft' | 'In Review' | 'Verified & Published';
  seoTitle: string;
  seoDescription: string;
  lastUpdated: string;
  readingTime: string;
  tableOfContents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StoredAuditLog {
  logId: string;
  adminUid: string;
  adminEmail: string;
  action: string;
  targetType: 'order' | 'trial' | 'article' | 'profile' | 'support';
  targetId: string;
  details: string;
  createdAt: string;
}

interface DatabaseSchema {
  profiles: StoredProfile[];
  orders: StoredOrder[];
  trialRequests: StoredTrialRequest[];
  supportRequests: StoredSupportRequest[];
  articles: StoredArticle[];
  auditLogs: StoredAuditLog[];
}

const ADMIN_EMAILS = new Set(['getleasecheck@gmail.com', 'admin@lumiqtv.com']);

function createSeedDatabase(): DatabaseSchema {
  const now = '2026-11-06T08:00:00.000Z';
  return {
    profiles: [
      {
        uid: 'usr-admin-1',
        email: 'getleasecheck@gmail.com',
        displayName: 'Lumiq TV Operations Admin',
        preferredDevice: 'Apple TV (tvOS)',
        role: 'admin',
        internalNotes: 'Primary platform administrator account.',
        createdAt: now,
        updatedAt: now,
      },
      {
        uid: 'usr-cust-101',
        email: 'alex.mercer@example.com',
        displayName: 'Alex Mercer',
        preferredDevice: 'Android TV / Google TV',
        role: 'customer',
        internalNotes: 'Verified 12-month single-connection subscriber on Nvidia Shield.',
        createdAt: '2026-10-15T14:20:00.000Z',
        updatedAt: '2026-10-15T14:45:00.000Z',
      },
      {
        uid: 'usr-cust-102',
        email: 'claire.dubois@example.com',
        displayName: 'Claire Dubois',
        preferredDevice: 'Amazon Fire TV / FireStick',
        role: 'customer',
        internalNotes: 'Household 3-connection annual bundle customer.',
        createdAt: '2026-11-01T10:12:00.000Z',
        updatedAt: '2026-11-01T11:00:00.000Z',
      },
      {
        uid: 'usr-cust-103',
        email: 'david.kovacs@example.com',
        displayName: 'David Kovacs',
        preferredDevice: 'Samsung Smart TV (Tizen)',
        role: 'customer',
        internalNotes: 'Submitted bank transfer order; awaiting payment verification.',
        createdAt: '2026-11-05T19:30:00.000Z',
        updatedAt: '2026-11-05T19:30:00.000Z',
      },
    ],
    orders: [
      {
        orderId: 'ORD-2026-1001',
        userId: 'usr-cust-101',
        customerEmail: 'alex.mercer@example.com',
        planId: 'plan-12m-1c',
        planName: '12 Months IPTV Subscription',
        durationMonths: 12,
        connections: 1,
        amountCents: 5000,
        currency: 'USD',
        paymentMethod: 'manual_invoice',
        deviceType: 'Android TV / Google TV',
        orderStatus: 'Active',
        paymentStatus: 'Paid',
        subscriptionStatus: 'Active',
        activationDate: '2026-10-15',
        expirationDate: '2027-10-15',
        createdAt: '2026-10-15T14:22:00.000Z',
        updatedAt: '2026-10-15T14:45:00.000Z',
      },
      {
        orderId: 'ORD-2026-1002',
        userId: 'usr-cust-102',
        customerEmail: 'claire.dubois@example.com',
        planId: 'bundle-12m-3c',
        planName: '3 Connections × 12 Months Household Bundle',
        durationMonths: 12,
        connections: 3,
        amountCents: 12000,
        currency: 'USD',
        paymentMethod: 'manual_invoice',
        deviceType: 'Amazon Fire TV / FireStick',
        orderStatus: 'Active',
        paymentStatus: 'Paid',
        subscriptionStatus: 'Active',
        activationDate: '2026-11-01',
        expirationDate: '2027-11-01',
        createdAt: '2026-11-01T10:15:00.000Z',
        updatedAt: '2026-11-01T11:00:00.000Z',
      },
      {
        orderId: 'ORD-2026-1003',
        userId: 'usr-cust-103',
        customerEmail: 'david.kovacs@example.com',
        planId: 'plan-3m-1c',
        planName: '3 Months IPTV Subscription',
        durationMonths: 3,
        connections: 1,
        amountCents: 2000,
        currency: 'USD',
        paymentMethod: 'bank_transfer',
        deviceType: 'Samsung Smart TV (Tizen)',
        orderStatus: 'Pending',
        paymentStatus: 'Payment Under Review',
        subscriptionStatus: 'Pending',
        activationDate: '',
        expirationDate: '',
        createdAt: '2026-11-05T19:35:00.000Z',
        updatedAt: '2026-11-05T19:40:00.000Z',
      },
    ],
    trialRequests: [
      {
        trialId: 'TRL-2026-401',
        userId: 'usr-cust-103',
        customerEmail: 'david.kovacs@example.com',
        deviceType: 'Samsung Smart TV (Tizen)',
        playerApp: 'IBO Player',
        status: 'Expired',
        durationHours: 4,
        activationDate: '2026-11-04 14:00 UTC',
        expirationDate: '2026-11-04 18:00 UTC',
        createdAt: '2026-11-04T13:50:00.000Z',
        updatedAt: '2026-11-04T18:00:00.000Z',
      },
      {
        trialId: 'TRL-2026-402',
        userId: 'usr-guest-201',
        customerEmail: 'hannah.lin@example.com',
        deviceType: 'Apple TV (tvOS)',
        playerApp: 'IPTV Smarters Pro',
        status: 'Pending',
        durationHours: 4,
        activationDate: '',
        expirationDate: '',
        createdAt: '2026-11-06T07:30:00.000Z',
        updatedAt: '2026-11-06T07:30:00.000Z',
      },
    ],
    supportRequests: [
      {
        ticketId: 'TKT-2026-901',
        userId: 'usr-cust-101',
        customerEmail: 'alex.mercer@example.com',
        subject: 'Question about XMLTV EPG refresh interval on TiviMate',
        category: 'setup',
        message: 'What EPG update interval do you recommend on Nvidia Shield TV Pro?',
        status: 'Resolved',
        createdAt: '2026-10-16T09:00:00.000Z',
        updatedAt: '2026-10-16T10:15:00.000Z',
      },
    ],
    articles: INITIAL_EDITORIAL_ARTICLES.map((a) => ({
      ...a,
      tableOfContents: [...a.tableOfContents],
      createdAt: now,
      updatedAt: now,
    })),
    auditLogs: [
      {
        logId: 'LOG-2026-001',
        adminUid: 'usr-admin-1',
        adminEmail: 'getleasecheck@gmail.com',
        action: 'Verified Payment & Activated 12-Month Subscription',
        targetType: 'order',
        targetId: 'ORD-2026-1001',
        details: 'Confirmed $50.00 USD payment; set orderStatus=Active, paymentStatus=Paid, subscriptionStatus=Active (2026-10-15 to 2027-10-15).',
        createdAt: '2026-10-15T14:45:00.000Z',
      },
      {
        logId: 'LOG-2026-002',
        adminUid: 'usr-admin-1',
        adminEmail: 'getleasecheck@gmail.com',
        action: 'Verified Payment & Activated 3-Connection Annual Bundle',
        targetType: 'order',
        targetId: 'ORD-2026-1002',
        details: 'Confirmed $120.00 USD payment for 3 Connections × 12 Months bundle (2026-11-01 to 2027-11-01).',
        createdAt: '2026-11-01T11:00:00.000Z',
      },
    ],
  };
}

function loadDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initial = createSeedDatabase();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf8');
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(raw) as DatabaseSchema;
    const now = '2026-11-06T08:00:00.000Z';
    const seedSlugs = new Set(INITIAL_EDITORIAL_ARTICLES.map((a) => a.slug));
    const customArticles = (parsed.articles || []).filter((a) => !seedSlugs.has(a.slug));
    parsed.articles = [
      ...INITIAL_EDITORIAL_ARTICLES.map((a) => ({
        ...a,
        tableOfContents: [...a.tableOfContents],
        createdAt: now,
        updatedAt: now,
      })),
      ...customArticles,
    ];
    fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf8');
    return parsed;
  } catch (err) {
    console.error('Error loading local store, using seed:', err);
    return createSeedDatabase();
  }
}

function saveDatabase(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to persist store:', err);
  }
}

let dbState = loadDatabase();

function getOrCreateProfile(email: string, preferredDevice = 'Android TV / Google TV', uidHint?: string): StoredProfile {
  const cleanEmail = email.trim().toLowerCase();
  const existing = dbState.profiles.find((p) => p.email.toLowerCase() === cleanEmail);
  if (existing) {
    return existing;
  }
  const now = new Date().toISOString();
  const isAdmin = ADMIN_EMAILS.has(cleanEmail);
  const newProfile: StoredProfile = {
    uid: uidHint && /^[a-zA-Z0-9_\-]+$/.test(uidHint) ? uidHint : `usr-${Date.now()}`,
    email: cleanEmail,
    displayName: cleanEmail.split('@')[0].replace(/[._-]/g, ' '),
    preferredDevice,
    role: isAdmin ? 'admin' : 'customer',
    internalNotes: '',
    createdAt: now,
    updatedAt: now,
  };
  dbState.profiles.unshift(newProfile);
  saveDatabase(dbState);
  return newProfile;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function injectServerSeoIntoHtml(templateHtml: string, reqPath: string, baseUrl: string): string {
  const seo = getRouteSeoMeta(reqPath, baseUrl);
  const canonicalUrl = `${baseUrl.replace(/\/+$/, '')}${seo.canonicalPath === '/' ? '' : seo.canonicalPath}`;
  const jsonLdScripts = seo.jsonLd
    .map((schema) => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`)
    .join('\n    ');

  const seoHeadBlock = `
    <title>${escapeHtml(seo.title)}</title>
    <meta name="description" content="${escapeHtml(seo.description)}" />
    <meta name="robots" content="${seo.robots}" />
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
    <meta property="og:type" content="${seo.ogType}" />
    <meta property="og:site_name" content="Lumiq TV" />
    <meta property="og:title" content="${escapeHtml(seo.title)}" />
    <meta property="og:description" content="${escapeHtml(seo.description)}" />
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(seo.title)}" />
    <meta name="twitter:description" content="${escapeHtml(seo.description)}" />
    ${jsonLdScripts}
  `;

  let html = templateHtml
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta\s+name="description"[^>]*>/gi, '')
    .replace(/<meta\s+property="og:[^"]+"[^>]*>/gi, '')
    .replace(/<meta\s+name="twitter:[^"]+"[^>]*>/gi, '')
    .replace('</head>', `${seoHeadBlock}\n  </head>`);

  // Pre-render semantic indexable summary inside #root for initial HTML crawlability before React hydration
  const ssrFallbackMarkup = `<div class="sr-only" data-ssr-seo-summary="true">
    <h1>${escapeHtml(seo.ssrSummaryHeading)}</h1>
    <p>${escapeHtml(seo.ssrSummaryBody)}</p>
  </div>`;

  html = html.replace('<div id="root"></div>', `<div id="root">${ssrFallbackMarkup}</div>`);
  return html;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  const baseUrl = process.env.APP_URL || 'https://lumiqtv.example.com';

  // Technical SEO: XML Sitemap & Robots.txt
  app.get('/sitemap.xml', (_req, res) => {
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.status(200).send(generateXmlSitemap(baseUrl));
  });

  app.get('/robots.txt', (_req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(200).send(generateRobotsTxt(baseUrl));
  });

  // Public Catalog & SEO Metadata API
  app.get('/api/catalog', (_req, res) => {
    res.json({
      plans: SUBSCRIPTION_PLANS,
      articles: dbState.articles.filter((a) => a.reviewStatus === 'Verified & Published'),
      indexablePaths: PUBLIC_INDEXABLE_PATHS,
    });
  });

  // Lightweight Customer Session / Auth Sync API
  app.post('/api/auth/session', (req, res) => {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const uid = req.body?.uid ? String(req.body.uid) : undefined;
    const preferredDevice = req.body?.preferredDevice ? String(req.body.preferredDevice) : 'Android TV / Google TV';

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const profile = getOrCreateProfile(email, preferredDevice, uid);
    const orders = dbState.orders.filter((o) => o.customerEmail.toLowerCase() === email);
    const trialRequests = dbState.trialRequests.filter((t) => t.customerEmail.toLowerCase() === email);
    const supportRequests = dbState.supportRequests.filter((s) => s.customerEmail.toLowerCase() === email);

    return res.json({
      profile,
      orders,
      trialRequests,
      supportRequests,
    });
  });

  // Customer Data Fetch by Email
  app.get('/api/customer/overview', (req, res) => {
    const email = String(req.query.email || '').trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ error: 'Email query parameter is required.' });
    }
    const profile = getOrCreateProfile(email);
    const orders = dbState.orders.filter((o) => o.customerEmail.toLowerCase() === email);
    const trialRequests = dbState.trialRequests.filter((t) => t.customerEmail.toLowerCase() === email);
    const supportRequests = dbState.supportRequests.filter((s) => s.customerEmail.toLowerCase() === email);

    return res.json({
      profile,
      orders,
      trialRequests,
      supportRequests,
    });
  });

  // Create Subscription Order (Never auto-marked Paid on client redirect)
  app.post('/api/orders', (req, res) => {
    const parsed = orderCheckoutSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.issues[0]?.message || 'Invalid order details.',
        issues: parsed.error.issues,
      });
    }

    const { planId, customerEmail, deviceType, paymentMethod } = parsed.data;
    const plan = getPlanById(planId);
    if (!plan) {
      return res.status(400).json({ error: 'Confirmed subscription plan not found.' });
    }

    const profile = getOrCreateProfile(customerEmail, deviceType, req.body?.userId);
    const now = new Date().toISOString();
    const orderId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: StoredOrder = {
      orderId,
      userId: profile.uid,
      customerEmail: profile.email,
      planId: plan.id,
      planName: plan.name,
      durationMonths: plan.durationMonths,
      connections: plan.connections,
      amountCents: plan.amountCents,
      currency: 'USD',
      paymentMethod,
      deviceType,
      orderStatus: 'Pending',
      paymentStatus: 'Awaiting Payment',
      subscriptionStatus: 'Pending',
      activationDate: '',
      expirationDate: '',
      createdAt: now,
      updatedAt: now,
    };

    dbState.orders.unshift(newOrder);
    saveDatabase(dbState);

    const confirmationEmail = renderTransactionalEmail('order_received', {
      recipientEmail: profile.email,
      orderId: newOrder.orderId,
      planId: plan.id,
    });

    return res.status(201).json({
      order: newOrder,
      profile,
      confirmationEmail,
    });
  });

  // Customer submits payment verification notice (transitions Awaiting Payment -> Payment Under Review)
  app.post('/api/orders/:orderId/submit-payment-proof', (req, res) => {
    const { orderId } = req.params;
    const customerEmail = String(req.body?.customerEmail || '').trim().toLowerCase();
    const order = dbState.orders.find((o) => o.orderId === orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    if (order.customerEmail.toLowerCase() !== customerEmail && !ADMIN_EMAILS.has(customerEmail)) {
      return res.status(403).json({ error: 'Forbidden: You can only update your own order.' });
    }
    if (order.paymentStatus !== 'Awaiting Payment') {
      return res.status(400).json({ error: `Order payment status is already ${order.paymentStatus}.` });
    }

    order.paymentStatus = 'Payment Under Review';
    order.updatedAt = new Date().toISOString();
    saveDatabase(dbState);

    return res.json({ order });
  });

  // Create Free Trial Request (Up to 4 hours, rate-limited per email for active/pending trials)
  app.post('/api/trials', (req, res) => {
    const parsed = trialRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.issues[0]?.message || 'Invalid trial request details.',
      });
    }

    const { customerEmail, deviceType, playerApp } = parsed.data;
    const cleanEmail = customerEmail.toLowerCase();

    const existingOpen = dbState.trialRequests.find(
      (t) => t.customerEmail.toLowerCase() === cleanEmail && (t.status === 'Pending' || t.status === 'Active' || t.status === 'Approved')
    );
    if (existingOpen) {
      return res.status(429).json({
        error: `An active or pending 4-hour trial request (${existingOpen.trialId}) already exists for ${cleanEmail}.`,
        trial: existingOpen,
      });
    }

    const profile = getOrCreateProfile(cleanEmail, deviceType, req.body?.userId);
    const now = new Date().toISOString();
    const trialId = `TRL-2026-${Math.floor(400 + Math.random() * 599)}`;

    const newTrial: StoredTrialRequest = {
      trialId,
      userId: profile.uid,
      customerEmail: profile.email,
      deviceType,
      playerApp,
      status: 'Pending',
      durationHours: 4,
      activationDate: '',
      expirationDate: '',
      createdAt: now,
      updatedAt: now,
    };

    dbState.trialRequests.unshift(newTrial);
    saveDatabase(dbState);

    const emailPreview = renderTransactionalEmail('trial_request_received', {
      recipientEmail: profile.email,
      trialId: newTrial.trialId,
    });

    return res.status(201).json({
      trial: newTrial,
      profile,
      emailPreview,
    });
  });

  // Create Support Request
  app.post('/api/support', (req, res) => {
    const parsed = supportRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.issues[0]?.message || 'Invalid support request.',
      });
    }

    const { customerEmail, subject, category, message } = parsed.data;
    const profile = getOrCreateProfile(customerEmail);
    const now = new Date().toISOString();
    const ticketId = `TKT-2026-${Math.floor(900 + Math.random() * 900)}`;

    const ticket: StoredSupportRequest = {
      ticketId,
      userId: profile.uid,
      customerEmail: profile.email,
      subject,
      category,
      message,
      status: 'Open',
      createdAt: now,
      updatedAt: now,
    };

    dbState.supportRequests.unshift(ticket);
    saveDatabase(dbState);

    return res.status(201).json({ ticket });
  });

  // Server-Side Admin Role Enforcement Middleware
  const requireAdminRole: express.RequestHandler = (req, res, next) => {
    const adminHeaderEmail = String(req.headers['x-admin-email'] || '').trim().toLowerCase();
    if (!adminHeaderEmail || !ADMIN_EMAILS.has(adminHeaderEmail)) {
      return res.status(403).json({
        error: 'Forbidden: Server-side administrative role check failed. Authorized admin email required.',
      });
    }
    next();
  };

  // Admin Overview & Full State
  app.get('/api/admin/state', requireAdminRole, (_req, res) => {
    const paidOrders = dbState.orders.filter((o) => o.paymentStatus === 'Paid');
    const verifiedRevenueCents = paidOrders.reduce((acc, o) => acc + o.amountCents, 0);

    return res.json({
      metrics: {
        totalCustomers: dbState.profiles.filter((p) => p.role === 'customer').length,
        totalOrders: dbState.orders.length,
        paidOrders: paidOrders.length,
        pendingOrders: dbState.orders.filter((o) => o.orderStatus === 'Pending').length,
        activeSubscriptions: dbState.orders.filter((o) => o.subscriptionStatus === 'Active').length,
        expiredSubscriptions: dbState.orders.filter((o) => o.subscriptionStatus === 'Expired').length,
        trialRequestsCount: dbState.trialRequests.length,
        verifiedRevenueCents,
      },
      profiles: dbState.profiles,
      orders: dbState.orders,
      trialRequests: dbState.trialRequests,
      supportRequests: dbState.supportRequests,
      articles: dbState.articles,
      auditLogs: dbState.auditLogs,
    });
  });

  // Admin Update Order / Payment / Subscription Status + Record Audit Log
  app.patch('/api/admin/orders/:orderId', requireAdminRole, (req, res) => {
    const { orderId } = req.params;
    const adminEmail = String(req.headers['x-admin-email'] || 'getleasecheck@gmail.com').toLowerCase();
    const order = dbState.orders.find((o) => o.orderId === orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const { orderStatus, paymentStatus, subscriptionStatus, activationDate, expirationDate } = req.body;
    const changes: string[] = [];

    if (orderStatus && ['Pending', 'Processing', 'Active', 'Cancelled'].includes(orderStatus)) {
      order.orderStatus = orderStatus;
      changes.push(`orderStatus=${orderStatus}`);
    }
    if (paymentStatus && ['Awaiting Payment', 'Payment Under Review', 'Paid', 'Refunded'].includes(paymentStatus)) {
      order.paymentStatus = paymentStatus;
      changes.push(`paymentStatus=${paymentStatus}`);
    }
    if (subscriptionStatus && ['Pending', 'Active', 'Expired', 'Cancelled'].includes(subscriptionStatus)) {
      order.subscriptionStatus = subscriptionStatus;
      changes.push(`subscriptionStatus=${subscriptionStatus}`);
    }
    if (typeof activationDate === 'string') {
      order.activationDate = activationDate;
      if (activationDate) changes.push(`activationDate=${activationDate}`);
    }
    if (typeof expirationDate === 'string') {
      order.expirationDate = expirationDate;
      if (expirationDate) changes.push(`expirationDate=${expirationDate}`);
    }

    // Auto-calculate activation & expiration dates when activating subscription if not explicitly set
    if (order.subscriptionStatus === 'Active' && !order.activationDate) {
      const start = new Date();
      const end = new Date(start);
      end.setMonth(end.getMonth() + order.durationMonths);
      order.activationDate = start.toISOString().slice(0, 10);
      order.expirationDate = end.toISOString().slice(0, 10);
      changes.push(`window=${order.activationDate}..${order.expirationDate}`);
    }

    order.updatedAt = new Date().toISOString();

    const auditEntry: StoredAuditLog = {
      logId: `LOG-2026-${Math.floor(100 + Math.random() * 899)}`,
      adminUid: 'usr-admin-1',
      adminEmail,
      action: `Updated Order ${order.orderId}`,
      targetType: 'order',
      targetId: order.orderId,
      details: changes.join(', ') || 'Updated order record',
      createdAt: order.updatedAt,
    };
    dbState.auditLogs.unshift(auditEntry);
    saveDatabase(dbState);

    return res.json({ order, auditEntry });
  });

  // Admin Approve / Reject / Update Free Trial Request
  app.patch('/api/admin/trials/:trialId', requireAdminRole, (req, res) => {
    const { trialId } = req.params;
    const adminEmail = String(req.headers['x-admin-email'] || 'getleasecheck@gmail.com').toLowerCase();
    const trial = dbState.trialRequests.find((t) => t.trialId === trialId);
    if (!trial) {
      return res.status(404).json({ error: 'Trial request not found.' });
    }

    const { status } = req.body;
    if (!['Pending', 'Approved', 'Active', 'Expired', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid trial status.' });
    }

    trial.status = status;
    const now = new Date();
    if (status === 'Approved' || status === 'Active') {
      const exp = new Date(now.getTime() + 4 * 60 * 60 * 1000);
      trial.activationDate = `${now.toISOString().slice(0, 16).replace('T', ' ')} UTC`;
      trial.expirationDate = `${exp.toISOString().slice(0, 16).replace('T', ' ')} UTC`;
    }
    trial.updatedAt = now.toISOString();

    const auditEntry: StoredAuditLog = {
      logId: `LOG-2026-${Math.floor(100 + Math.random() * 899)}`,
      adminUid: 'usr-admin-1',
      adminEmail,
      action: `Trial ${trial.trialId} marked ${status}`,
      targetType: 'trial',
      targetId: trial.trialId,
      details: `Set 4-hour trial status=${status} for ${trial.customerEmail} (${trial.deviceType} / ${trial.playerApp})`,
      createdAt: trial.updatedAt,
    };
    dbState.auditLogs.unshift(auditEntry);
    saveDatabase(dbState);

    return res.json({ trial, auditEntry });
  });

  // Admin Update Customer Internal Notes
  app.patch('/api/admin/profiles/:uid', requireAdminRole, (req, res) => {
    const { uid } = req.params;
    const adminEmail = String(req.headers['x-admin-email'] || 'getleasecheck@gmail.com').toLowerCase();
    const profile = dbState.profiles.find((p) => p.uid === uid);
    if (!profile) {
      return res.status(404).json({ error: 'Customer profile not found.' });
    }

    const internalNotes = String(req.body?.internalNotes ?? '').slice(0, 1000);
    profile.internalNotes = internalNotes;
    profile.updatedAt = new Date().toISOString();

    const auditEntry: StoredAuditLog = {
      logId: `LOG-2026-${Math.floor(100 + Math.random() * 899)}`,
      adminUid: 'usr-admin-1',
      adminEmail,
      action: `Updated Customer Notes (${profile.email})`,
      targetType: 'profile',
      targetId: profile.uid,
      details: `Updated internal notes: "${internalNotes.slice(0, 80)}"`,
      createdAt: profile.updatedAt,
    };
    dbState.auditLogs.unshift(auditEntry);
    saveDatabase(dbState);

    return res.json({ profile, auditEntry });
  });

  // Admin Editorial Content Management (Create or Update Article)
  app.post('/api/admin/articles', requireAdminRole, (req, res) => {
    const adminEmail = String(req.headers['x-admin-email'] || 'getleasecheck@gmail.com').toLowerCase();
    const parsed = articleCmsSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.issues[0]?.message || 'Invalid article fields.',
      });
    }

    const now = new Date().toISOString();
    const existingIdx = dbState.articles.findIndex((a) => a.slug === parsed.data.slug);
    let savedArticle: StoredArticle;

    if (existingIdx >= 0) {
      savedArticle = {
        ...dbState.articles[existingIdx],
        ...parsed.data,
        lastUpdated: 'November 6, 2026',
        updatedAt: now,
      };
      dbState.articles[existingIdx] = savedArticle;
    } else {
      savedArticle = {
        articleId: `art-${Date.now()}`,
        ...parsed.data,
        lastUpdated: 'November 6, 2026',
        readingTime: `${Math.max(3, Math.ceil(parsed.data.content.split(/\s+/).length / 180))} min read`,
        tableOfContents: ['Overview & Key Takeaways', 'Technical Details & Compatibility'],
        createdAt: now,
        updatedAt: now,
      };
      dbState.articles.unshift(savedArticle);
    }

    const auditEntry: StoredAuditLog = {
      logId: `LOG-2026-${Math.floor(100 + Math.random() * 899)}`,
      adminUid: 'usr-admin-1',
      adminEmail,
      action: `${existingIdx >= 0 ? 'Updated' : 'Created'} Editorial Article (${savedArticle.reviewStatus})`,
      targetType: 'article',
      targetId: savedArticle.articleId,
      details: `Title: "${savedArticle.title}" · Status: ${savedArticle.reviewStatus}`,
      createdAt: now,
    };
    dbState.auditLogs.unshift(auditEntry);
    saveDatabase(dbState);

    return res.status(201).json({ article: savedArticle, auditEntry });
  });

  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });

    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        const htmlWithSeo = injectServerSeoIntoHtml(template, req.path, baseUrl);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(htmlWithSeo);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath, { index: false }));

    app.use('*', (req, res) => {
      const template = fs.readFileSync(path.resolve(distPath, 'index.html'), 'utf-8');
      const htmlWithSeo = injectServerSeoIntoHtml(template, req.path, baseUrl);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(htmlWithSeo);
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Lumiq TV full-stack server running on http://0.0.0.0:${port}`);
  });
}

startServer();
