import { FinalCta } from "@/components/sections/FinalCta";

export function ServiceCta({ title }: { title: string }) {
  return (
    <FinalCta
      description={`Get a scoped recommendation for ${title.toLowerCase()}, the right execution path, and the support model that fits your current stage.`}
      title={`Need ${title.toLowerCase()} support that feels premium, fast, and founder-aware?`}
    />
  );
}
