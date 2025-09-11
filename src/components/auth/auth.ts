// Auth utilities for future Supabase integration
// For now, these are placeholder functions for the frontend

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl?: string;
}

// Simulate current user (replace with actual auth later)
export const getCurrentUser = (): User | null => {
  // For demo purposes, return a mock user
  // In real implementation, this would check auth tokens/session
  if (typeof window !== "undefined") {
    const mockUser = localStorage.getItem("droplog_demo_user");
    if (mockUser) {
      return JSON.parse(mockUser);
    }
  }
  return null;
};

// Simulate login (replace with actual auth later)
export const loginUser = async (email: string, password: string): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo, create a mock user
  const user: User = {
    id: "demo-user-1",
    email: email,
    firstName: email.split("@")[0].split(".")[0] || "Demo",
    lastName: email.split("@")[0].split(".")[1] || "User",
    role: "admin",
    avatarUrl: "/avatars/demo-user.png"
  };
  
  // Store in localStorage for demo
  if (typeof window !== "undefined") {
    localStorage.setItem("droplog_demo_user", JSON.stringify(user));
  }
  
  return user;
};

// Simulate registration (replace with actual auth later)
export const registerUser = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const user: User = {
    id: `user-${Date.now()}`,
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    role: userData.role,
    avatarUrl: "/avatars/default-user.png"
  };
  
  // Store in localStorage for demo
  if (typeof window !== "undefined") {
    localStorage.setItem("droplog_demo_user", JSON.stringify(user));
  }
  
  return user;
};

// Simulate logout (replace with actual auth later)
export const logoutUser = async (): Promise<void> => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("droplog_demo_user");
  }
};

// Check if user is authenticated (replace with actual auth later)
export const isAuthenticated = (): boolean => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("droplog_demo_user") !== null;
  }
  return false;
};

// Password validation helper
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Email validation helper
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};