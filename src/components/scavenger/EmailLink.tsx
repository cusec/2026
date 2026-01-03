"use client";

import { useState } from "react";
import { Auth0User, DbUser } from "@/lib/interface";
import Modal from "@/components/ui/modal";

// Helper to sanitize input (basic XSS prevention)
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>"'`]/g, "") // Remove angle brackets and quotes
    .replace(/[\\]/g, "") // Remove backslashes
    .replace(/\s{2,}/g, " ") // Collapse multiple spaces
    .trim();
}

interface EmailLinkProps {
  user: Auth0User;
  dbUser: DbUser;
  onEmailLinked?: (email: string) => void;
}

const EmailLink = ({ user, dbUser, onEmailLinked }: EmailLinkProps) => {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState(
    sanitizeInput(dbUser.name || "")
  );
  const [discordHandle, setDiscordHandle] = useState(
    sanitizeInput(dbUser.discord_handle || "")
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkedEmail, setLinkedEmail] = useState<string | undefined>(
    dbUser.linked_email || undefined
  );
  const [showConfirmation, setShowConfirmation] = useState(false);
  const handleSubmitClick = () => {
    const sanitizedEmail = sanitizeInput(email);
    if (!sanitizedEmail) {
      setError("Please enter an email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    setError(null);
    setEmail(sanitizedEmail);
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    setShowConfirmation(false);
    setIsSubmitting(true);
    setError(null);

    try {
      const sanitizedEmail = sanitizeInput(email);
      const sanitizedDisplayName = sanitizeInput(displayName);
      const sanitizedDiscordHandle = sanitizeInput(discordHandle);
      const response = await fetch("/api/users/link-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          linked_email: sanitizedEmail,
          name: sanitizedDisplayName,
          discord_handle: sanitizedDiscordHandle,
        }),
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

  if (linkedEmail) {
    return null;
  }

  return (
    <div className="w-full overflow-x-hidden text-light-mode">
      <div className="relative z-10 flex flex-col justify-center items-center">
        <div className="flex flex-wrap gap-1 items-center justify-center md:justify-between text-center font-semibold">
          <div>
            <label htmlFor="linkedEmail">Ticket Email:</label>{" "}
            <input
              id="linkedEmail"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(sanitizeInput(e.target.value));
                setError(null);
              }}
              placeholder="Email Linked to Ticket"
              className="text-light-mode! bg-transparent outline-none"
              style={{ width: `16ch` }}
              disabled={isSubmitting}
            />
          </div>
          <button
            onClick={handleSubmitClick}
            disabled={isSubmitting}
            className="border-b cursor-pointer border-light-mode disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {/* Confirmation Dialog */}
      <Modal
        isOpen={showConfirmation}
        onClose={handleCancel}
        title="Confirm Email Link"
        className="max-w-md text-light-mode bg-dark-mode"
      >
        <p className="mb-4">
          Are you sure you want to link email{" "}
          <span className="text-red-400 font-semibold">
            &quot;{email}&quot;
          </span>{" "}
          (Must be associated with your ticket) to your current account email{" "}
          <span className="text-red-400 font-semibold">
            &quot;{user.email}&quot;
          </span>
          ?
        </p>
        <div className="mb-4">
          <label htmlFor="discordHandle" className="block mb-2">
            Discord Handle:{" "}
            <span className="text-light-mode/50 text-sm">(optional)</span>
          </label>
          <input
            id="discordHandle"
            type="text"
            value={discordHandle}
            onChange={(e) => setDiscordHandle(sanitizeInput(e.target.value))}
            placeholder="@discordHandle"
            className="w-full px-3 py-2 bg-light-mode/10 border border-light-mode/30 rounded-lg text-light-mode outline-none focus:border-accent"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="displayName" className="block mb-2">
            Display Name:
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(sanitizeInput(e.target.value))}
            placeholder="Enter your display name"
            className="w-full px-3 py-2 bg-light-mode/10 border border-light-mode/30 rounded-lg text-light-mode outline-none focus:border-accent"
          />
        </div>
        <p className="text-sm mb-2 text-light-mode/80">
          Must comply with the CUSEC Code of Conduct, or else...
        </p>
        <p className="text-sm mb-2 text-light-mode/80">
          If you wish to update your name after this moment, you will have to
          contact us through the support channel to have it be changed.
        </p>
        <p className="text-sm mb-6 text-light-mode/80">
          We recommend selecting something short and simple that can be
          displayed on a leaderboard.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            className="px-4 py-2 cursor-pointer rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!displayName.trim()}
            className="px-4 py-2 cursor-pointer bg-sunset rounded-lg border border-accent hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default EmailLink;
