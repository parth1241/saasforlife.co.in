import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Pricing from '../components/Pricing';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import CookieBanner from '../components/CookieBanner';
import WhatsAppButton from '../components/WhatsAppButton';
import { useCurrency } from '../hooks/useCurrency';

export default function Home() {
  const { currency, convert } = useCurrency();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "saasforlife.co.in",
    "url": "https://saasforlife.co.in",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "support@saasforlife.co.in",
      "contactType": "customer support",
      "areaServed": "IN"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    }
  };

  return (
    <div className="bg-[#0F172A] min-h-screen text-white overflow-x-hidden font-sans">
      <Helmet>
        <title>saasforlife.co.in — Software Solutions for India & the World</title>
        <meta name="description" content="Affordable SaaS hosting, analytics, payment integration and custom solutions for Indian and global businesses. Plans from ₹1,499/month." />
        <link rel="canonical" href="https://saasforlife.co.in" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://saasforlife.co.in" />
        <meta property="og:title" content="saasforlife.co.in — Software Solutions for India & the World" />
        <meta property="og:description" content="Affordable SaaS hosting, analytics, payment integration and custom solutions for Indian and global businesses. Plans from ₹1,499/month." />
        <meta property="og:image" content="https://saasforlife.co.in/og-image.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://saasforlife.co.in" />
        <meta name="twitter:title" content="saasforlife.co.in — Software Solutions for India & the World" />
        <meta name="twitter:description" content="Affordable SaaS hosting, analytics, payment integration and custom solutions for Indian and global businesses. Plans from ₹1,499/month." />
        <meta name="twitter:image" content="https://saasforlife.co.in/og-image.png" />

        {/* JSON-LD Schema */}
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
      </Helmet>

      <Navbar />
      <main>
        <Hero />
        <Features />
        <Pricing currency={currency} convert={convert} />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <CookieBanner />
      <WhatsAppButton />
    </div>
  );
}


