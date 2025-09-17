import { AssetsHeader } from "@/components/assets/assets-header";
import { AssetsStats } from "@/components/assets/assets-stats";
import { AssetsDataTable } from "@/components/assets/assets-data-table";

export default function AssetsPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <AssetsHeader />
      
      {/* Assets Stats Overview */}
      <AssetsStats />
      
      {/* Assets Data Table */}
      <AssetsDataTable />
    </div>
  );
}