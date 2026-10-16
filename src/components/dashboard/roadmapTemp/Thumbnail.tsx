import React, { useRef, useState } from "react";
import { FiImage, FiLink, FiUpload, FiX } from "react-icons/fi";

const Thumbnail = () => {
  const [showThumbnailModal, setShowThumbnailModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const handleImageUrl = () => {
    if (!imageUrl.trim()) return;

    setThumbnail(imageUrl.trim());
    setImageUrl("");
    setShowThumbnailModal(false);
  };

  const handleLocalImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Optional validation
    if (!file.type.startsWith("image/")) {
      return;
    }

    // For preview only
    const previewUrl = URL.createObjectURL(file);

    setThumbnail(previewUrl);
    setShowThumbnailModal(false);
  };

  return (
    <div>
      <>
        <button
          onClick={() => setShowThumbnailModal(true)}
          className="group relative h-14 w-20 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-white/8 bg-white/5 light:bg-black/5"
        >
          {thumbnail ? (
            <img
              src={thumbnail}
              alt="Roadmap thumbnail"
              className="h-full w-full object-cover"
            />
          ) : (
            <>
              <div className="flex h-full w-full items-center justify-center text-zinc-500 transition-colors group-hover:text-indigo-400">
                <FiImage className="h-5 w-5" />
              </div>

              <div className="absolute inset-x-0 bottom-0 bg-black/50 py-1 text-center text-[9px] tracking-wider text-white/70">
                Thumbnail
              </div>
            </>
          )}
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleLocalImage}
        />

        {/* Thumbnail modal */}
        {showThumbnailModal && (
          <div
            className="fixed inset-0 z-80 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setShowThumbnailModal(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-white/8 bg-[#111113] p-5 shadow-2xl light:border-black/8 light:bg-white"
            >
              {/* Header */}
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-200 light:text-slate-800">
                    Roadmap Thumbnail
                  </h3>

                  <p className="mt-1 text-xs text-zinc-500">
                    Add an image from a URL or your device.
                  </p>
                </div>

                <button
                  onClick={() => setShowThumbnailModal(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/5 hover:text-zinc-300 light:hover:bg-black/5"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>

              {/* URL */}
              <div>
                <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                  Image URL
                </label>

                <div className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/2 px-3 light:border-black/[0.07] light:bg-black/2">
                  <FiLink className="h-4 w-4 shrink-0 text-zinc-600" />

                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleImageUrl();
                      }
                    }}
                    placeholder="https://example.com/image.jpg"
                    className="h-10 w-full bg-transparent text-xs text-zinc-300 outline-none placeholder:text-zinc-700 light:text-slate-700"
                  />

                  <button
                    onClick={handleImageUrl}
                    disabled={!imageUrl.trim()}
                    className="shrink-0 rounded-md bg-indigo-500/10 px-3 py-1.5 text-[11px] font-medium text-indigo-400 transition hover:bg-indigo-500/15 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/6 light:bg-black/6" />
                <span className="text-[10px] uppercase tracking-widest text-zinc-600">
                  or
                </span>
                <div className="h-px flex-1 bg-white/6 light:bg-black/6" />
              </div>

              {/* Upload */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="group flex w-full items-center gap-3 rounded-xl border border-dashed border-white/10 bg-white/2 p-4 text-left transition hover:border-indigo-400/20 hover:bg-indigo-500/3 light:border-black/10 light:bg-black/2"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 transition group-hover:bg-indigo-500/15">
                  <FiUpload className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-xs font-medium text-zinc-300 light:text-slate-700">
                    Upload from your device
                  </p>

                  <p className="mt-1 text-[10px] text-zinc-600">
                    PNG, JPG, WEBP up to 5MB
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default Thumbnail;
