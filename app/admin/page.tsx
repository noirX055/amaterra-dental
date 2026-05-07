import { getAdminContext } from "./getAdminContext";
import { DashboardClient } from "./_components/dashboard-client";

type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

export default async function Home({ searchParams: _searchParams }: PropsType) {
  const { appointments } = await getAdminContext();

  return <DashboardClient initialAppointments={appointments} />;
}
