import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Sign Up — GearLoop",
  description:
    "Create a GearLoop account to start renting or listing outdoor gear.",
};

export default function RegisterPage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Create an account
          </h1>
          <p className="mt-1 text-sm text-muted">
            Join GearLoop to rent or list outdoor gear
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <RegisterForm />
        </div>
      </div>
    </section>
  );
}
