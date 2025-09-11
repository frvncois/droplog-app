"use client";

import { useState } from "react";

type ModalType = 
  | "createProject" 
  | "createTask" 
  | "uploadAsset" 
  | "createContent" 
  | "addTeamMember" 
  | "quickCreate";

interface ModalState {
  isOpen: boolean;
  data?: any;
}

type ModalsState = Record<ModalType, ModalState>;

export function useModals() {
  const [modals, setModals] = useState<ModalsState>({
    createProject: { isOpen: false },
    createTask: { isOpen: false },
    uploadAsset: { isOpen: false },
    createContent: { isOpen: false },
    addTeamMember: { isOpen: false },
    quickCreate: { isOpen: false },
  });

  const openModal = (type: ModalType, data?: any) => {
    setModals(prev => ({
      ...prev,
      [type]: { isOpen: true, data }
    }));
  };

  const closeModal = (type: ModalType) => {
    setModals(prev => ({
      ...prev,
      [type]: { isOpen: false, data: undefined }
    }));
  };

  const closeAllModals = () => {
    setModals({
      createProject: { isOpen: false },
      createTask: { isOpen: false },
      uploadAsset: { isOpen: false },
      createContent: { isOpen: false },
      addTeamMember: { isOpen: false },
      quickCreate: { isOpen: false },
    });
  };

  return {
    modals,
    openModal,
    closeModal,
    closeAllModals,
    // Helper functions for specific modals
    createProject: {
      isOpen: modals.createProject.isOpen,
      open: (data?: any) => openModal("createProject", data),
      close: () => closeModal("createProject"),
      data: modals.createProject.data,
    },
    createTask: {
      isOpen: modals.createTask.isOpen,
      open: (data?: any) => openModal("createTask", data),
      close: () => closeModal("createTask"),
      data: modals.createTask.data,
    },
    uploadAsset: {
      isOpen: modals.uploadAsset.isOpen,
      open: (data?: any) => openModal("uploadAsset", data),
      close: () => closeModal("uploadAsset"),
      data: modals.uploadAsset.data,
    },
    createContent: {
      isOpen: modals.createContent.isOpen,
      open: (data?: any) => openModal("createContent", data),
      close: () => closeModal("createContent"),
      data: modals.createContent.data,
    },
    addTeamMember: {
      isOpen: modals.addTeamMember.isOpen,
      open: (data?: any) => openModal("addTeamMember", data),
      close: () => closeModal("addTeamMember"),
      data: modals.addTeamMember.data,
    },
    quickCreate: {
      isOpen: modals.quickCreate.isOpen,
      open: (data?: any) => openModal("quickCreate", data),
      close: () => closeModal("quickCreate"),
      data: modals.quickCreate.data,
    },
  };
}

// Example usage in a component:
/*
import { useModals } from "@/hooks/use-modals";

function MyComponent() {
  const modals = useModals();
  
  return (
    <div>
      <Button onClick={() => modals.createProject.open()}>
        Create Project
      </Button>
      
      <Button onClick={() => modals.createTask.open({ projectId: "p1" })}>
        Create Task for Project
      </Button>
      
      <CreateProjectModal 
        open={modals.createProject.isOpen}
        onOpenChange={modals.createProject.close}
      />
      
      <CreateTaskModal 
        open={modals.createTask.isOpen}
        onOpenChange={modals.createTask.close}
        projectId={modals.createTask.data?.projectId}
      />
    </div>
  );
}
*/