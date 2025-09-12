// lib/stores/auth-store.ts
import { create } from 'zustand'

interface User {
  id: string
  name: string
  email: string
}

interface Profile {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
  isAuthenticated: boolean
  
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  setLoading: (loading: boolean) => void
  signOut: () => void
  signIn: (user: User) => void
}

// Dummy user for development
const dummyUser: User = {
  id: "user1",
  name: "John Doe",
  email: "john@example.com"
}

const dummyProfile: Profile = {
  id: "user1",
  name: "John Doe", 
  email: "john@example.com",
  avatar: "/avatars/john.png"
}

export const useAuthStore = create<AuthState>((set) => ({
  user: dummyUser,
  profile: dummyProfile,
  loading: false,
  isAuthenticated: true,
  
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  signOut: () => set({ user: null, profile: null, isAuthenticated: false }),
  signIn: (user) => set({ user, isAuthenticated: true }),
}))

export type { User, Profile }