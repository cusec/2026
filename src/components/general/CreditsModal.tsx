"use client";

import React from "react";
import Modal from "@/components/ui/modal";
import { ExternalLink } from "lucide-react";

interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreditsModal: React.FC<CreditsModalProps> = ({ isOpen, onClose }) => {
  const team = [
    { name: "Shrey Bhatt", role: "Development", url: "" },
    { name: "Angel Shinh", role: "UI/UX", url: "" },
  ];

  const designResources = [
    {
      name: "Ocean Wave Animation",
      url: "https://www.figma.com/community/file/1234567890/ocean-waves",
      description: "Animated wave effects and ocean surface designs",
    },
    {
      name: "Glassmorphism UI Kit",
      url: "https://www.figma.com/community/file/0987654321/glassmorphism",
      description: "Glass card components and blur effects",
    },
    {
      name: "Particle System",
      url: "https://www.figma.com/community/file/1122334455/particle-system",
      description: "Interactive particle animations and effects",
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Credits"
      className="max-w-[80vw] md:max-w-lg bg-dark-mode/80 text-light-mode p-6 rounded-2xl"
    >
      <div className="space-y-6 font-jost">
        {/* Team Section */}
        <div>
          <h3 className="text-lg font-semibold  mb-3">Development Team</h3>
          <ul className="space-y-2 ">
            {team.map((member) => (
              <li key={member.name} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2"></span>
                <div>
                  <a
                    href={member.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium transition-colors inline-flex items-center gap-1"
                  >
                    {member.name} (
                    <span className="opacity-60">{member.role}</span>)
                    <ExternalLink size={14} className="opacity-60" />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Design Resources Section */}
        <div>
          <h3 className="text-lg font-semibold  mb-3">Design Resources</h3>
          <ul className="space-y-2 ">
            {designResources.map((resource) => (
              <li key={resource.name} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2"></span>
                <div>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium  transition-colors inline-flex items-center gap-1"
                  >
                    {resource.name}
                    <ExternalLink size={14} className="opacity-60" />
                  </a>
                  <p className="text-sm  mt-0.5">{resource.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default CreditsModal;
