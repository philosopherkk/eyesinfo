import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { QrLattice } from "@/components/qr-lattice";
import { EditorialFooter } from "@/components/editorial-footer";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/qr")({ component: QrPage });

function QrPage() {
  const { t } = useI18n();
  return (
    <div className="pb-8">
      <div className="flex items-center gap-1 px-2 pt-3">
        <Link
          to="/tools"
          className="grid size-10 place-items-center rounded-md text-navy no-underline"
          aria-label={t("backTools")}
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-[1.2rem] font-semibold text-navy">Lattice</h1>
          <p className="text-[0.75rem] text-steel">{t("qrSub")}</p>
        </div>
      </div>
      <p className="px-4 pt-3 text-[0.88rem] leading-relaxed text-muted">{t("qrLead")}</p>
      <div className="px-4 pt-4">
        <QrLattice />
        <p className="mt-4 text-[0.78rem] leading-relaxed text-muted">{t("qrFoot")}</p>
        <EditorialFooter />
      </div>
    </div>
  );
}
