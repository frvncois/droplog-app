// lib/stores/task-store.ts
import { create } from 'zustand'

// Define task type based on your dummy data structure
interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  projectId: string
  assignedTo?: string
  dueDate: string
  createdAt: string
  updatedAt: string
  comments: string[]
}

interface TaskStore {
  tasks: Task[]
  loading: boolean
  
  // Actions
  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  removeTask: (id: string) => void
  setLoading: (loading: boolean) => void
  getTasksByProject: (projectId: string) => Task[]
}

// Initial dummy tasks data (matching your dummy data structure)
const initialTasks: Task[] = [
  {
    id: "t1",
    title: "Fix homepage header",
    description: "Update the header design and fix mobile responsiveness issues",
    status: "in_progress",
    priority: "high",
    projectId: "p1",
    assignedTo: "u1",
    dueDate: "2025-09-20T00:00:00Z",
    createdAt: "2025-09-01T10:00:00Z",
    updatedAt: "2025-09-10T15:30:00Z",
    comments: ["Needs review", "Check mobile layout"]
  },
  {
    id: "t2",
    title: "Create contact form",
    description: "Design and implement the contact form with validation",
    status: "todo",
    priority: "medium",
    projectId: "p1",
    assignedTo: "u2",
    dueDate: "2025-09-25T00:00:00Z",
    createdAt: "2025-09-02T11:00:00Z",
    updatedAt: "2025-09-02T11:00:00Z",
    comments: []
  },
  {
    id: "t3",
    title: "Optimize images",
    description: "Compress and optimize all images for better performance",
    status: "completed",
    priority: "low",
    projectId: "p1",
    assignedTo: "u3",
    dueDate: "2025-09-15T00:00:00Z",
    createdAt: "2025-09-01T09:00:00Z",
    updatedAt: "2025-09-15T16:00:00Z",
    comments: ["Completed ahead of schedule"]
  },
  {
    id: "t4",
    title: "Setup authentication",
    description: "Implement user login and registration system",
    status: "in_progress",
    priority: "urgent",
    projectId: "p2",
    assignedTo: "u1",
    dueDate: "2025-09-18T00:00:00Z",
    createdAt: "2025-08-25T14:00:00Z",
    updatedAt: "2025-09-12T10:00:00Z",
    comments: ["Working on OAuth integration"]
  },
  {
    id: "t5",
    title: "Design wireframes",
    description: "Create wireframes for all main app screens",
    status: "completed",
    priority: "high",
    projectId: "p2",
    assignedTo: "u2",
    dueDate: "2025-09-10T00:00:00Z",
    createdAt: "2025-08-20T13:00:00Z",
    updatedAt: "2025-09-08T17:00:00Z",
    comments: ["Approved by stakeholders"]
  }
]

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: initialTasks,
  loading: false,

  setTasks: (tasks) => set({ tasks }),
  
  addTask: (task) => {
    set((state) => ({
      tasks: [task, ...state.tasks]
    }))
    
    console.log('✅ Task added to store:', task)
  },
  
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(task =>
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date().toISOString() } 
        : task
    )
  })),
  
  removeTask: (id) => set((state) => ({
    tasks: state.tasks.filter(task => task.id !== id)
  })),
  
  setLoading: (loading) => set({ loading }),
  
  getTasksByProject: (projectId) => {
    const { tasks } = get()
    return tasks.filter(task => task.projectId === projectId)
  },
}))

// Export the Task type for use in other components
export type { Task }