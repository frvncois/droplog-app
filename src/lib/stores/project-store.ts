// lib/stores/project-store.ts
import { create } from 'zustand'

// Define types based on your dummy data structure
interface Project {
  id: string
  title: string
  url: string
  status: 'active' | 'completed' | 'archived'
  createdAt: string
  updatedAt: string
  tasksCount: number
}

interface ProjectStore {
  projects: Project[]
  currentProject: Project | null
  loading: boolean
  
  // Actions
  setProjects: (projects: Project[]) => void
  addProject: (project: Project) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  removeProject: (id: string) => void
  setCurrentProject: (project: Project | null) => void
  setLoading: (loading: boolean) => void
}

// Initial dummy projects data
const initialProjects: Project[] = [
  {
    id: "p1",
    title: "Marketing Website",
    url: "https://example.com",
    status: "active",
    createdAt: "2025-09-01T10:00:00Z",
    updatedAt: "2025-09-05T14:00:00Z",
    tasksCount: 5
  },
  {
    id: "p2",
    title: "Mobile App",
    url: "https://app.example.com",
    status: "active",
    createdAt: "2025-08-15T09:00:00Z",
    updatedAt: "2025-09-10T16:30:00Z",
    tasksCount: 12
  },
  {
    id: "p3",
    title: "Brand Guidelines",
    url: "",
    status: "completed",
    createdAt: "2025-07-20T14:00:00Z",
    updatedAt: "2025-08-30T11:00:00Z",
    tasksCount: 8
  }
]

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: initialProjects,
  currentProject: null,
  loading: false,

  setProjects: (projects) => set({ projects }),
  
  addProject: (project) => {
    // Generate a new ID for dummy data
    const newProject = {
      ...project,
      id: `p${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tasksCount: 0
    }
    
    set((state) => ({
      projects: [newProject, ...state.projects]
    }))
    
    console.log('✅ Project added to store:', newProject)
  },
  
  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map(project =>
      project.id === id 
        ? { ...project, ...updates, updatedAt: new Date().toISOString() } 
        : project
    ),
    currentProject: state.currentProject?.id === id 
      ? { ...state.currentProject, ...updates, updatedAt: new Date().toISOString() }
      : state.currentProject
  })),
  
  removeProject: (id) => set((state) => ({
    projects: state.projects.filter(project => project.id !== id),
    currentProject: state.currentProject?.id === id ? null : state.currentProject
  })),
  
  setCurrentProject: (project) => set({ currentProject: project }),
  
  setLoading: (loading) => set({ loading }),
}))

// Export the Project type for use in other components
export type { Project }