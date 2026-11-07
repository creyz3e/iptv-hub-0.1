import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SUBSCRIPTION_PLANS,
  SINGLE_CONNECTION_PLANS,
  MULTI_CONNECTION_BUNDLE,
  FREE_TRIAL_CONFIG,
  calculatePlanSavings,
  getPlanById,
  formatUsdFromCents,
  orderCheckoutSchema,
  trialRequestSchema,
  renderTransactionalEmail,
} from './pricing.ts';
import {
  getRouteSeoMeta,
  generateXmlSitemap,
  generateRobotsTxt,
  PUBLIC_INDEXABLE_PATHS,
  NOINDEX_PRIVATE_PATHS,
} from './seo.ts';

test('Single Source of Truth Pricing matches all confirmed plans & bundle exactly', () => {
  assert.equal(SINGLE_CONNECTION_PLANS.length, 7);
  const expectedSinglePlans = [
    { durationMonths: 1, priceUsd: 10, amountCents: 1000, connections: 1 },
    { durationMonths: 3, priceUsd: 20, amountCents: 2000, connections: 1 },
    { durationMonths: 6, priceUsd: 30, amountCents: 3000, connections: 1 },
    { durationMonths: 12, priceUsd: 50, amountCents: 5000, connections: 1 },
    { durationMonths: 24, priceUsd: 90, amountCents: 9000, connections: 1 },
    { durationMonths: 36, priceUsd: 120, amountCents: 12000, connections: 1 },
    { durationMonths: 48, priceUsd: 140, amountCents: 14000, connections: 1 },
  ];

  SINGLE_CONNECTION_PLANS.forEach((plan, index) => {
    const exp = expectedSinglePlans[index];
    assert.equal(plan.durationMonths, exp.durationMonths);
    assert.equal(plan.priceUsd, exp.priceUsd);
    assert.equal(plan.amountCents, exp.amountCents);
    assert.equal(plan.connections, exp.connections);
    assert.equal(plan.currency, 'USD');
  });

  assert.equal(MULTI_CONNECTION_BUNDLE.durationMonths, 12);
  assert.equal(MULTI_CONNECTION_BUNDLE.connections, 3);
  assert.equal(MULTI_CONNECTION_BUNDLE.priceUsd, 120);
  assert.equal(MULTI_CONNECTION_BUNDLE.amountCents, 12000);
  assert.equal(FREE_TRIAL_CONFIG.durationHours, 4);
});

test('Savings calculations are mathematically exact against the $10 1-Month baseline', () => {
  const plan1m = getPlanById('plan-1m-1c')!;
  const s1m = calculatePlanSavings(plan1m);
  assert.equal(s1m.savedCents, 0);
  assert.equal(s1m.savedPercentage, 0);

  const plan12m = getPlanById('plan-12m-1c')!;
  const s12m = calculatePlanSavings(plan12m);
  assert.equal(s12m.baselineTotalCents, 12000); // 12 * $10 = $120
  assert.equal(s12m.savedCents, 7000); // $120 - $50 = $70 saved
  assert.equal(s12m.savedPercentage, 58.3);

  const bundle3c = getPlanById('bundle-12m-3c')!;
  const sBundle = calculatePlanSavings(bundle3c);
  assert.equal(sBundle.baselineTotalCents, 36000); // 12 * 3 * $10 = $360
  assert.equal(sBundle.savedCents, 24000); // $360 - $120 = $240 saved
  assert.equal(sBundle.savedPercentage, 66.7);
});

test('Zod validation schemas enforce valid inputs and reject invalid plans or emails', () => {
  const validOrder = orderCheckoutSchema.safeParse({
    planId: 'plan-12m-1c',
    customerEmail: 'customer@example.com',
    deviceType: 'Android TV / Google TV',
    paymentMethod: 'manual_invoice',
  });
  assert.equal(validOrder.success, true);

  const invalidOrder = orderCheckoutSchema.safeParse({
    planId: 'fake-lifetime-plan',
    customerEmail: 'not-an-email',
    deviceType: '',
    paymentMethod: 'manual_invoice',
  });
  assert.equal(invalidOrder.success, false);

  const validTrial = trialRequestSchema.safeParse({
    customerEmail: 'trial@example.com',
    deviceType: 'Amazon Fire TV / FireStick',
    playerApp: 'IPTV Smarters Pro',
  });
  assert.equal(validTrial.success, true);
});

test('SEO metadata, robots index/noindex rules, sitemap, and transactional emails are consistent', () => {
  for (const pubPath of PUBLIC_INDEXABLE_PATHS) {
    const meta = getRouteSeoMeta(pubPath, 'https://lumiqtv.example.com');
    assert.equal(meta.robots, 'index, follow', `Public path ${pubPath} must be index, follow`);
    assert.ok(meta.title.includes('Lumiq TV'), `Title for ${pubPath} must include brand Lumiq TV`);
    assert.ok(meta.jsonLd.length >= 1, `Public path ${pubPath} must include JSON-LD structured data`);
  }

  for (const privPath of NOINDEX_PRIVATE_PATHS) {
    const meta = getRouteSeoMeta(privPath, 'https://lumiqtv.example.com');
    assert.equal(meta.robots, 'noindex, nofollow', `Private path ${privPath} must be noindex, nofollow`);
  }

  const sitemap = generateXmlSitemap('https://lumiqtv.example.com');
  assert.ok(sitemap.includes('<loc>https://lumiqtv.example.com/iptv-smarters-pro-subscription</loc>'));
  assert.ok(!sitemap.includes('/admin'), 'Sitemap must never include private /admin route');
  assert.ok(!sitemap.includes('/account'), 'Sitemap must never include private /account route');

  const robots = generateRobotsTxt('https://lumiqtv.example.com');
  assert.ok(robots.includes('Disallow: /admin'));
  assert.ok(robots.includes('Disallow: /account'));

  const email = renderTransactionalEmail('order_received', {
    recipientEmail: 'buyer@example.com',
    orderId: 'ORD-101',
    planId: 'bundle-12m-3c',
  });
  assert.ok(email.bodyText.includes('$120 USD (12 Months, 3 Connections)'));
  assert.equal(formatUsdFromCents(12000), '$120');
});
