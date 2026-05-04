import { getAdminContext } from "./getAdminContext";
import { DashboardStats } from "./_components/dashboard-stats";
import { LastAppointments } from "./_components/last-appointments";

type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

export default async function Home({ searchParams: _searchParams }: PropsType) {
  const { appointments } = await getAdminContext();

  return (
    <>
      <div className="mb-6 md:mb-8 2xl:mb-10">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome to the Reception Panel
        </p>
      </div>

      <DashboardStats appointments={appointments} />

      <div className="mt-6 md:mt-8 2xl:mt-10">
        <LastAppointments appointments={appointments} />
      </div>
    </>
  );
}
