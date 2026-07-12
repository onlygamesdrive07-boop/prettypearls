"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateSettings, type ActionState } from "@/lib/actions";
import ImageUploader from "./ImageUploader";
import { useState } from "react";
import type { Settings } from "@/lib/database";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-charcoal px-8 py-3.5 text-sm tracking-wide text-ivory transition-colors duration-300 hover:bg-gold-dark disabled:opacity-50"
    >
      {pending ? "Saving…" : "Save Settings"}
    </button>
  );
}

export default function SettingsForm({ settings }: { settings: Settings }) {
  const [state, formAction] = useFormState<ActionState, FormData>(updateSettings, {
    error: null,
  });
  const [logo, setLogo] = useState<string[]>(settings.logo ? [settings.logo] : []);
  const [favicon, setFavicon] = useState<string[]>(settings.favicon ? [settings.favicon] : []);

  return (
    <form action={formAction} className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-charcoal/50">
            Business name
          </label>
          <input
            name="business_name"
            defaultValue={settings.business_name}
            className="w-full rounded-lg border border-charcoal/15 bg-white/60 px-4 py-3 text-sm focus:border-gold focus:outline-none"
          />
        </div>

        <ImageUploader label="Logo" initialUrls={logo} onChange={setLogo} />
        <ImageUploader label="Favicon" initialUrls={favicon} onChange={setFavicon} />
        <input type="hidden" name="logo" value={logo[0] ?? ""} />
        <input type="hidden" name="favicon" value={favicon[0] ?? ""} />

        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-charcoal/50">
            Footer text
          </label>
          <textarea
            name="footer_text"
            rows={3}
            defaultValue={settings.footer_text}
            className="w-full resize-none rounded-lg border border-charcoal/15 bg-white/60 px-4 py-3 text-sm focus:border-gold focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-charcoal/50">
            WhatsApp number <span className="normal-case text-charcoal/30">(with country code)</span>
          </label>
          <input
            name="whatsapp"
            defaultValue={settings.whatsapp}
            placeholder="15551234567"
            className="w-full rounded-lg border border-charcoal/15 bg-white/60 px-4 py-3 text-sm focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-charcoal/50">
            Instagram URL
          </label>
          <input
            name="instagram"
            defaultValue={settings.instagram}
            className="w-full rounded-lg border border-charcoal/15 bg-white/60 px-4 py-3 text-sm focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-charcoal/50">
            Facebook URL
          </label>
          <input
            name="facebook"
            defaultValue={settings.facebook}
            className="w-full rounded-lg border border-charcoal/15 bg-white/60 px-4 py-3 text-sm focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-charcoal/50">
            Contact email
          </label>
          <input
            name="email"
            type="email"
            defaultValue={settings.email}
            className="w-full rounded-lg border border-charcoal/15 bg-white/60 px-4 py-3 text-sm focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-charcoal/50">
            Business address
          </label>
          <input
            name="address"
            defaultValue={settings.address}
            className="w-full rounded-lg border border-charcoal/15 bg-white/60 px-4 py-3 text-sm focus:border-gold focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-charcoal/50">
              Currency
            </label>
            <input
              name="currency"
              defaultValue={settings.currency}
              className="w-full rounded-lg border border-charcoal/15 bg-white/60 px-4 py-3 text-sm focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-charcoal/50">
              Shipping charge
            </label>
            <input
              name="shipping_charge"
              type="number"
              step="0.01"
              min="0"
              defaultValue={settings.shipping_charge}
              className="w-full rounded-lg border border-charcoal/15 bg-white/60 px-4 py-3 text-sm focus:border-gold focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="md:col-span-2">
        {state.error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </p>
        )}
        {state.success && (
          <p className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            {state.success}
          </p>
        )}
        <SaveButton />
      </div>
    </form>
  );
}
