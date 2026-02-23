import {Outlet} from "react-router-dom";
import {Layout} from "@/pages/dashboard/components/Layout";
import './styles/dashboard.css';

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
