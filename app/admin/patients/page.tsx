import { getAdminContext } from "../getAdminContext";
import AdminPatientsClient from "../AdminPatientsClient";

export default async function AdminPatientsPage() {
  const { appointments } = await getAdminContext();

  return <AdminPatientsClient initialAppointments={appointments} />;
}
