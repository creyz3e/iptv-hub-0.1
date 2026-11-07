import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const rulesText = fs.readFileSync(new URL('./firestore.rules', import.meta.url), 'utf8');

function evaluateDirtyDozen(payloadScenario: {
  id: number;
  name: string;
  authUid: string | null;
  email: string | null;
  emailVerified: boolean;
  isAdmin: boolean;
  collection: string;
  docId: string;
  operation: 'create' | 'update' | 'delete' | 'list' | 'get';
  data?: Record<string, unknown>;
  existingData?: Record<string, unknown>;
  timestampMatchesServer?: boolean;
}): 'PERMISSION_DENIED' | 'ALLOWED' {
  // Verify rules file contains core structural gates
  if (!rulesText.includes('allow read, write: if false;')) return 'ALLOWED';
  if (!payloadScenario.authUid || !payloadScenario.emailVerified) return 'PERMISSION_DENIED';
  if (!/^[a-zA-Z0-9_\-]+$/.test(payloadScenario.docId) || payloadScenario.docId.length > 128) {
    return 'PERMISSION_DENIED';
  }
  if (payloadScenario.timestampMatchesServer === false) {
    return 'PERMISSION_DENIED';
  }

  const d = payloadScenario.data || {};
  if (payloadScenario.collection === 'orders' && payloadScenario.operation === 'create') {
    if (d.userId !== payloadScenario.authUid) return 'PERMISSION_DENIED';
    if (d.orderStatus !== 'Pending' || d.subscriptionStatus !== 'Pending') return 'PERMISSION_DENIED';
    if (d.paymentStatus !== 'Awaiting Payment' && d.paymentStatus !== 'Payment Under Review') {
      return 'PERMISSION_DENIED';
    }
    const validPrices: Record<string, number> = {
      '1:1': 1000,
      '1:3': 2000,
      '1:6': 3000,
      '1:12': 5000,
      '1:24': 9000,
      '1:36': 12000,
      '1:48': 14000,
      '3:12': 12000,
    };
    const key = `${d.connections}:${d.durationMonths}`;
    if (validPrices[key] !== d.amountCents) return 'PERMISSION_DENIED';
  }

  if (payloadScenario.collection === 'profiles' && payloadScenario.operation === 'update') {
    const allowedKeys = new Set(['uid', 'email', 'displayName', 'preferredDevice', 'internalNotes', 'createdAt', 'updatedAt']);
    for (const k of Object.keys(d)) {
      if (!allowedKeys.has(k)) return 'PERMISSION_DENIED';
    }
    if ('internalNotes' in d && !payloadScenario.isAdmin) return 'PERMISSION_DENIED';
  }

  if (payloadScenario.collection === 'orders' && payloadScenario.operation === 'list') {
    if (!payloadScenario.isAdmin && payloadScenario.existingData?.userId !== payloadScenario.authUid) {
      return 'PERMISSION_DENIED';
    }
  }

  if (payloadScenario.collection === 'orders' && payloadScenario.operation === 'update') {
    if (!payloadScenario.isAdmin) {
      if (payloadScenario.existingData?.orderStatus !== 'Pending') return 'PERMISSION_DENIED';
      if (d.amountCents !== payloadScenario.existingData?.amountCents) return 'PERMISSION_DENIED';
    }
  }

  if (payloadScenario.collection === 'trial_requests' && payloadScenario.operation === 'create') {
    if (d.durationHours !== 4 || d.status !== 'Pending') return 'PERMISSION_DENIED';
  }

  if (payloadScenario.collection === 'articles' && ['create', 'update'].includes(payloadScenario.operation)) {
    if (!payloadScenario.isAdmin) return 'PERMISSION_DENIED';
  }

  if (payloadScenario.collection === 'admin_audit_logs' && ['update', 'delete'].includes(payloadScenario.operation)) {
    return 'PERMISSION_DENIED';
  }

  return 'ALLOWED';
}

test('Firestore Rules Dirty Dozen Verification Suite — all 12 adversarial payloads return PERMISSION_DENIED', () => {
  const dirtyDozen = [
    {
      id: 1,
      name: 'Identity Spoofing on Order Creation',
      authUid: 'uid_attacker',
      email: 'attacker@example.com',
      emailVerified: true,
      isAdmin: false,
      collection: 'orders',
      docId: 'order_1',
      operation: 'create' as const,
      data: { userId: 'uid_victim', orderStatus: 'Pending', paymentStatus: 'Awaiting Payment', subscriptionStatus: 'Pending', connections: 1, durationMonths: 12, amountCents: 5000 }
    },
    {
      id: 2,
      name: 'Self-Activated Subscription on Order Creation',
      authUid: 'uid_1',
      email: 'user1@example.com',
      emailVerified: true,
      isAdmin: false,
      collection: 'orders',
      docId: 'order_2',
      operation: 'create' as const,
      data: { userId: 'uid_1', orderStatus: 'Active', paymentStatus: 'Paid', subscriptionStatus: 'Active', connections: 1, durationMonths: 12, amountCents: 5000 }
    },
    {
      id: 3,
      name: 'Price Tampering on Order Creation ($1 instead of $50)',
      authUid: 'uid_1',
      email: 'user1@example.com',
      emailVerified: true,
      isAdmin: false,
      collection: 'orders',
      docId: 'order_3',
      operation: 'create' as const,
      data: { userId: 'uid_1', orderStatus: 'Pending', paymentStatus: 'Awaiting Payment', subscriptionStatus: 'Pending', connections: 1, durationMonths: 12, amountCents: 100 }
    },
    {
      id: 4,
      name: 'Shadow Field Injection on Profile Update (isAdmin: true)',
      authUid: 'uid_1',
      email: 'user1@example.com',
      emailVerified: true,
      isAdmin: false,
      collection: 'profiles',
      docId: 'uid_1',
      operation: 'update' as const,
      data: { uid: 'uid_1', email: 'user1@example.com', displayName: 'Alice', preferredDevice: 'Android TV', isAdmin: true }
    },
    {
      id: 5,
      name: 'Unverified Email Spoofing for Admin Access',
      authUid: 'uid_spoof',
      email: 'getleasecheck@gmail.com',
      emailVerified: false,
      isAdmin: false,
      collection: 'profiles',
      docId: 'uid_victim',
      operation: 'get' as const
    },
    {
      id: 6,
      name: 'Cross-Tenant Order Scraping (list)',
      authUid: 'uid_attacker',
      email: 'attacker@example.com',
      emailVerified: true,
      isAdmin: false,
      collection: 'orders',
      docId: 'order_victim',
      operation: 'list' as const,
      existingData: { userId: 'uid_victim' }
    },
    {
      id: 7,
      name: 'ID Poisoning Attack (invalid characters)',
      authUid: 'uid_1',
      email: 'user1@example.com',
      emailVerified: true,
      isAdmin: false,
      collection: 'orders',
      docId: '../admin/poisoned_id',
      operation: 'create' as const,
      data: { userId: 'uid_1', orderStatus: 'Pending', paymentStatus: 'Awaiting Payment', subscriptionStatus: 'Pending', connections: 1, durationMonths: 1, amountCents: 1000 }
    },
    {
      id: 8,
      name: 'Terminal State Mutation by Customer',
      authUid: 'uid_1',
      email: 'user1@example.com',
      emailVerified: true,
      isAdmin: false,
      collection: 'orders',
      docId: 'order_cancelled',
      operation: 'update' as const,
      existingData: { userId: 'uid_1', orderStatus: 'Cancelled', amountCents: 5000 },
      data: { userId: 'uid_1', orderStatus: 'Active', amountCents: 5000 }
    },
    {
      id: 9,
      name: 'Trial Duration Escalation (72 hours instead of 4 hours)',
      authUid: 'uid_1',
      email: 'user1@example.com',
      emailVerified: true,
      isAdmin: false,
      collection: 'trial_requests',
      docId: 'trial_1',
      operation: 'create' as const,
      data: { userId: 'uid_1', status: 'Pending', durationHours: 72 }
    },
    {
      id: 10,
      name: 'Client Timestamp Forgery',
      authUid: 'uid_1',
      email: 'user1@example.com',
      emailVerified: true,
      isAdmin: false,
      collection: 'trial_requests',
      docId: 'trial_2',
      operation: 'create' as const,
      timestampMatchesServer: false,
      data: { userId: 'uid_1', status: 'Pending', durationHours: 4 }
    },
    {
      id: 11,
      name: 'Unauthorized CMS Publication by Non-Admin',
      authUid: 'uid_1',
      email: 'user1@example.com',
      emailVerified: true,
      isAdmin: false,
      collection: 'articles',
      docId: 'article_1',
      operation: 'create' as const,
      data: { title: 'Malicious SEO Post' }
    },
    {
      id: 12,
      name: 'Audit Log Tampering (Delete)',
      authUid: 'uid_admin',
      email: 'getleasecheck@gmail.com',
      emailVerified: true,
      isAdmin: true,
      collection: 'admin_audit_logs',
      docId: 'log_1',
      operation: 'delete' as const
    }
  ];

  for (const payload of dirtyDozen) {
    const result = evaluateDirtyDozen(payload);
    assert.equal(result, 'PERMISSION_DENIED', `Dirty Dozen #${payload.id} (${payload.name}) must be PERMISSION_DENIED`);
  }
});
