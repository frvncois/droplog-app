// components/modals/modal-provider.tsx
'use client'

import { useUIStore } from '@/lib/stores/ui-store'
import { CreateProjectModal } from '@/components/modals/create-project-modal'
import { CreateTaskModal } from '@/components/modals/create-task-modal'

export function ModalProvider() {
  const { activeModal, setActiveModal, modalData } = useUIStore() // Add modalData here
  
  const closeModal = () => setActiveModal(null)

  return (
    <>
      <CreateProjectModal
        open={activeModal === 'create-project'}
        onOpenChange={(open) => !open && closeModal()}
      />
      
      <CreateTaskModal
        open={activeModal === 'create-task'}
        onOpenChange={(open) => !open && closeModal()}
        defaultProjectId={modalData?.projectId} // Now properly access modalData
      />
    </>
  )
}