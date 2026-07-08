"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormError } from "@/components/shared/form-error";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { toast, Toaster } from "@/components/ui/toast";
import { useUnsavedChangesWarning } from "@/lib/hooks/use-unsaved-changes-warning";
import { createBlogPost, updateBlogPost, deleteBlogPost } from "./actions";

type Category = { id: string; name: string };

type PostStatus = "draft" | "published" | "archived";

type EditablePost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  categoryId: string;
  status: PostStatus;
};

function slugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-");
}

const statusOptions: { value: PostStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

export function BlogPostForm({
  categories,
  post,
  dbAvailable,
}: {
  categories: Category[];
  post?: EditablePost;
  dbAvailable: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEdit = post !== undefined;

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(post?.coverImageUrl ?? "");
  const [categoryId, setCategoryId] = useState(post?.categoryId ?? "");
  const [status, setStatus] = useState<PostStatus>(post?.status ?? "draft");
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useUnsavedChangesWarning(dirty && !isPending);

  function markDirty<T>(setter: (v: T) => void) {
    return (value: T) => {
      setter(value);
      setDirty(true);
    };
  }

  function handleTitleChange(value: string) {
    setTitle(value);
    setDirty(true);
    if (!slugTouched) setSlug(slugFromTitle(value));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData();
    fd.set("title", title);
    fd.set("slug", slug);
    fd.set("excerpt", excerpt);
    fd.set("content", content);
    fd.set("coverImageUrl", coverImageUrl);
    fd.set("categoryId", categoryId);
    fd.set("status", status);
    if (isEdit) fd.set("postId", post.id);

    startTransition(async () => {
      const res = isEdit ? await updateBlogPost(fd) : await createBlogPost(fd);
      if (res.success) {
        setDirty(false);
        if (isEdit) {
          toast.success("Post updated.");
          router.refresh();
        } else {
          toast.success("Post created.");
          router.push("/admin/blog");
        }
      } else {
        setError(res.error ?? "Something went wrong.");
      }
    });
  }

  function handleDelete() {
    const fd = new FormData();
    fd.set("postId", post?.id ?? "");
    startTransition(async () => {
      const res = await deleteBlogPost(fd);
      if (res.success) {
        setDirty(false);
        toast.success("Post deleted.");
        router.push("/admin/blog");
      } else {
        toast.error(res.error ?? "Something went wrong.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Toaster />
      <Card>
        <CardContent className="space-y-4 pt-6">
          {error && <FormError message={error} />}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="post-title">Title</Label>
              <Input
                id="post-title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Post title"
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="post-slug">Slug</Label>
              <Input
                id="post-slug"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  markDirty(setSlug)(e.target.value);
                }}
                placeholder="post-url-slug"
                disabled={isPending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="post-excerpt">Excerpt</Label>
            <Textarea
              id="post-excerpt"
              rows={2}
              maxLength={1000}
              autoResize
              value={excerpt}
              onChange={(e) => markDirty(setExcerpt)(e.target.value)}
              placeholder="Short summary shown in post listings..."
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="post-content">Content</Label>
            <Textarea
              id="post-content"
              rows={14}
              maxLength={100000}
              autoResize
              value={content}
              onChange={(e) => markDirty(setContent)(e.target.value)}
              placeholder="Write your post content here..."
              disabled={isPending}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="post-cover">Cover image URL</Label>
              <Input
                id="post-cover"
                value={coverImageUrl}
                onChange={(e) => markDirty(setCoverImageUrl)(e.target.value)}
                placeholder="https://..."
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="post-category">Category</Label>
              <Select
                id="post-category"
                value={categoryId}
                onChange={(e) => markDirty(setCategoryId)(e.target.value)}
                disabled={isPending}
              >
                <option value="">No category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="post-status">Status</Label>
              <Select
                id="post-status"
                value={status}
                onChange={(e) => markDirty(setStatus)(e.target.value as PostStatus)}
                disabled={isPending}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            {isEdit ? (
              <Button
                type="button"
                variant="destructive"
                onClick={() => setConfirmDelete(true)}
                disabled={isPending || !dbAvailable}
              >
                Delete post
              </Button>
            ) : (
              <span />
            )}
            <Button type="submit" disabled={isPending || !dbAvailable || (isEdit && !dirty)}>
              {isPending ? "Saving..." : isEdit ? "Save changes" : "Create post"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete this post?"
        description="The post will be permanently removed. This cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </form>
  );
}
