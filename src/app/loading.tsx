import { Container } from "@/components/shared/Container";

export default function Loading() {
  return (
    <Container className="py-24">
      <div className="grid gap-6">
        <div className="h-10 w-56 animate-pulse rounded-2xl bg-white/10" />
        <div className="h-72 animate-pulse rounded-[32px] bg-white/5" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-40 animate-pulse rounded-[24px] bg-white/5" />
          ))}
        </div>
      </div>
    </Container>
  );
}
