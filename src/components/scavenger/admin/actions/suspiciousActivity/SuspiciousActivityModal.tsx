"use client";

import Modal from "@/components/ui/modal";
import SuspiciousActivityMonitor from "./SuspiciousActivityMonitor";

interface SuspiciousActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuspiciousActivityModal = ({
  isOpen,
  onClose,
}: SuspiciousActivityModalProps) => {
  return (
    <Modal
      simple={true}
      isOpen={isOpen}
      onClose={onClose}
      title="Suspicious Activity Monitor"
      className="max-w-4xl text-dark-mode"
    >
      <SuspiciousActivityMonitor isVisible={isOpen} />
    </Modal>
  );
};

export default SuspiciousActivityModal;
