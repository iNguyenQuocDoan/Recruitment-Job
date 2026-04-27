type IconProps = { className?: string };

const baseProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const ArrowRightIcon = ({ className = "" }: IconProps) => (
  <svg {...baseProps} strokeWidth={2.5} className={className}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export const ArrowLeftIcon = ({ className = "" }: IconProps) => (
  <svg {...baseProps} strokeWidth={2.5} className={className}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

export const SearchIcon = ({ className = "" }: IconProps) => (
  <svg {...baseProps} className={className}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const BriefcaseIcon = ({ className = "" }: IconProps) => (
  <svg {...baseProps} className={className}>
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

export const BuildingIcon = ({ className = "" }: IconProps) => (
  <svg {...baseProps} className={className}>
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
  </svg>
);

export const UsersIcon = ({ className = "" }: IconProps) => (
  <svg {...baseProps} className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const ChevronDownIcon = ({ className = "" }: IconProps) => (
  <svg {...baseProps} className={className}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const ChevronLeftIcon = ({ className = "" }: IconProps) => (
  <svg {...baseProps} className={className}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export const ChevronRightIcon = ({ className = "" }: IconProps) => (
  <svg {...baseProps} className={className}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const MapPinIcon = ({ className = "" }: IconProps) => (
  <svg {...baseProps} className={className}>
    <path d="M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const UserTieIcon = ({ className = "" }: IconProps) => (
  <svg {...baseProps} className={className}>
    <circle cx="12" cy="8" r="4" />
    <path d="M20 21v-1a4 4 0 0 0-4-4h-1l-3 5-3-5H8a4 4 0 0 0-4 4v1" />
  </svg>
);

export const MenuIcon = ({ className = "" }: IconProps) => (
  <svg {...baseProps} className={className}>
    <path d="M3 12h18M3 6h18M3 18h18" />
  </svg>
);

export const CloseIcon = ({ className = "" }: IconProps) => (
  <svg {...baseProps} strokeWidth={2.5} className={className}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export const UserIcon = ({ className = "" }: IconProps) => (
  <svg {...baseProps} className={className}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const FileLinesIcon = ({ className = "" }: IconProps) => (
  <svg {...baseProps} className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M16 13H8M16 17H8M10 9H8" />
  </svg>
);

export const LogoutIcon = ({ className = "" }: IconProps) => (
  <svg {...baseProps} className={className}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </svg>
);

export const FacebookIcon = ({ className = "" }: IconProps) => (
  <svg {...baseProps} className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export const LinkedinIcon = ({ className = "" }: IconProps) => (
  <svg {...baseProps} className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const GithubIcon = ({ className = "" }: IconProps) => (
  <svg {...baseProps} className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const SlidersIcon = ({ className = "" }: IconProps) => (
  <svg {...baseProps} className={className}>
    <line x1="4" x2="4" y1="21" y2="14" />
    <line x1="4" x2="4" y1="10" y2="3" />
    <line x1="12" x2="12" y1="21" y2="12" />
    <line x1="12" x2="12" y1="8" y2="3" />
    <line x1="20" x2="20" y1="21" y2="16" />
    <line x1="20" x2="20" y1="12" y2="3" />
    <line x1="2" x2="6" y1="14" y2="14" />
    <line x1="10" x2="14" y1="8" y2="8" />
    <line x1="18" x2="22" y1="16" y2="16" />
  </svg>
);

export const PlusIcon = ({ className = "" }: IconProps) => (
  <svg {...baseProps} strokeWidth={2.5} className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const CheckIcon = ({ className = "" }: IconProps) => (
  <svg {...baseProps} strokeWidth={2.5} className={className}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const EnvelopeIcon = ({ className = "" }: IconProps) => (
  <svg {...baseProps} className={className}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export const PhoneIcon = ({ className = "" }: IconProps) => (
  <svg {...baseProps} className={className}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export const FilePdfIcon = ({ className = "" }: IconProps) => (
  <svg {...baseProps} className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M9 13h1.5a1.5 1.5 0 0 1 0 3H9v-3z" />
    <path d="M9 16v3" />
    <path d="M14 13v6" />
    <path d="M14 13h2M14 16h1.5" />
  </svg>
);

export const ClockIcon = ({ className = "" }: IconProps) => (
  <svg {...baseProps} className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

export const ShareIcon = ({ className = "" }: IconProps) => (
  <svg {...baseProps} className={className}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
    <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
  </svg>
);

export const BookmarkIcon = ({ className = "" }: IconProps) => (
  <svg {...baseProps} className={className}>
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

export const CircleCheckIcon = ({ className = "" }: IconProps) => (
  <svg {...baseProps} className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const TrashIcon = ({ className = "" }: IconProps) => (
  <svg {...baseProps} className={className}>
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);

export const EyeIcon = ({ className = "" }: IconProps) => (
  <svg {...baseProps} className={className}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const PenToSquareIcon = ({ className = "" }: IconProps) => (
  <svg {...baseProps} className={className}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

export const BoxOpenIcon = ({ className = "" }: IconProps) => (
  <svg {...baseProps} className={className}>
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);
