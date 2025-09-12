// lib/stores/ui-store.ts
import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean
  activeModal: string | null
  modalData: any // For passing data to modals (like projectId)
  searchQuery: string
  setSidebarOpen: (open: boolean) => void
  setActiveModal: (modal: string | null, data?: any) => void
  setSearchQuery: (query: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  activeModal: null,
  modalData: null,
  searchQuery: '',
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveModal: (modal, data = null) => set({ 
    activeModal: modal, 
    modalData: data 
  }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}))