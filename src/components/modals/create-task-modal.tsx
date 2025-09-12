// components/modals/create-task-modal.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultProjectId?: string;
}

export function CreateTaskModal({ open, onOpenChange, defaultProjectId }: CreateTaskModalProps) {
  const [title, setTitle] = useState("");

  console.log('Modal render - no stores, no mock data');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Test Modal (No Mock Data)</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <Input 
            placeholder="Test input" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}