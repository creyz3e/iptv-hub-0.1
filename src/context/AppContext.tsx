import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut as fbSignOut, type User } from 'firebase/auth';
import {
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { getRouteSeoMeta } from '../lib/seo';
import { INITIAL_EDITORIAL_ARTICLES } from '../lib/content';
import {
  type OrderStatus,
  type PaymentStatus,
  type SubscriptionStatus,
  type TrialStatus,
  type PaymentMethodId,
  getPlanById,
} from '../lib/pricing';

export interface CustomerProfile {
  uid: string;
  email: string;
  displayName: string;
  preferredDevice: string;
  role: 'customer' | 'admin';
  internalNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderRecord {
  orderId: string;
  userId: string;
  customerEmail: string;
  planId: string;
  planName: string;
  durationMonths: number;
  connections: number;
  amountCents: number;
  currency: 'USD';
  paymentMethod: PaymentMethodId;
  deviceType: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  subscriptionStatus: SubscriptionStatus;
  activationDate: string;
  expirationDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrialRecord {
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

export interface SupportRecord {
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

export interface EditorialArticle {
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
  createdAt?: string;
  updatedAt?: string;
}

export interface AuditLogRecord {
  logId: string;
  adminUid: string;
  adminEmail: string;
  action: string;
  targetType: 'order' | 'trial' | 'article' | 'profile' | 'support';
  targetId: string;
  details: string;
  createdAt: string;
}

interface AppContextValue {
  pathname: string;
  searchParams: URLSearchParams;
  navigate: (to: string) => void;
  firebaseUser: User | null;
  profile: CustomerProfile | null;
  orders: OrderRecord[];
  trialRequests: TrialRecord[];
  supportRequests: SupportRecord[];
  publishedArticles: EditorialArticle[];
  selectedCheckoutPlanId: string;
  setSelectedCheckoutPlanId: (planId: string) => void;
  signInWithEmailSession: (email: string, preferredDevice?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  submitOrder: (input: {
    planId: string;
    customerEmail: string;
    deviceType: string;
    paymentMethod: PaymentMethodId;
  }) => Promise<{ order: OrderRecord }>;
  markOrderPaymentUnderReview: (orderId: string) => Promise<void>;
  submitTrialRequest: (input: {
    customerEmail: string;
    deviceType: string;
    playerApp: string;
  }) => Promise<{ trial: TrialRecord }>;
  submitSupportRequest: (input: {
    customerEmail: string;
    subject: string;
    category: 'setup' | 'billing' | 'trial' | 'compatibility' | 'general';
    message: string;
  }) => Promise<{ ticket: SupportRecord }>;
  refreshCustomerData: (emailOverride?: string) => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

function syncDocumentHeadSeo(pathname: string) {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://lumiqtv.example.com';
  const seo = getRouteSeoMeta(pathname, origin);
  document.title = seo.title;

  const setMeta = (selector: string, attrName: 'name' | 'property', attrValue: string, content: string) => {
    let el = document.head.querySelector(selector) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attrName, attrValue);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMeta('meta[name="description"]', 'name', 'description', seo.description);
  setMeta('meta[name="robots"]', 'name', 'robots', seo.robots);
  setMeta('meta[property="og:title"]', 'property', 'og:title', seo.title);
  setMeta('meta[property="og:description"]', 'property', 'og:description', seo.description);
  setMeta('meta[property="og:type"]', 'property', 'og:type', seo.ogType);
  setMeta(
    'meta[property="og:url"]',
    'property',
    'og:url',
    `${origin}${seo.canonicalPath === '/' ? '' : seo.canonicalPath}`
  );
  setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', seo.title);
  setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', seo.description);

  let canonicalEl = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', `${origin}${seo.canonicalPath === '/' ? '' : seo.canonicalPath}`);

  // Update JSON-LD scripts dynamically
  document.head.querySelectorAll('script[type="application/ld+json"]').forEach((node) => node.remove());
  for (const schema of seo.jsonLd) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pathname, setPathname] = useState<string>(() => window.location.pathname || '/');
  const [searchString, setSearchString] = useState<string>(() => window.location.search || '');
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [trialRequests, setTrialRequests] = useState<TrialRecord[]>([]);
  const [supportRequests, setSupportRequests] = useState<SupportRecord[]>([]);
  const [publishedArticles, setPublishedArticles] = useState<EditorialArticle[]>(() =>
    INITIAL_EDITORIAL_ARTICLES.map((a) => ({
      ...a,
      tableOfContents: [...a.tableOfContents],
    }))
  );
  const [selectedCheckoutPlanId, setSelectedCheckoutPlanId] = useState<string>('plan-12m-1c');

  const navigate = useCallback((to: string) => {
    const url = new URL(to, window.location.origin);
    window.history.pushState({}, '', `${url.pathname}${url.search}`);
    setPathname(url.pathname || '/');
    setSearchString(url.search || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const onPopState = () => {
      setPathname(window.location.pathname || '/');
      setSearchString(window.location.search || '');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    syncDocumentHeadSeo(pathname);
    const params = new URLSearchParams(searchString);
    const planParam = params.get('plan');
    if (planParam && getPlanById(planParam)) {
      setSelectedCheckoutPlanId(planParam);
    }
  }, [pathname, searchString]);

  const loadCatalog = useCallback(async () => {
    try {
      const res = await fetch('/api/catalog');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.articles)) {
          setPublishedArticles(data.articles);
        }
      }
    } catch (err) {
      console.error('Failed to fetch catalog:', err);
    }
  }, []);

  const refreshCustomerData = useCallback(
    async (emailOverride?: string) => {
      const targetEmail = emailOverride || profile?.email;
      if (!targetEmail) return;
      try {
        const res = await fetch(`/api/customer/overview?email=${encodeURIComponent(targetEmail)}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);
          setOrders(data.orders || []);
          setTrialRequests(data.trialRequests || []);
          setSupportRequests(data.supportRequests || []);
        }
      } catch (err) {
        console.error('Error refreshing customer overview:', err);
      }
    },
    [profile?.email]
  );

  useEffect(() => {
    loadCatalog();
    // Initialize default active session for immediate preview & testing while allowing full switching
    const savedEmail = window.sessionStorage.getItem('lumiq_active_email') || 'alex.mercer@example.com';
    refreshCustomerData(savedEmail);
  }, [loadCatalog]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user && user.email) {
        window.sessionStorage.setItem('lumiq_active_email', user.email);
        await refreshCustomerData(user.email);
        if (user.emailVerified) {
          const path = `profiles/${user.uid}`;
          try {
            await setDoc(
              doc(db, 'profiles', user.uid),
              {
                uid: user.uid,
                email: user.email,
                displayName: (user.displayName || user.email.split('@')[0]).slice(0, 100),
                preferredDevice: 'Android TV / Google TV',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              },
              { merge: true }
            );
          } catch (error) {
            handleFirestoreError(error, OperationType.WRITE, path);
          }
        }
      }
    });
    return () => unsub();
  }, [refreshCustomerData]);

  const signInWithEmailSession = async (email: string, preferredDevice = 'Android TV / Google TV') => {
    const res = await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, preferredDevice }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to sign in.');
    }
    window.sessionStorage.setItem('lumiq_active_email', data.profile.email);
    setProfile(data.profile);
    setOrders(data.orders || []);
    setTrialRequests(data.trialRequests || []);
    setSupportRequests(data.supportRequests || []);
  };

  const signInWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    if (cred.user.email) {
      await signInWithEmailSession(cred.user.email, 'Android TV / Google TV');
    }
  };

  const signOutUser = async () => {
    try {
      if (firebaseUser) {
        await fbSignOut(auth);
      }
    } catch (err) {
      console.error('Error signing out of Firebase:', err);
    }
    window.sessionStorage.removeItem('lumiq_active_email');
    setProfile(null);
    setOrders([]);
    setTrialRequests([]);
    setSupportRequests([]);
  };

  const submitOrder = async (input: {
    planId: string;
    customerEmail: string;
    deviceType: string;
    paymentMethod: PaymentMethodId;
  }) => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...input,
        userId: firebaseUser?.uid,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Unable to create order.');
    }

    const createdOrder: OrderRecord = data.order;
    window.sessionStorage.setItem('lumiq_active_email', data.profile.email);
    setProfile(data.profile);
    setOrders((prev) => [createdOrder, ...prev.filter((o) => o.orderId !== createdOrder.orderId)]);

    if (firebaseUser && firebaseUser.emailVerified) {
      const firestorePath = `orders/${createdOrder.orderId}`;
      try {
        await setDoc(doc(db, 'orders', createdOrder.orderId), {
          ...createdOrder,
          userId: firebaseUser.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, firestorePath);
      }
    }

    return { order: createdOrder };
  };

  const markOrderPaymentUnderReview = async (orderId: string) => {
    if (!profile) return;
    const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/submit-payment-proof`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerEmail: profile.email }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Could not update payment status.');
    }
    setOrders((prev) => prev.map((o) => (o.orderId === orderId ? data.order : o)));

    if (firebaseUser && firebaseUser.emailVerified) {
      const firestorePath = `orders/${orderId}`;
      try {
        await updateDoc(doc(db, 'orders', orderId), {
          paymentStatus: 'Payment Under Review',
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, firestorePath);
      }
    }
  };

  const submitTrialRequest = async (input: {
    customerEmail: string;
    deviceType: string;
    playerApp: string;
  }) => {
    const res = await fetch('/api/trials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...input,
        userId: firebaseUser?.uid,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Could not submit trial request.');
    }
    const createdTrial: TrialRecord = data.trial;
    window.sessionStorage.setItem('lumiq_active_email', data.profile.email);
    setProfile(data.profile);
    setTrialRequests((prev) => [createdTrial, ...prev.filter((t) => t.trialId !== createdTrial.trialId)]);

    if (firebaseUser && firebaseUser.emailVerified) {
      const firestorePath = `trial_requests/${createdTrial.trialId}`;
      try {
        await setDoc(doc(db, 'trial_requests', createdTrial.trialId), {
          ...createdTrial,
          userId: firebaseUser.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, firestorePath);
      }
    }

    return { trial: createdTrial };
  };

  const submitSupportRequest = async (input: {
    customerEmail: string;
    subject: string;
    category: 'setup' | 'billing' | 'trial' | 'compatibility' | 'general';
    message: string;
  }) => {
    const res = await fetch('/api/support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to submit support ticket.');
    }
    const createdTicket: SupportRecord = data.ticket;
    setSupportRequests((prev) => [createdTicket, ...prev]);

    if (firebaseUser && firebaseUser.emailVerified) {
      const firestorePath = `support_requests/${createdTicket.ticketId}`;
      try {
        await setDoc(doc(db, 'support_requests', createdTicket.ticketId), {
          ...createdTicket,
          userId: firebaseUser.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, firestorePath);
      }
    }

    return { ticket: createdTicket };
  };

  return (
    <AppContext.Provider
      value={{
        pathname,
        searchParams: new URLSearchParams(searchString),
        navigate,
        firebaseUser,
        profile,
        orders,
        trialRequests,
        supportRequests,
        publishedArticles,
        selectedCheckoutPlanId,
        setSelectedCheckoutPlanId,
        signInWithEmailSession,
        signInWithGoogle,
        signOutUser,
        submitOrder,
        markOrderPaymentUnderReview,
        submitTrialRequest,
        submitSupportRequest,
        refreshCustomerData: () => {
          loadCatalog();
          return refreshCustomerData();
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return ctx;
}
