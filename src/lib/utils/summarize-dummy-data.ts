// lib/utils/summarize-dummy-data.ts

// Dummy data following the playbook schemas (camelCase keys)
export const dummyProjects = [
  {
    id: "p1",
    title: "Marketing Website",
    url: "https://example.com",
    status: "active" as const,
    createdAt: "2025-09-01T10:00:00Z",
    updatedAt: "2025-09-05T14:00:00Z",
    tasksCount: 5
  },
  {
    id: "p2", 
    title: "Mobile App Development",
    url: "https://app.example.com",
    status: "active" as const,
    createdAt: "2025-08-15T09:00:00Z",
    updatedAt: "2025-09-10T16:30:00Z",
    tasksCount: 12
  },
  {
    id: "p3",
    title: "E-commerce Platform",
    status: "completed" as const,
    createdAt: "2025-07-01T08:00:00Z", 
    updatedAt: "2025-08-30T17:00:00Z",
    tasksCount: 8
  }
]

export const dummyTasks = [
  {
    id: "t1",
    projectId: "p1", 
    title: "Fix homepage header",
    status: "in_progress" as const,
    priority: "high" as const,
    assignedTo: "u1",
    dueDate: "2025-09-20",
    comments: ["Needs review", "Check mobile layout"]
  },
  {
    id: "t2",
    projectId: "p1",
    title: "Update footer links", 
    status: "completed" as const,
    priority: "medium" as const,
    assignedTo: "u2",
    dueDate: "2025-09-15",
    comments: ["Design approved"]
  },
  {
    id: "t3",
    projectId: "p1",
    title: "Add contact form",
    status: "todo" as const,
    priority: "high" as const,
    assignedTo: "u1",
    dueDate: "2025-09-25",
    comments: []
  },
  {
    id: "t4", 
    projectId: "p1",
    title: "SEO optimization",
    status: "in_progress" as const,
    priority: "medium" as const,
    assignedTo: "u3",
    dueDate: "2025-09-18",
    comments: ["Keyword research done"]
  },
  {
    id: "t5",
    projectId: "p1", 
    title: "Performance testing",
    status: "todo" as const,
    priority: "low" as const,
    dueDate: "2025-09-12", // Overdue task
    comments: []
  },
  {
    id: "t6",
    projectId: "p2",
    title: "User authentication system",
    status: "completed" as const,
    priority: "high" as const,
    assignedTo: "u2",
    dueDate: "2025-09-10",
    comments: ["Security review passed"]
  },
  {
    id: "t7",
    projectId: "p2",
    title: "Push notifications",
    status: "in_progress" as const, 
    priority: "medium" as const,
    assignedTo: "u1",
    dueDate: "2025-09-22",
    comments: ["iOS implementation ready"]
  },
  {
    id: "t8",
    projectId: "p2",
    title: "Offline sync feature",
    status: "todo" as const,
    priority: "high" as const,
    assignedTo: "u3",
    dueDate: "2025-09-28",
    comments: []
  }
]

export const dummyAssets = [
  {
    id: "a1",
    projectId: "p1",
    type: "image",
    title: "Hero Banner",
    addedBy: "u2", 
    updatedAt: "2025-09-08T15:00:00Z"
  },
  {
    id: "a2",
    projectId: "p1",
    type: "document",
    title: "Brand Guidelines",
    addedBy: "u1",
    updatedAt: "2025-09-05T10:30:00Z"
  },
  {
    id: "a3", 
    projectId: "p1",
    type: "video",
    title: "Product Demo",
    addedBy: "u3",
    updatedAt: "2025-09-09T14:15:00Z"
  },
  {
    id: "a4",
    projectId: "p2",
    type: "image", 
    title: "App Icons",
    addedBy: "u1",
    updatedAt: "2025-09-07T11:00:00Z"
  },
  {
    id: "a5",
    projectId: "p2",
    type: "document",
    title: "API Documentation", 
    addedBy: "u2",
    updatedAt: "2025-09-10T16:45:00Z"
  }
]

export const dummyContent = [
  {
    id: "c1",
    projectId: "p1",
    title: "Blog Post Draft",
    status: "draft" as const,
    createdAt: "2025-09-02T09:00:00Z",
    updatedAt: "2025-09-03T16:00:00Z", 
    assignedTo: "u3"
  },
  {
    id: "c2",
    projectId: "p1", 
    title: "Homepage Copy",
    status: "approved" as const,
    createdAt: "2025-09-01T14:00:00Z",
    updatedAt: "2025-09-08T12:30:00Z",
    assignedTo: "u1"
  },
  {
    id: "c3",
    projectId: "p1",
    title: "About Page Content",
    status: "pending" as const,
    createdAt: "2025-09-04T11:00:00Z",
    updatedAt: "2025-09-09T10:15:00Z",
    assignedTo: "u2"
  },
  {
    id: "c4", 
    projectId: "p2",
    title: "App Store Description",
    status: "approved" as const,
    createdAt: "2025-08-28T13:00:00Z",
    updatedAt: "2025-09-05T15:20:00Z",
    assignedTo: "u3"
  },
  {
    id: "c5",
    projectId: "p2",
    title: "User Onboarding Guide",
    status: "draft" as const,
    createdAt: "2025-09-06T10:00:00Z", 
    updatedAt: "2025-09-10T14:00:00Z",
    assignedTo: "u1"
  }
]

export const dummyTeam = [
  {
    id: "u1",
    name: "Alice Johnson", 
    role: "Designer",
    avatarUrl: "/avatars/alice.png"
  },
  {
    id: "u2",
    name: "Bob Smith",
    role: "Developer", 
    avatarUrl: "/avatars/bob.png"
  },
  {
    id: "u3",
    name: "Carol Davis",
    role: "Content Writer",
    avatarUrl: "/avatars/carol.png" 
  },
  {
    id: "u4",
    name: "David Wilson",
    role: "Project Manager",
    avatarUrl: "/avatars/david.png"
  }
]

// Helper function to get project-specific data
export function getProjectSummaryData(projectId: string) {
  const project = dummyProjects.find(p => p.id === projectId)
  const tasks = dummyTasks.filter(t => t.projectId === projectId)
  const assets = dummyAssets.filter(a => a.projectId === projectId) 
  const content = dummyContent.filter(c => c.projectId === projectId)
  
  return {
    project,
    tasks,
    assets, 
    content,
    team: dummyTeam
  }
}