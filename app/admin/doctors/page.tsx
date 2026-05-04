import { getAdminContext } from "../getAdminContext";
import AdminDoctorsClient from "../AdminDoctorsClient";

export default async function AdminDoctorsPage() {
  const { appointments } = await getAdminContext();

  return <AdminDoctorsClient initialAppointments={appointments} />;
}
