import type { NextConfig } from "next";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com https://www.googletagmanager.com https://connect.facebook.net https://www.clarity.ms",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://bizfylr.com https://www.facebook.com https://www.google-analytics.com",
  "font-src 'self' data:",
  "connect-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://lumberjack.razorpay.com https://www.google-analytics.com https://analytics.google.com https://www.clarity.ms https://*.clarity.ms https://connect.facebook.net",
  "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://www.youtube.com https://www.youtube-nocookie.com",
  "media-src 'self'",
  "worker-src 'self' blob:",
  "upgrade-insecure-requests"
].join("; ");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bizfylr.com",
        pathname: "/assets/**"
      }
    ]
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN"
          },
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload"
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups"
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-site"
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin"
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()"
          }
        ]
      },
      {
        source: "/uploads/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800"
          }
        ]
      }
    ];
  },
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/service.html", destination: "/services", permanent: true },
      { source: "/service", destination: "/services", permanent: true },
      { source: "/service/", destination: "/services", permanent: true },
      { source: "/aboutus.html", destination: "/about-us", permanent: true },
      { source: "/aboutus", destination: "/about-us", permanent: true },
      { source: "/aboutus/", destination: "/about-us", permanent: true },
      { source: "/contact.html", destination: "/contact-us", permanent: true },
      { source: "/contact", destination: "/contact-us", permanent: true },
      { source: "/contact/", destination: "/contact-us", permanent: true },
      { source: "/portfolio.html", destination: "/portfolio", permanent: true },
      { source: "/faq.html", destination: "/faq", permanent: true },
      { source: "/payment.html", destination: "/payment", permanent: true },
      { source: "/privacy-policy.html", destination: "/privacy-policy", permanent: true },
      { source: "/refund-policy.html", destination: "/refund-policy", permanent: true },
      { source: "/terms-of-service.html", destination: "/terms-of-service", permanent: true },
      {
        source: "/service/buisness-registration",
        destination: "/services/business-expansion",
        permanent: true
      },
      {
        source: "/service/buisness-registration/",
        destination: "/services/business-expansion",
        permanent: true
      },
      {
        source: "/service/buisness-registration.html",
        destination: "/services/business-expansion",
        permanent: true
      },
      {
        source: "/service/buisness-compliance",
        destination: "/services/business-compliance",
        permanent: true
      },
      {
        source: "/service/buisness-compliance/",
        destination: "/services/business-compliance",
        permanent: true
      },
      {
        source: "/service/buisness-compliance.html",
        destination: "/services/business-compliance",
        permanent: true
      },
      {
        source: "/service/website-development",
        destination: "/services/website-development",
        permanent: true
      },
      {
        source: "/service/website-development/",
        destination: "/services/website-development",
        permanent: true
      },
      {
        source: "/service/website-development.html",
        destination: "/services/website-development",
        permanent: true
      },
      {
        source: "/service/e-commerce-setup",
        destination: "/services/ecommerce-setup",
        permanent: true
      },
      {
        source: "/service/e-commerce-setup/",
        destination: "/services/ecommerce-setup",
        permanent: true
      },
      {
        source: "/service/e-commerce-setup.html",
        destination: "/services/ecommerce-setup",
        permanent: true
      },
      {
        source: "/service/e-commerce-management",
        destination: "/services/ecommerce-management",
        permanent: true
      },
      {
        source: "/service/e-commerce-management/",
        destination: "/services/ecommerce-management",
        permanent: true
      },
      {
        source: "/service/e-commerce-management.html",
        destination: "/services/ecommerce-management",
        permanent: true
      },
      {
        source: "/service/e-marketplace-setup",
        destination: "/services/marketplace-setup",
        permanent: true
      },
      {
        source: "/service/e-marketplace-setup/",
        destination: "/services/marketplace-setup",
        permanent: true
      },
      {
        source: "/service/e-marketplace-setup.html",
        destination: "/services/marketplace-setup",
        permanent: true
      },
      {
        source: "/service/e-marketplace-operation",
        destination: "/services/marketplace-operations",
        permanent: true
      },
      {
        source: "/service/e-marketplace-operation/",
        destination: "/services/marketplace-operations",
        permanent: true
      },
      {
        source: "/service/e-marketplace-operation.html",
        destination: "/services/marketplace-operations",
        permanent: true
      },
      {
        source: "/service/digital-marketing-services",
        destination: "/services/digital-marketing",
        permanent: true
      },
      {
        source: "/service/digital-marketing-services/",
        destination: "/services/digital-marketing",
        permanent: true
      },
      {
        source: "/service/digital-marketing-services.html",
        destination: "/services/digital-marketing",
        permanent: true
      },
      {
        source: "/service/graphic-design-ve",
        destination: "/services/graphic-design-video-editing",
        permanent: true
      },
      {
        source: "/service/graphic-design-ve/",
        destination: "/services/graphic-design-video-editing",
        permanent: true
      },
      {
        source: "/service/graphic-design-ve.html",
        destination: "/services/graphic-design-video-editing",
        permanent: true
      },
      { source: "/payment-success.html", destination: "/thank-you?source=payment", permanent: true },
      { source: "/thank-you.html", destination: "/thank-you?source=lead", permanent: true }
    ];
  }
};

export default nextConfig;
