import { createFileRoute } from "@tanstack/react-router";
import { Smartphone } from "lucide-react";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/install")({ component: InstallPage });

function InstallPage() {
  const { t } = useI18n();
  return (
    <div className="px-4 pt-5 pb-8">
      <div className="mb-4 grid size-12 place-items-center rounded-xl bg-navy text-paper">
        <Smartphone className="size-6" />
      </div>
      <h1 className="text-[1.35rem] font-semibold text-navy">{t("installTitle")}</h1>
      <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">{t("installLead")}</p>

      <section className="mt-6 rounded-xl border border-line bg-card p-4">
        <h2 className="font-semibold text-navy">iPhone / iPad</h2>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-[0.9rem] leading-relaxed">
          <li>{t("installIos1")}</li>
          <li>{t("installIos2")}</li>
          <li>{t("installIos3")}</li>
          <li>{t("installIos4")}</li>
        </ol>
      </section>

      <section className="mt-3 rounded-xl border border-line bg-card p-4">
        <h2 className="font-semibold text-navy">Android</h2>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-[0.9rem] leading-relaxed">
          <li>{t("installAnd1")}</li>
          <li>{t("installAnd2")}</li>
          <li>{t("installAnd3")}</li>
          <li>{t("installAnd4")}</li>
        </ol>
      </section>

      <p className="mt-5 text-[0.8rem] leading-relaxed text-faint">{t("installFoot")}</p>
    </div>
  );
}
