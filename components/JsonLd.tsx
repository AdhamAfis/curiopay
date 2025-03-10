import React from 'react';

export function JsonLd() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CurioPay',
    url: 'https://curiopay.vercel.app',
    description: 'Master your money with CurioPay\'s AI-powered finance tools. Smart budgeting, expense tracking, and AI-assisted financial planning.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://curiopay.vercel.app/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CurioPay',
    url: 'https://curiopay.vercel.app',
    logo: 'https://curiopay.vercel.app/logo.png',
    sameAs: [
      'https://twitter.com/curiopay',
      'https://github.com/curiopay'
    ]
  };

  const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'CurioPay',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
    </>
  );
} 