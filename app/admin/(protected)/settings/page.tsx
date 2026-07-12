import { getSettings } from "@/lib/database";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 className="font-display text-3xl font-light text-charcoal">Settings</h1>
      <p className="mt-1 text-sm text-charcoal/50">
        Business info shown across the storefront and used for WhatsApp orders.
      </p>

      <div className="mt-8 rounded-2xl border border-charcoal/10 bg-white/50 p-6 md:p-8">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
