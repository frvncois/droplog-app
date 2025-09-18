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
  type: "image" | "video" | "pdf" | "document" | "audio" | "other";
  title: string;
  filename?: string;
  fileUrl?: string;
  fileSize?: number;
  description?: string;
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
  url?: string;
}

export interface Documentation {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  status: "draft" | "review" | "published" | "archived";
  author: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  wordCount: number;
  readTime: number;
  content?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
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

export const documentation: Documentation[] = [
  {
    id: "doc1",
    title: "Project Setup Guide",
    description: "Complete guide for setting up this project with all necessary configurations and dependencies.",
    category: "Setup",
    type: "Guide",
    status: "published",
    author: "u1",
    projectId: "p1",
    createdAt: "2025-09-01T10:00:00Z",
    updatedAt: "2025-09-10T14:30:00Z",
    tags: ["setup", "getting-started", "configuration"],
    wordCount: 1250,
    readTime: 5
  },
  {
    id: "doc2",
    title: "API Documentation",
    description: "Comprehensive RESTful API endpoints documentation with examples and response formats.",
    category: "API",
    type: "Reference",
    status: "published",
    author: "u2",
    projectId: "p1",
    createdAt: "2025-08-15T09:00:00Z",
    updatedAt: "2025-09-08T16:45:00Z",
    tags: ["api", "endpoints", "integration"],
    wordCount: 3200,
    readTime: 12
  },
  {
    id: "doc3",
    title: "Design System",
    description: "Brand guidelines, color palettes, typography, and component library specifications.",
    category: "Design",
    type: "Guidelines",
    status: "draft",
    author: "u3",
    projectId: "p1",
    createdAt: "2025-09-05T11:20:00Z",
    updatedAt: "2025-09-11T10:15:00Z",
    tags: ["design", "branding", "components"],
    wordCount: 890,
    readTime: 4
  },
  {
    id: "doc4",
    title: "Deployment Guide",
    description: "Step-by-step deployment procedures for production and staging environments.",
    category: "Operations",
    type: "Guide",
    status: "review",
    author: "u2",
    projectId: "p2",
    createdAt: "2025-09-07T13:30:00Z",
    updatedAt: "2025-09-09T09:20:00Z",
    tags: ["deployment", "operations", "production"],
    wordCount: 1800,
    readTime: 7
  },
  {
    id: "doc5",
    title: "Testing Guidelines",
    description: "Best practices for unit testing, integration testing, and end-to-end testing strategies.",
    category: "Development",
    type: "Guidelines",
    status: "published",
    author: "u1",
    projectId: "p2",
    createdAt: "2025-08-20T14:00:00Z",
    updatedAt: "2025-09-05T11:30:00Z",
    tags: ["testing", "quality", "automation"],
    wordCount: 2100,
    readTime: 8
  },
  {
    id: "doc6",
    title: "Security Checklist",
    description: "Essential security measures and compliance requirements for the application.",
    category: "Security",
    type: "Checklist",
    status: "review",
    author: "u3",
    projectId: "p4",
    createdAt: "2025-09-03T16:45:00Z",
    updatedAt: "2025-09-08T09:15:00Z",
    tags: ["security", "compliance", "audit"],
    wordCount: 950,
    readTime: 4
  }
];

export const team: TeamMember[] = [
  {
    id: "u1",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "designer",
    phone: "555-1234",
    company: "Example Corp",
    avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    status: "active",
    joinedAt: "2025-01-15T10:00:00Z"
  },
  {
    id: "u2",
    name: "Bob Smith",
    email: "bob@example.com",
    role: "developer",
    phone: "555-1234",
    company: "Example Corp",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    status: "active",
    joinedAt: "2025-02-20T09:00:00Z"
  },
  {
    id: "u3",
    name: "Carol Davis",
    email: "carol@example.com",
    role: "content_writer",
    phone: "555-1234",
    company: "Example Corp",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    status: "active",
    joinedAt: "2025-03-10T11:00:00Z"
  },
  {
    id: "u4",
    name: "David Wilson",
    email: "david@example.com",
    role: "designer",
    phone: "555-1234",
    company: "Example Corp",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    status: "active",
    joinedAt: "2025-04-05T08:00:00Z"
  },
  {
    id: "u5",
    name: "Emma Brown",
    email: "emma@example.com",
    role: "manager",
    phone: "555-1234",
    company: "Example Corp",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    status: "active",
    joinedAt: "2025-01-08T09:00:00Z"
  },
  {
    id: "u6",
    name: "Frank Miller",
    email: "frank@example.com",
    role: "developer",
    phone: "555-1234",
    company: "Example Corp",
    avatarUrl: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
    status: "active",
    joinedAt: "2025-05-12T10:00:00Z"
  },
  {
    id: "u7",
    name: "Grace Lee",
    email: "grace@example.com",
    role: "admin",
    phone: "555-1234",
    company: "Example Corp",
    avatarUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    status: "active",
    joinedAt: "2025-01-01T08:00:00Z"
  }
];

// Help Articles
export const helpArticles = [
  {
    id: "h1",
    title: "Getting Started with Droplog",
    description: "Learn the basics of project management with Droplog in under 10 minutes",
    category: "getting-started",
    tags: ["basics", "onboarding", "tutorial"],
    rating: 4.8,
    readTime: "5 min read",
    updatedAt: "2 days ago"
  },
  {
    id: "h2", 
    title: "Creating Your First Project",
    description: "Step-by-step guide to setting up a new project and inviting team members",
    category: "projects",
    tags: ["project", "setup", "collaboration"],
    rating: 4.9,
    readTime: "8 min read",
    updatedAt: "1 week ago"
  },
  {
    id: "h3",
    title: "Task Management Best Practices",
    description: "Tips for organizing tasks, setting priorities, and tracking progress effectively",
    category: "tasks",
    tags: ["productivity", "workflow", "organization"],
    rating: 4.7,
    readTime: "12 min read",
    updatedAt: "3 days ago"
  },
  {
    id: "h4",
    title: "Team Collaboration Features",
    description: "How to use comments, mentions, and notifications to keep your team in sync",
    category: "team",
    tags: ["collaboration", "communication", "notifications"],
    rating: 4.6,
    readTime: "7 min read",
    updatedAt: "5 days ago"
  },
  {
    id: "h5",
    title: "Integrating with Third-Party Tools",
    description: "Connect Droplog with Slack, Google Drive, and other popular productivity tools",
    category: "integrations",
    tags: ["integrations", "automation", "api"],
    rating: 4.5,
    readTime: "15 min read",
    updatedAt: "1 week ago"
  },
  {
    id: "h6",
    title: "Troubleshooting Common Issues",
    description: "Solutions to frequently encountered problems and error messages",
    category: "troubleshooting",
    tags: ["troubleshooting", "errors", "support"],
    rating: 4.4,
    readTime: "10 min read",
    updatedAt: "4 days ago"
  }
]

// Video Tutorials
export const videoTutorials = [
  {
    id: "v1",
    title: "Droplog Overview - Complete Walkthrough",
    description: "A comprehensive tour of all Droplog features and capabilities",
    duration: "12:34",
    views: "2.1k",
    publishedAt: "1 week ago",
    tags: ["overview", "features", "demo"]
  },
  {
    id: "v2",
    title: "Project Setup and Configuration",
    description: "Learn how to create and configure projects for maximum efficiency",
    duration: "8:45",
    views: "1.8k", 
    publishedAt: "3 days ago",
    tags: ["projects", "setup", "configuration"]
  },
  {
    id: "v3",
    title: "Advanced Task Management",
    description: "Master task dependencies, custom fields, and automation rules",
    duration: "15:22",
    views: "956",
    publishedAt: "5 days ago",
    tags: ["tasks", "advanced", "automation"]
  },
  {
    id: "v4",
    title: "Team Onboarding Best Practices",
    description: "How to effectively onboard new team members and set permissions",
    duration: "9:18",
    views: "1.3k",
    publishedAt: "2 weeks ago", 
    tags: ["team", "onboarding", "permissions"]
  }
]

// FAQ Data
export const faqs = [
  {
    id: "faq1",
    category: "getting-started",
    question: "How do I create my first project?",
    answer: "To create your first project, click the 'New Project' button in the top navigation, fill in the project details, and invite your team members. You can then start adding tasks and organizing your workflow.",
    relatedArticles: ["Creating Your First Project", "Team Collaboration Features"]
  },
  {
    id: "faq2",
    category: "tasks",
    question: "Can I set task dependencies?",
    answer: "Yes, Droplog supports task dependencies. You can set dependencies when creating or editing a task. Dependent tasks will be automatically updated when their prerequisites are completed.",
    relatedArticles: ["Advanced Task Management", "Task Management Best Practices"]
  },
  {
    id: "faq3",
    category: "team",
    question: "How do I manage team permissions?",
    answer: "Team permissions can be managed in the project settings. You can assign roles like Admin, Member, or Viewer to control what actions each team member can perform.",
    relatedArticles: ["Team Collaboration Features", "Project Setup and Configuration"]
  },
  {
    id: "faq4",
    category: "integrations",
    question: "Which third-party tools does Droplog integrate with?",
    answer: "Droplog integrates with popular tools like Slack, Google Drive, Trello, GitHub, and many others. You can find the full list and setup instructions in the Integrations section.",
    relatedArticles: ["Integrating with Third-Party Tools"]
  },
  {
    id: "faq5",
    category: "troubleshooting",
    question: "Why can't I see my project?",
    answer: "If you can't see your project, check if you have the proper permissions or if the project has been archived. Contact your project admin or our support team if the issue persists.",
    relatedArticles: ["Troubleshooting Common Issues", "Team Collaboration Features"]
  },
  {
    id: "faq6",
    category: "projects",
    question: "How do I archive a completed project?",
    answer: "To archive a project, go to Project Settings and click 'Archive Project'. Archived projects can be restored later if needed and won't appear in your active projects list.",
    relatedArticles: ["Creating Your First Project"]
  }
]

// Support Team Data
export const supportTeam = [
  {
    id: "s1",
    name: "Sarah Chen",
    role: "Lead Support Specialist", 
    avatar: "/avatars/sarah.png",
    status: "online"
  },
  {
    id: "s2",
    name: "Marcus Johnson",
    role: "Technical Support",
    avatar: "/avatars/marcus.png", 
    status: "online"
  },
  {
    id: "s3",
    name: "Elena Rodriguez",
    role: "Customer Success",
    avatar: "/avatars/elena.png",
    status: "away"
  },
  {
    id: "s4",
    name: "David Kim",
    role: "Integration Specialist",
    avatar: "/avatars/david.png",
    status: "online"
  }
]

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

export const getDocumentationByProjectId = (projectId: string): Documentation[] => {
  return documentation.filter(doc => doc.projectId === projectId);
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