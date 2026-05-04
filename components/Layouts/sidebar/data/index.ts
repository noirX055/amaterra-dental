import * as Icons from "../icons";

export const NAV_DATA = [
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
