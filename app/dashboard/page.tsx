import { Breadcrumbs } from "@/components/Breadcrumbs"
import CategoriesCard from "@/components/CategoriesCard"
import DashboardRighSection from "@/components/DashboardRighSection";
import SolicitedCard from "@/components/SolicitedCard";
import Total_KYC from "@/components/Total_KYC"

const Dashboard = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <Total_KYC />
      <DashboardRighSection />
    </div>
  );
};  

export default Dashboard