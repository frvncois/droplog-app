'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

interface ModalContextType {
  activeModal: string | null
  modalData: any
  setActiveModal: (modal: string | null, data?: any) => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [activeModal, setActiveModalState] = useState<string | null>(null)
  const [modalData, setModalData] = useState<any>(null)

  const setActiveModal = (modal: string | null, data?: any) => {
    setActiveModalState(modal)
    setModalData(data)
  }

  return (
    <ModalContext.Provider value={{ activeModal, modalData, setActiveModal }}>
      {children}
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within ModalProvider')
  }
  return context
}