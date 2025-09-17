"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AssetCreateModal } from "@/components/modals/asset-create-modal";
import { Asset } from "@/lib/utils/dummy-data";

interface AssetsHeaderProps {
  onCreateAsset?: (newAssetData: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function AssetsHeader({ onCreateAsset }: AssetsHeaderProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  const handleCreateAsset = (newAssetData: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (onCreateAsset) {
      onCreateAsset(newAssetData);
    }
    console.log('Created new asset:', newAssetData);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-semibold tracking-tight">Assets</h1>
          </div>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Manage and organize all your files and assets across projects
          </p>
        </div>
        <div className="space-y-0">
          <div className="flex items-center space-x-2">
            <Button variant="default" size="sm" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Upload new asset
            </Button>
          </div>
        </div>
      </div>

      {/* Asset Create Modal */}
      <AssetCreateModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        projectId="" // For global asset creation, project selection handled in modal
        onCreateAsset={handleCreateAsset}
      />
    </div>
  );
}