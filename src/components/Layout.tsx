import React, { useState } from 'react';
import { Menu, X, ChevronRight, Tv, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getRouteSeoMeta } from '../lib/seo';

export const AppLink: React.FC<{
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
}> = ({ href, className = '', children, onClick, ariaLabel }) => {
  const { navigate } = useApp();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    if (onClick) onClick();
    navigate(href);
  };

  return (
    <a href={href} onClick={handleClick} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname, profile } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const seoMeta = getRouteSeoMeta(pathname);

  const primaryNavLinks = [
    { label: 'Plans & Pricing', href: '/pricing' },
    { label: '4-Hour Free Trial', href: '/free-trial' },
    { label: 'Supported TVs', href: '/devices' },
    { label: 'Setup Guides', href: '/guides' },
    { label: 'Blog', href: '/blog' },
    { label: 'FAQ', href: '/faq' },
  ];

  const isAccountActive =
    pathname === '/login' || pathname === '/account' || pathname.startsWith('/account/');

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-zinc-900 antialiased selection:bg-blue-600 selection:text-white">
      {/* Header: 1-row, 3-zone layout */}
      <header className="sticky top-0 z-40 h-16 border-b border-zinc-200/90 bg-white/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
          {/* Zone 1: Brand Wordmark */}
          <AppLink
            href="/"
            className="inline-flex items-center gap-2 text-xl font-bold tracking-tight text-zinc-900 font-display whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            <Tv className="w-5 h-5 text-blue-600" />
            <span>Lumiq TV</span>
          </AppLink>

          {/* Zone 2: Primary Navigation Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600"
          >
            {primaryNavLinks.map((item) => {
              const isActive =
                pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <AppLink
                  key={item.href}
                  href={item.href}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 hover:text-zinc-950 ${
                    isActive
                      ? 'text-blue-600 font-semibold underline underline-offset-8 decoration-2 decoration-blue-600'
                      : 'text-zinc-600'
                  }`}
                >
                  {item.label}
                </AppLink>
              );
            })}
          </nav>

          {/* Zone 3: Top-Right Account Button (Login / My Account) + Primary Action */}
          <div className="flex items-center gap-2.5 shrink-0">
            <AppLink
              href={profile ? '/account' : '/login'}
              className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 ${
                isAccountActive
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-100 hover:border-zinc-300'
              }`}
            >
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>{profile ? 'My Account' : 'Login'}</span>
            </AppLink>

            <AppLink
              href="/pricing"
              className="hidden sm:inline-flex px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs"
            >
              View Plans ($10/mo)
            </AppLink>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile Navigation"
            className="md:hidden border-b border-zinc-200 bg-white px-4 pt-3 pb-6 space-y-1.5 shadow-lg"
          >
            {[
              { label: 'Home', href: '/' },
              { label: 'Plans & Pricing ($10–$140)', href: '/pricing' },
              { label: '4-Hour Free Trial ($0)', href: '/free-trial' },
              { label: 'Supported TVs & Devices', href: '/devices' },
              { label: 'TV Setup Guides', href: '/guides' },
              { label: 'IPTV Smarters Pro Guide', href: '/iptv-smarters-pro-subscription' },
              { label: 'Compatible Player Apps', href: '/iptv-players' },
              { label: 'Streaming Blog & Guides', href: '/blog' },
              { label: 'FAQ & Help Center', href: '/faq' },
              { label: 'Contact Support', href: '/contact' },
              {
                label: profile ? `My Account (${profile.email})` : 'Login',
                href: profile ? '/account' : '/login',
              },
            ].map((link) => (
              <AppLink
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950'
                }`}
              >
                {link.label}
              </AppLink>
            ))}
          </nav>
        )}
      </header>

      {/* Breadcrumbs on Subpages (Preserves Breadcrumb SEO Hierarchy) */}
      {pathname !== '/' && (
        <div className="border-b border-zinc-200/80 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4 text-xs text-zinc-500">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
              {seoMeta.breadcrumbs.map((crumb, index) => {
                const isLast = index === seoMeta.breadcrumbs.length - 1;
                return (
                  <React.Fragment key={crumb.path}>
                    {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />}
                    {isLast ? (
                      <span className="text-zinc-900 font-medium" aria-current="page">
                        {crumb.name}
                      </span>
                    ) : (
                      <AppLink href={crumb.path} className="hover:text-blue-600 transition-colors">
                        {crumb.name}
                      </AppLink>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>

            <div className="hidden sm:flex items-center gap-4 shrink-0">
              <AppLink href={profile ? '/account' : '/login'} className="hover:text-zinc-900 transition-colors">
                {profile ? 'My Account' : 'Login'}
              </AppLink>
              <span aria-hidden="true">·</span>
              <AppLink href="/contact" className="hover:text-zinc-900 transition-colors">
                Need Help?
              </AppLink>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">{children}</main>

      {/* Clean, Balanced Customer Footer */}
      <footer className="border-t border-zinc-200 bg-white text-zinc-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
            {/* Brand Column */}
            <div className="lg:col-span-4 space-y-3.5">
              <AppLink
                href="/"
                className="inline-flex items-center gap-2 text-lg font-bold text-zinc-900 font-display tracking-tight"
              >
                <Tv className="w-5 h-5 text-blue-600" />
                <span>Lumiq TV</span>
              </AppLink>
              <p className="text-sm text-zinc-600 leading-relaxed max-w-sm">
                Flexible IPTV subscription plans for Smart TVs, FireStick, Apple TV, Android TV, and mobile devices. Transparent USD pricing starting at $10/month with a 4-hour free trial.
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
                Lumiq TV is an independent subscription provider and is not affiliated with IPTV Smarters Pro, TiviMate, IBO Player, Amazon Fire TV, Google TV, Apple TV, Samsung, or LG.
              </p>
            </div>

            {/* Column 1: Subscriptions */}
            <div className="lg:col-span-3 space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
                IPTV Subscriptions
              </h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <AppLink href="/pricing" className="hover:text-blue-600 transition-colors">
                    Plans &amp; Pricing ($10–$140)
                  </AppLink>
                </li>
                <li>
                  <AppLink href="/free-trial" className="hover:text-blue-600 transition-colors">
                    4-Hour Free Trial
                  </AppLink>
                </li>
                <li>
                  <AppLink href="/iptv-smarters-pro-subscription" className="hover:text-blue-600 transition-colors">
                    IPTV Smarters Pro Guide
                  </AppLink>
                </li>
                <li>
                  <AppLink href="/iptv-players" className="hover:text-blue-600 transition-colors">
                    Compatible Player Apps
                  </AppLink>
                </li>
                <li>
                  <AppLink href={profile ? '/account' : '/login'} className="hover:text-blue-600 transition-colors">
                    {profile ? 'My Account & Orders' : 'Customer Login'}
                  </AppLink>
                </li>
              </ul>
            </div>

            {/* Column 2: Supported TVs */}
            <div className="lg:col-span-2 space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
                Supported TVs
              </h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <AppLink href="/devices/fire-tv" className="hover:text-blue-600 transition-colors">
                    Amazon FireStick
                  </AppLink>
                </li>
                <li>
                  <AppLink href="/devices/android-tv" className="hover:text-blue-600 transition-colors">
                    Android &amp; Google TV
                  </AppLink>
                </li>
                <li>
                  <AppLink href="/devices/samsung-tv" className="hover:text-blue-600 transition-colors">
                    Samsung Smart TV
                  </AppLink>
                </li>
                <li>
                  <AppLink href="/devices/lg-tv" className="hover:text-blue-600 transition-colors">
                    LG Smart TV
                  </AppLink>
                </li>
                <li>
                  <AppLink href="/devices/apple-tv" className="hover:text-blue-600 transition-colors">
                    Apple TV
                  </AppLink>
                </li>
              </ul>
            </div>

            {/* Column 3: Help & Setup */}
            <div className="lg:col-span-3 space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
                Setup &amp; Support
              </h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <AppLink href="/guides/how-to-set-up-iptv" className="hover:text-blue-600 transition-colors">
                    How to Set Up IPTV
                  </AppLink>
                </li>
                <li>
                  <AppLink href="/guides/iptv-smarters-pro-setup" className="hover:text-blue-600 transition-colors">
                    Smarters Pro Setup Steps
                  </AppLink>
                </li>
                <li>
                  <AppLink href="/guides/iptv-smarters-pro-not-working" className="hover:text-blue-600 transition-colors">
                    Troubleshooting Guide
                  </AppLink>
                </li>
                <li>
                  <AppLink href="/blog" className="hover:text-blue-600 transition-colors">
                    Streaming Blog
                  </AppLink>
                </li>
                <li>
                  <AppLink href="/faq" className="hover:text-blue-600 transition-colors">
                    FAQ &amp; Help Center
                  </AppLink>
                </li>
                <li>
                  <AppLink href="/contact" className="hover:text-blue-600 transition-colors">
                    Contact Support
                  </AppLink>
                </li>
              </ul>
            </div>
          </div>

          {/* Clean Bottom Legal Bar */}
          <div className="mt-10 pt-6 border-t border-zinc-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-zinc-500">
            <p>© {new Date().getFullYear()} Lumiq TV. All rights reserved. Prices in USD.</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <AppLink href="/terms" className="hover:text-zinc-900 transition-colors">
                Terms of Service
              </AppLink>
              <AppLink href="/privacy" className="hover:text-zinc-900 transition-colors">
                Privacy Policy
              </AppLink>
              <AppLink href="/refund-policy" className="hover:text-zinc-900 transition-colors">
                Refund Policy
              </AppLink>
              <AppLink href="/compatibility-disclosure" className="hover:text-zinc-900 transition-colors">
                Compatibility Disclosure
              </AppLink>
              <AppLink href="/copyright" className="hover:text-zinc-900 transition-colors">
                Copyright Policy
              </AppLink>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
