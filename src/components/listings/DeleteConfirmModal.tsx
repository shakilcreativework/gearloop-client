"use client";

interface DeleteConfirmModalProps {
  listingTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}

export default function DeleteConfirmModal({
  listingTitle,
  onConfirm,
  onCancel,
  deleting,
}: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-foreground">
          Delete Listing
        </h3>
        <p className="mt-2 text-sm text-muted">
          Are you sure you want to delete{" "}
          <span className="font-medium text-foreground">
            &ldquo;{listingTitle}&rdquo;
          </span>
          ? This action cannot be undone.
        </p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
