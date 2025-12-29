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
    {
      name: "Shrey Bhatt",
      role: "Development",
      url: "https://www.linkedin.com/in/shreybhatt13",
    },
    {
      name: "Angel Shinh",
      role: "UI/UX",
      url: "https://www.linkedin.com/in/angelshinh/",
    },
  ];

  const designResources = [
    {
      name: "Lighthouse",
      url: "https://www.figma.com/community/file/1473355883713295438/lighthouse",
      description: (
        <>
          Original Figma design by Alex Vlad, licensed under{" "}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-400 transition-colors"
          >
            CC BY 4.0
          </a>
          . Modified by Shrey Bhatt.
        </>
      ),
    },
    {
      name: "Sea-Boat",
      url: "https://www.figma.com/community/file/1211292687455081345/sea-boat",
      description: (
        <>
          Original Figma design by Designstuff, licensed under{" "}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-400 transition-colors"
          >
            CC BY 4.0
          </a>
          . Modified by Shrey Bhatt.
        </>
      ),
    },
    {
      name: "Koi fish",
      url: "https://www.figma.com/community/file/1538538996849357125/kio-fish-illustration-figma-brush-community",
      description: (
        <>
          Original Figma design by Satya Ranjan Swain, licensed under{" "}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-400 transition-colors"
          >
            CC BY 4.0
          </a>
          . Modified by Shrey Bhatt.
        </>
      ),
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Credits"
      className="max-w-[80vw] md:max-w-lg bg-dark-mode/70 text-light-mode rounded-2xl"
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
          <h3 className="text-lg font-semibold  mb-3">External Resources</h3>
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
                  <p className="text-xs  mt-0.5">{resource.description}</p>
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
