export interface NavItem {
  href: string;
  label: string;
  icon: (active: boolean) => string;
}

const base = "h-5 w-5";

const stroke = (active: boolean) =>
  active
    ? "h-5 w-5 text-primary stroke-current"
    : "h-5 w-5 stroke-current";

function svg(content: string, active: boolean, fill = false) {
  return `<svg class="${fill ? base + " fill-current" : stroke(active)}" viewBox="0 0 24 24" fill="${fill ? "currentColor" : "none"}" stroke-width="${fill ? 0 : 1.8}" stroke-linecap="round" stroke-linejoin="round">${content}</svg>`;
}

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (a) => svg('<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>', a),
  },
  {
    href: "/learn",
    label: "Learn",
    icon: (a) => svg('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>', a),
  },
  {
    href: "/practice",
    label: "Practice",
    icon: (a) => svg('<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.4 1 2.3h6c0-.9.4-1.8 1-2.3A7 7 0 0 0 12 2z"/>', a),
  },
  {
    href: "/pyq",
    label: "PYQs",
    icon: (a) => svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h5"/>', a),
  },
  {
    href: "/tests",
    label: "Tests",
    icon: (a) => svg('<path d="M12 2 L2 7 l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>', a),
  },
  {
    href: "/revision",
    label: "Revision",
    icon: (a) => svg('<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>', a),
  },
  {
    href: "/planner",
    label: "Planner",
    icon: (a) => svg('<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/>', a),
  },
  {
    href: "/analytics",
    label: "Analytics",
    icon: (a) => svg('<path d="M3 3v18h18"/><path d="M7 14l4-5 4 3 5-6"/>', a),
  },
  {
    href: "/report",
    label: "Weekly Report",
    icon: (a) => svg('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v5M15 3v5M9 14h6m-6 4h4"/>', a),
  },
  {
    href: "/resources",
    label: "Resources",
    icon: (a) => svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>', a),
  },
  {
    href: "/profile",
    label: "Profile",
    icon: (a) => svg('<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>', a),
  },
];

export const MOBILE_NAV: NavItem[] = [
  NAV_ITEMS[0], // Dashboard
  NAV_ITEMS[1], // Learn
  NAV_ITEMS[2], // Practice
  NAV_ITEMS[7], // Analytics
  {
    href: "/more",
    label: "More",
    icon: (a) => svg('<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>', a),
  },
];

export const MORE_NAV_ITEMS: NavItem[] = [
  NAV_ITEMS[3], // PYQs
  NAV_ITEMS[4], // Tests
  NAV_ITEMS[5], // Revision
  NAV_ITEMS[6], // Planner
  NAV_ITEMS[7], // Analytics
  NAV_ITEMS[8], // Weekly Report
  NAV_ITEMS[9], // Resources
  NAV_ITEMS[10], // Profile
  {
    href: "/quick",
    label: "Quick mode",
    icon: (a) => svg('<path d="M13 2 4.09 12.44A1 1 0 0 0 5 14h7l-1 8 8.91-10.44A1 1 0 0 0 19 10h-7l1-8z"/>', a),
  },
  {
    href: "/rc-lab",
    label: "RC Lab",
    icon: (a) => svg('<path d="M12 6.25c.6-1.1 1.9-1.75 3.3-1.75 1.8 0 3.2 1.1 3.2 3.2 0 3-2.2 4.9-4.2 6.3-1.2.85-2.1 2.05-2.3 3.5h-2c-.2-1.45-1.1-2.65-2.3-3.5-2-1.4-4.2-3.3-4.2-6.3 0-2.1 1.4-3.2 3.2-3.2 1.4 0 2.7.65 3.3 1.75z"/>', a),
  },
  {
    href: "/reading",
    label: "Reading",
    icon: (a) => svg('<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>', a),
  },
  {
    href: "/time-pressure",
    label: "Time Pressure",
    icon: (a) => svg('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>', a),
  },
  {
    href: "/challenge",
    label: "Daily Challenge",
    icon: (a) => svg('<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>', a),
  },
  {
    href: "/mistakes",
    label: "Mistake Book",
    icon: (a) => svg('<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>', a),
  },
  {
    href: "/notes",
    label: "Notes",
    icon: (a) => svg('<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/>', a),
  },
  {
    href: "/formulas",
    label: "Formula Sheet",
    icon: (a) => svg('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M8 7h3m-3 4h6m-6 4h4"/>', a),
  },
  {
    href: "/videos",
    label: "Videos",
    icon: (a) => svg('<path d="m10 8 6 4-6 4V8z"/><circle cx="12" cy="12" r="10"/>', a),
  },
  {
    href: "/bookmarks",
    label: "Bookmarks",
    icon: (a) => svg('<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>', a),
  },
  {
    href: "/search",
    label: "Search",
    icon: (a) => svg('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>', a),
  },
  {
    href: "/settings",
    label: "Settings",
    icon: (a) => svg('<circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M4.9 4.9l2.1 2.1m10 10 2.1 2.1m0-14.2-2.1 2.1m-10 10-2.1 2.1"/>', a),
  },
];