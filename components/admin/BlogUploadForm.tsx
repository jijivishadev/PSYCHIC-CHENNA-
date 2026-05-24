"use client";

import { useEffect, useState } from "react";
import { UploadCloud, X, PlusCircle, MinusCircle } from "lucide-react";
import RichTextEditor from "./RichTextEditor";

// ✅ Type export – correct way
export type BlogUploadFormValues = {
  title: string;
  shortDescription: string;
  imageUrl: string;
  imageFile: File | null;
  keywords: string[];
  author: string;
  readTime: string;
  richContent: string;
};

type BlogUploadFormProps = {
  onSubmit: (values: BlogUploadFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  uploadProgress?: number | null;
  initialValues?: Partial<BlogUploadFormValues>;
  submitLabel?: string;
};

export default function BlogUploadForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
  uploadProgress = null,
  initialValues,
  submitLabel,
}: BlogUploadFormProps) {
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [author, setAuthor] = useState("Jothi Ramesh");
  const [readTime, setReadTime] = useState("");
  const [richContent, setRichContent] = useState("<p>Start writing your blog post here...</p>");
  const [localError, setLocalError] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (!initialValues) return;
    setTitle(initialValues.title ?? "");
    setShortDescription(initialValues.shortDescription ?? "");
    setImageUrl(initialValues.imageUrl ?? "");
    setImageFile(null);
    setKeywords(initialValues.keywords?.slice(0, 3) ?? []);
    setAuthor(initialValues.author ?? "Jothi Ramesh");
    setReadTime(initialValues.readTime ?? "");
    setRichContent(initialValues.richContent ?? "<p>Start writing your blog post here...</p>");
    setKeywordInput("");
  }, [initialValues]);

  const handleImageFileChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const addKeyword = () => {
    const nextKeyword = keywordInput.trim();
    if (!nextKeyword) {
      setLocalError("Enter a keyword before adding it.");
      return;
    }
    if (keywords.length >= 3) {
      setLocalError("You can add a maximum of 3 keywords/tags.");
      return;
    }
    if (keywords.some((k) => k.toLowerCase() === nextKeyword.toLowerCase())) {
      setLocalError("That keyword is already added.");
      return;
    }
    setKeywords((prev) => [...prev, nextKeyword]);
    setKeywordInput("");
    setLocalError("");
  };

  const removeKeyword = (keyword: string) => {
    setKeywords((prev) => prev.filter((k) => k !== keyword));
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError("");

    if (!title.trim()) {
      setLocalError("Title is required.");
      return;
    }
    if (!shortDescription.trim()) {
      setLocalError("Short description is required.");
      return;
    }
    if (!richContent.trim() || richContent === "<p><br></p>") {
      setLocalError("Blog content cannot be empty.");
      return;
    }

    await onSubmit({
      title: title.trim(),
      shortDescription: shortDescription.trim(),
      imageUrl: imageUrl.trim(),
      imageFile,
      keywords: keywords.slice(0, 3),
      author: author.trim(),
      readTime: readTime.trim(),
      richContent: richContent.trim(),
    });
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-[#1A0B2E]">
          {submitLabel === "Update Post" ? "Edit Blog Post" : "Create New Blog Post"}
        </h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-base font-medium text-[#1A0B2E]">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-[#4B2E83]/20 px-4 py-3 text-base text-[#1A0B2E] outline-none focus:ring-2 focus:ring-[#4B2E83]/30"
            placeholder="Enter blog post title"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-base font-medium text-[#1A0B2E]">Short Description</label>
          <textarea
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-lg border border-[#4B2E83]/20 px-4 py-3 text-base text-[#1A0B2E] outline-none focus:ring-2 focus:ring-[#4B2E83]/30"
            placeholder="Enter a short intro used on blog cards"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-2 text-base font-medium text-[#1A0B2E]">
            <UploadCloud className="h-5 w-5 text-[#D4AF37]" />
            <span>Upload Blog Image</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageFileChange(e.target.files?.[0] ?? null)}
            className="w-full rounded-lg border border-[#4B2E83]/20 px-4 py-3 text-base text-[#1A0B2E]"
          />
          <p className="mt-1 text-sm text-[#1A0B2E]/65">Select a file – it will upload to Firebase Storage.</p>
          {(previewImage || imageUrl) && (
            <div className="mt-2">
              <img src={previewImage || imageUrl} alt="Preview" className="h-20 w-20 object-cover rounded-lg" />
            </div>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-base font-medium text-[#1A0B2E]">Fallback Image URL</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full rounded-lg border border-[#4B2E83]/20 px-4 py-3 text-base text-[#1A0B2E] outline-none focus:ring-2 focus:ring-[#4B2E83]/30"
            placeholder="https://example.com/blog-image.jpg"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-base font-medium text-[#1A0B2E]">Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full rounded-lg border border-[#4B2E83]/20 px-4 py-3 text-base text-[#1A0B2E] outline-none focus:ring-2 focus:ring-[#4B2E83]/30"
            placeholder="Author name"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-base font-medium text-[#1A0B2E]">Read Time</label>
          <input
            type="text"
            value={readTime}
            onChange={(e) => setReadTime(e.target.value)}
            className="w-full rounded-lg border border-[#4B2E83]/20 px-4 py-3 text-base text-[#1A0B2E] outline-none focus:ring-2 focus:ring-[#4B2E83]/30"
            placeholder="e.g. 8 min read"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-base font-medium text-[#1A0B2E]">Keywords / Tags (max 3)</label>
          <div className="space-y-3 rounded-lg border border-[#4B2E83]/20 bg-white p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                className="flex-1 rounded-lg border border-[#4B2E83]/20 px-4 py-3 text-base text-[#1A0B2E] outline-none focus:ring-2 focus:ring-[#4B2E83]/30"
                placeholder="Type a keyword and click +"
              />
              <button
                type="button"
                onClick={addKeyword}
                className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-3 text-base font-semibold text-[#1A0B2E]"
              >
                <PlusCircle className="h-5 w-5" />
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {keywords.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-[#4B2E83] px-3 py-1.5 text-sm font-semibold text-[#F3ECFF]"
                >
                  {kw}
                  <button
                    type="button"
                    onClick={() => removeKeyword(kw)}
                    className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-[#1A0B2E]/65">
              <span>{keywords.length}/3 added</span>
              {keywords.length > 0 && (
                <button type="button" onClick={() => setKeywords([])} className="inline-flex items-center gap-1 font-semibold text-[#4B2E83]">
                  <MinusCircle className="h-4 w-4" />
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <RichTextEditor
        value={richContent}
        onChange={setRichContent}
        placeholder="Start writing your blog post here..."
      />

      {uploadProgress !== null && (
        <div className="rounded-lg border border-[#D4AF37]/50 bg-[#D4AF37]/12 px-3 py-2 text-sm text-[#4B2E83]">
          Uploading image: {uploadProgress}%
        </div>
      )}

      {localError && <p className="text-sm text-red-600">{localError}</p>}

      <div className="flex flex-wrap gap-3 pt-1">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-[#D4AF37] px-7 py-3 text-base font-semibold text-[#1A0B2E] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : submitLabel ?? "Create Post"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-[#4B2E83]/25 px-7 py-3 text-base font-semibold text-[#4B2E83]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}