import * as Icons from "../icons";

type NavItem = {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  url: string;
  items: NavItem[];
};

type NavSection = {
  label: string;
  items: NavItem[];
};

export const NAV_DATA: NavSection[] = [
  {
    label: "ГЛАВНОЕ МЕНЮ",
    items: [
      {
        title: "Дашборд",
        icon: Icons.HomeIcon,
        url: "/admin",
        items: [],
      },
      {
        title: "Календарь",
        icon: Icons.Calendar,
        url: "/admin/calendar",
        items: [],
      },
      {
        title: "Записи",
        icon: Icons.Table,
        url: "/admin/appointments",
        items: [],
      },
      {
        title: "Пациенты",
        icon: Icons.User,
        url: "/admin/patients",
        items: [],
      },
    ],
  },
];
