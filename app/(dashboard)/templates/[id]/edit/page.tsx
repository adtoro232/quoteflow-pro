import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/topbar";
import { TemplateForm } from "@/components/quotes/TemplateForm";
import { notFound } from "next/navigation";
import type { QuoteTemplate } from "@/types";

export default async function EditTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: template } = await supabase
    .from("quote_templates")
    .select("*")
    .eq("id", id)
    .single();

  if (!template) notFound();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar />
      <div className="flex-1 overflow-y-auto p-6 max-w-4xl">
        <TemplateForm template={template as QuoteTemplate} />
      </div>
    </div>
  );
}
