"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  label: string;
  multiple?: boolean;
  initialUrls?: string[];
  onChange: (urls: string[]) => void;
};

/**
 * Uploads directly to the `products` storage bucket from the browser.
 * Storage RLS policies restrict writes to the admin session, so this is
 * safe to expose here — an unauthenticated visitor's upload attempt would
 * be rejected by Supabase itself, not just hidden by the UI.
 */
export default function ImageUploader({
  label,
  multiple = false,
  initialUrls = [],
  onChange,
}: Props) {
  const [urls, setUrls] = useState<string[]>(initialUrls);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);

    const supabase = createClient();
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        setError(uploadError.message);
        continue;
      }

      const { data } = supabase.storage.from("products").getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }

    const next = multiple ? [...urls, ...uploaded] : uploaded;
    setUrls(next);
    onChange(next);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeAt = (i: number) => {
    const next = urls.filter((_, idx) => idx !== i);
    setUrls(next);
    onChange(next);
  };

  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-widest2 text-charcoal/50">
        {label}
      </label>

      {urls.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-3">
          {urls.map((url, i) => (
            <div key={url} className="group relative h-20 w-20 overflow-hidden rounded-lg border border-charcoal/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute inset-0 flex items-center justify-center bg-charcoal/60 text-xs text-ivory opacity-0 transition-opacity group-hover:opacity-100"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed px-5 py-6 text-center transition-colors ${
          dragActive
            ? "border-gold bg-gold/10"
            : "border-charcoal/15 bg-white/40 hover:border-gold/60"
        }`}
      >
        <p className="text-sm text-charcoal/60">
          Drag & drop {multiple ? "images" : "an image"} here, or{" "}
          <span className="text-gold-dark underline">browse</span>
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          disabled={uploading}
          className="hidden"
        />
      </div>
      {uploading && (
        <p className="mt-1.5 text-xs text-charcoal/50">Uploading…</p>
      )}
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
