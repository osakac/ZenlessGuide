import type { ReactNode } from "react";

type GuideSectionProps = {
  title: string;
  children: ReactNode;
};

export function GuideSection({ title, children }: GuideSectionProps) {
  return (
    <section className="rounded-xl border bg-card p-5">
      <h2 className="mb-4 text-lg font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}
