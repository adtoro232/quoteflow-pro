import { Topbar } from "@/components/layout/topbar";
import { TemplateForm } from "@/components/quotes/TemplateForm";

export default function NewTemplatePage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar />
      <div className="flex-1 overflow-y-auto p-6 max-w-4xl">
        <TemplateForm />
      </div>
    </div>
  );
}
