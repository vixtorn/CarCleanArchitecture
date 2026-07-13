type IconName =
  | "car" | "plus" | "tag" | "gauge" | "calendar" | "filter" | "eye"
  | "edit" | "trash" | "close" | "search" | "doors" | "info" | "check";

interface IconProps {
  name: IconName;
  size?: number;
}

const paths: Record<IconName, React.ReactNode> = {
  car: <><path d="m5 17-1 2v1h2l1-2h10l1 2h2v-1l-1-2"/><path d="M5 17h14v-5l-2-5H7l-2 5v5Z"/><path d="M7 12h10M7.5 15h.01M16.5 15h.01"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  tag: <><path d="M20 13 13 20l-9-9V4h7l9 9Z"/><path d="M8.5 8.5h.01"/></>,
  gauge: <><path d="M4 15a8 8 0 1 1 16 0"/><path d="m12 15 4-5M8 19h8"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01"/></>,
  filter: <path d="M4 5h16M7 12h10M10 19h4"/>,
  eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></>,
  edit: <><path d="m4 20 4.5-1 10-10-3.5-3.5-10 10L4 20Z"/><path d="m13.5 7 3.5 3.5"/></>,
  trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/></>,
  close: <path d="m6 6 12 12M18 6 6 18"/>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  doors: <><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/><path d="M4 21h16M14 12h.01"/></>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
};

export default function Icon({ name, size = 20 }: IconProps) {
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
