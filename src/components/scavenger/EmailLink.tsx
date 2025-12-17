"use client";

import { useState } from "react";
import { Auth0User, DbUser } from "@/lib/interface";
import Modal from "@/components/ui/modal";

interface EmailLinkProps {
  user: Auth0User;
  dbUser: DbUser;
  onEmailLinked?: (email: string) => void;
}

const EmailLink = ({ user, dbUser, onEmailLinked }: EmailLinkProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkedEmail, setLinkedEmail] = useState<string | null>(
    dbUser.linked_email || null
  );
  const [showConfirmation, setShowConfirmation] = useState(false);
  const handleSubmitClick = () => {
    if (!email.trim()) {
      setError("Please enter an email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError(null);
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    setShowConfirmation(false);
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/users/link-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ linked_email: email }),
      });

      const data = await response.json();

      if (data.success) {
        setLinkedEmail(data.linked_email);
        setEmail("");
        if (onEmailLinked) {
          onEmailLinked(data.linked_email);
        }
      } else {
        setError(data.message || data.error || "Failed to link email");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Error linking email:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="w-full overflow-x-hidden text-dark-mode bg-light-mode/40 p-3 rounded-lg border border-light-mode">
      <div className="flex flex-wrap gap-2 items-center justify-center text-center font-semibold">
        {linkedEmail ? (
          <>{linkedEmail} (Linked) </>
        ) : (
          <>
            Linked Email:{" "}
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              placeholder="Enter your email"
              className="border-b w-fit border-light-mode bg-transparent outline-none"
              disabled={isSubmitting}
            />
            <button
              onClick={handleSubmitClick}
              disabled={isSubmitting}
              className="p-2 bg-sunset rounded-lg border border-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {/* Confirmation Dialog */}
      <Modal
        isOpen={showConfirmation}
        onClose={handleCancel}
        title="Confirm Email Link"
        className="max-w-md text-light-mode bg-dark-mode/70"
      >
        <p className=" mb-4">
          Are you sure you want to link email &quot;{email}&quot; (Must be
          associated with your ticket) to your current account email &quot;
          {user.email}&quot;? Your display name will be {dbUser.name} (This can
          be changed by contacting the Tech team).
        </p>
        <p className=" text-sm mb-6">
          This action cannot be undone. You will need to contact the Tech team
          to change your linked email.
        </p>
        <div className="flex gap-3 justify-end">
          <button onClick={handleCancel} className="px-4 py-2 rounded-lg">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-sunset rounded-lg border border-accent hover:opacity-90"
          >
            Confirm
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default EmailLink;
