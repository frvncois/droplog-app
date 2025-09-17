// app/organization/page.tsx

import { OrganizationHeader } from "@/components/organization/organization-header";
import { OrganizationTabs } from "@/components/organization/organization-tabs";

export default function OrganizationPage() {
  // Dummy organization data matching the established pattern
  const organization = {
    id: "org1",
    name: "Acme Corporation",
    description: "Leading innovation in digital transformation and technology solutions",
    plan: "Professional",
    members: 12,
    projects: 8,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2025-09-12T14:30:00Z"
  };

  return (
    <div className="space-y-6 p-6">
      <OrganizationHeader organization={organization} />
      <OrganizationTabs organization={organization} />
    </div>
  );
}