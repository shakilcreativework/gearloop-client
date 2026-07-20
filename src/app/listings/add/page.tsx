import type { Metadata } from "next";
import AddGearForm from "@/components/listings/AddGearForm";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export const metadata: Metadata = {
  title: "Add Gear — GearLoop",
  description: "List your outdoor gear for rent on GearLoop.",
};

export default function AddGearPage() {
  return (
    <ProtectedRoute>
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
          Add Gear
        </h1>
        <p className="mb-8 text-sm text-muted">
          List your outdoor gear so others can rent it. Fill in the details
          below.
        </p>
        <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
          <AddGearForm />
        </div>
      </div>
    </ProtectedRoute>
  );
}
