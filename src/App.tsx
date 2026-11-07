/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { HomeView } from './views/HomeView';
import {
  PricingView,
  FreeTrialView,
  SmartersProLandingView,
  PlayersHubView,
  DevicesHubView,
  DeviceDetailView,
  GuidesHubView,
  GuideDetailView,
  BlogHubView,
  BlogArticleView,
  FaqView,
  ContactView,
  LegalDocumentView,
  NotFoundView,
} from './views/PublicSeoViews';
import {
  CheckoutView,
  LoginView,
  CustomerDashboardView,
  AdminDashboardView,
} from './views/CustomerAndAdminViews';

const AppRouter: React.FC = () => {
  const { pathname } = useApp();
  const cleanPath = pathname.replace(/\/+$/, '') || '/';

  if (cleanPath === '/') return <HomeView />;
  if (cleanPath === '/pricing') return <PricingView />;
  if (cleanPath === '/free-trial') return <FreeTrialView />;
  if (cleanPath === '/iptv-smarters-pro-subscription') return <SmartersProLandingView />;
  if (cleanPath === '/iptv-players') return <PlayersHubView />;
  if (cleanPath === '/devices') return <DevicesHubView />;
  if (cleanPath.startsWith('/devices/')) {
    const slug = cleanPath.replace('/devices/', '');
    return <DeviceDetailView slug={slug} />;
  }
  if (cleanPath === '/guides') return <GuidesHubView />;
  if (cleanPath.startsWith('/guides/')) {
    const slug = cleanPath.replace('/guides/', '');
    return <GuideDetailView slug={slug} />;
  }
  if (cleanPath === '/blog') return <BlogHubView />;
  if (cleanPath.startsWith('/blog/')) {
    const slug = cleanPath.replace('/blog/', '');
    return <BlogArticleView slug={slug} />;
  }
  if (cleanPath === '/faq') return <FaqView />;
  if (cleanPath === '/contact') return <ContactView />;
  if (cleanPath === '/terms') return <LegalDocumentView type="terms" />;
  if (cleanPath === '/privacy') return <LegalDocumentView type="privacy" />;
  if (cleanPath === '/refund-policy') return <LegalDocumentView type="refund" />;
  if (cleanPath === '/copyright') return <LegalDocumentView type="copyright" />;
  if (cleanPath === '/compatibility-disclosure') return <LegalDocumentView type="compatibility" />;
  if (cleanPath === '/checkout') return <CheckoutView />;
  if (cleanPath === '/login') return <LoginView />;
  if (cleanPath === '/account') return <CustomerDashboardView ordersOnly={false} />;
  if (cleanPath === '/account/orders') return <CustomerDashboardView ordersOnly={true} />;
  if (cleanPath === '/admin') return <AdminDashboardView />;

  return <NotFoundView />;
};

export default function App() {
  return (
    <AppProvider>
      <Layout>
        <AppRouter />
      </Layout>
    </AppProvider>
  );
}
