import AdminCalendarClient from "../AdminCalendarClient";
import { getAdminContext } from "../getAdminContext";

export default async function AdminCalendarPage() {
  const { appointments } = await getAdminContext();

  return <AdminCalendarClient initialAppointments={appointments} />;
}
