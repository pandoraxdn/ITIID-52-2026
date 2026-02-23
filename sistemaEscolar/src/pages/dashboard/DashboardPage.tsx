import {Outlet} from "react-router-dom";
import {Layout} from "@/pages/dashboard/components/Layout";

export const DashboardPage = () => {
  return (
    <div
      className="dashboard"
    >
      <Layout>
        <Outlet />
      </Layout>
    </div>
  );
};
