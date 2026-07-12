import { requireAdmin } from "@/lib/auth";
import ProfileForm from "@/components/admin/ProfileForm";

export default async function AdminProfilePage() {
  const { admin } = await requireAdmin();

  return (
    <div>
      <h1 className="font-display text-3xl font-light text-charcoal">Profile</h1>
      <p className="mt-1 text-sm text-charcoal/50">{admin.email}</p>

      <div className="mt-8 max-w-sm rounded-2xl border border-charcoal/10 bg-white/50 p-6 md:p-8">
        <p className="eyebrow mb-4 text-charcoal/40">Change Password</p>
        <ProfileForm />
      </div>
    </div>
  );
}
