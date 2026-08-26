import { Container } from "@/components/shared/Container";

const brands = ["Next.js", "Shopify", "WooCommerce", "HubSpot", "Amazon", "Meta Ads", "Zapier", "Razorpay"];

export function LogoCloud() {
  return (
    <section className="section-space-tight">
      <Container className="section-stack-tight">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.24em] text-muted">
          Built across platforms founders already use
        </p>
        <div className="content-grid mx-auto w-full max-w-[1120px] sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
          {brands.map((brand) => (
            <div
              key={brand}
              className="interactive-surface flex min-h-[72px] items-center justify-center rounded-[20px] border border-white/8 bg-white/[0.03] px-4 text-center text-sm font-semibold text-foreground/90"
            >
              {brand}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
