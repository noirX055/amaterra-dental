import { getAdminContext } from "../getAdminContext";
import AdminAppointmentsClient from "../AdminAppointmentsClient";

export default async function AdminAppointmentsPage() {
  const { appointments } = await getAdminContext();

  return <AdminAppointmentsClient initialAppointments={appointments} />;
}
