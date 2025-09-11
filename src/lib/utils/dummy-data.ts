// Types
export interface Project {
  id: string;
  title: string;
  url?: string;
  status: "active" | "completed" | "archived";
  createdAt: string;
  updatedAt: string;
  tasksCount: number;
  description?: string;
  assignedTo?: string[];
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  status: "todo" | "in_progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  comments: string[];
  description?: string;
}

export interface Asset {
  id: string;
  projectId: string;
  type: "image" | "video" | "pdf" | "document" | "other";
  title: string;
  filename: string;
  fileSize: number;
  addedBy: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  url?: string;
}

export interface Content {
  id: string;
  projectId: string;
  title: string;
  status: "draft" | "pending" | "approved" | "published";
  type: "blog_post" | "page" | "email" | "social" | "other";
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  content?: string;
  wordCount?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "designer" | "developer" | "content_writer" | "viewer";
  avatarUrl?: string;
  status: "active" | "inactive";
  joinedAt: string;
}

// Dummy Data
export const projects: Project[] = [
  {
    id: "p1",
    title: "Marketing Website",
    url: "https://example.com",
    status: "active",
    createdAt: "2025-09-01T10:00:00Z",
    updatedAt: "2025-09-05T14:00:00Z",
    tasksCount: 5,
    description: "Complete redesign of the marketing website with new branding",
    assignedTo: ["u1", "u2", "u3"]
  },
  {
    id: "p2",
    title: "Mobile App Design",
    status: "active",
    createdAt: "2025-08-15T09:00:00Z",
    updatedAt: "2025-09-10T16:00:00Z",
    tasksCount: 12,
    description: "Design system and UI/UX for the mobile application",
    assignedTo: ["u1", "u4"]
  },
  {
    id: "p3",
    title: "Brand Guidelines",
    status: "completed",
    createdAt: "2025-07-20T08:00:00Z",
    updatedAt: "2025-08-30T12:00:00Z",
    tasksCount: 8,
    description: "Updated brand guidelines and style guide documentation",
    assignedTo: ["u2", "u5"]
  },
  {
    id: "p4",
    title: "E-commerce Platform",
    url: "https://shop.example.com",
    status: "active",
    createdAt: "2025-09-05T11:00:00Z",
    updatedAt: "2025-09-11T10:00:00Z",
    tasksCount: 18,
    description: "Full-stack e-commerce solution with payment integration",
    assignedTo: ["u3", "u6", "u7"]
  }
];

export const tasks: Task[] = [
  {
    id: "t1",
    projectId: "p1",
    title: "Fix homepage header",
    status: "in_progress",
    priority: "high",
    assignedTo: "u1",
    dueDate: "2025-09-20",
    createdAt: "2025-09-05T10:00:00Z",
    updatedAt: "2025-09-10T14:00:00Z",
    comments: ["Needs review", "Check mobile layout"],
    description: "The header is not displaying correctly on mobile devices"
  },
  {
    id: "t2",
    projectId: "p1",
    title: "Update footer links",
    status: "todo",
    priority: "medium",
    assignedTo: "u2",
    dueDate: "2025-09-25",
    createdAt: "2025-09-06T09:00:00Z",
    updatedAt: "2025-09-06T09:00:00Z",
    comments: [],
    description: "Add new social media links and update contact information"
  },
  {
    id: "t3",
    projectId: "p2",
    title: "Design login screen",
    status: "completed",
    priority: "high",
    assignedTo: "u1",
    dueDate: "2025-09-15",
    createdAt: "2025-08-20T11:00:00Z",
    updatedAt: "2025-09-14T16:00:00Z",
    comments: ["Approved by stakeholders", "Ready for development"],
    description: "Create user-friendly login and registration screens"
  },
  {
    id: "t4",
    projectId: "p4",
    title: "Implement payment gateway",
    status: "in_progress",
    priority: "urgent",
    assignedTo: "u3",
    dueDate: "2025-09-18",
    createdAt: "2025-09-08T13:00:00Z",
    updatedAt: "2025-09-11T10:00:00Z",
    comments: ["Stripe integration in progress", "Need to test sandbox"],
    description: "Integrate Stripe payment processing for checkout flow"
  }
];

export const assets: Asset[] = [
  {
    id: "a1",
    projectId: "p1",
    type: "image",
    title: "Hero Banner",
    filename: "hero-banner.jpg",
    fileSize: 2048000,
    addedBy: "u2",
    assignedTo: "u1",
    createdAt: "2025-09-07T10:00:00Z",
    updatedAt: "2025-09-08T15:00:00Z",
    url: "/assets/hero-banner.jpg"
  },
  {
    id: "a2",
    projectId: "p1",
    type: "pdf",
    title: "Brand Guidelines PDF",
    filename: "brand-guidelines-v2.pdf",
    fileSize: 5120000,
    addedBy: "u2",
    createdAt: "2025-09-05T14:00:00Z",
    updatedAt: "2025-09-05T14:00:00Z",
    url: "/assets/brand-guidelines-v2.pdf"
  },
  {
    id: "a3",
    projectId: "p2",
    type: "image",
    title: "App Icons Set",
    filename: "app-icons.zip",
    fileSize: 1024000,
    addedBy: "u1",
    assignedTo: "u4",
    createdAt: "2025-08-25T09:00:00Z",
    updatedAt: "2025-09-01T11:00:00Z",
    url: "/assets/app-icons.zip"
  }
];

export const content: Content[] = [
  {
    id: "c1",
    projectId: "p1",
    title: "Blog Post Draft",
    status: "draft",
    type: "blog_post",
    createdAt: "2025-09-02T09:00:00Z",
    updatedAt: "2025-09-03T16:00:00Z",
    assignedTo: "u3",
    content: "Draft content for the upcoming blog post about our new features...",
    wordCount: 1250
  },
  {
    id: "c2",
    projectId: "p1",
    title: "Homepage Copy",
    status: "approved",
    type: "page",
    createdAt: "2025-08-28T11:00:00Z",
    updatedAt: "2025-09-05T14:00:00Z",
    assignedTo: "u5",
    content: "Welcome to our redesigned homepage...",
    wordCount: 800
  },
  {
    id: "c3",
    projectId: "p4",
    title: "Product Descriptions",
    status: "pending",
    type: "other",
    createdAt: "2025-09-08T10:00:00Z",
    updatedAt: "2025-09-10T12:00:00Z",
    assignedTo: "u5",
    content: "Detailed product descriptions for the e-commerce catalog...",
    wordCount: 2100
  }
];

export const team: TeamMember[] = [
  {
    id: "u1",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "designer",
    avatarUrl: "/avatars/alice.png",
    status: "active",
    joinedAt: "2025-01-15T10:00:00Z"
  },
  {
    id: "u2",
    name: "Bob Smith",
    email: "bob@example.com",
    role: "developer",
    avatarUrl: "/avatars/bob.png",
    status: "active",
    joinedAt: "2025-02-20T09:00:00Z"
  },
  {
    id: "u3",
    name: "Carol Davis",
    email: "carol@example.com",
    role: "content_writer",
    avatarUrl: "/avatars/carol.png",
    status: "active",
    joinedAt: "2025-03-10T11:00:00Z"
  },
  {
    id: "u4",
    name: "David Wilson",
    email: "david@example.com",
    role: "designer",
    avatarUrl: "/avatars/david.png",
    status: "active",
    joinedAt: "2025-04-05T08:00:00Z"
  },
  {
    id: "u5",
    name: "Emma Brown",
    email: "emma@example.com",
    role: "manager",
    avatarUrl: "/avatars/emma.png",
    status: "active",
    joinedAt: "2025-01-08T09:00:00Z"
  },
  {
    id: "u6",
    name: "Frank Miller",
    email: "frank@example.com",
    role: "developer",
    avatarUrl: "/avatars/frank.png",
    status: "active",
    joinedAt: "2025-05-12T10:00:00Z"
  },
  {
    id: "u7",
    name: "Grace Lee",
    email: "grace@example.com",
    role: "admin",
    avatarUrl: "/avatars/grace.png",
    status: "active",
    joinedAt: "2025-01-01T08:00:00Z"
  }
];

// Helper functions
export const getProjectById = (id: string): Project | undefined => {
  return projects.find(project => project.id === id);
};

export const getTasksByProjectId = (projectId: string): Task[] => {
  return tasks.filter(task => task.projectId === projectId);
};

export const getAssetsByProjectId = (projectId: string): Asset[] => {
  return assets.filter(asset => asset.projectId === projectId);
};

export const getContentByProjectId = (projectId: string): Content[] => {
  return content.filter(item => item.projectId === projectId);
};

export const getTeamMemberById = (id: string): TeamMember | undefined => {
  return team.find(member => member.id === id);
};

export const getActiveProjects = (): Project[] => {
  return projects.filter(project => project.status === "active");
};

export const getTasksByStatus = (status: Task["status"]): Task[] => {
  return tasks.filter(task => task.status === status);
};

export const getTasksByAssignee = (userId: string): Task[] => {
  return tasks.filter(task => task.assignedTo === userId);
};