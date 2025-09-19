// components/modals/team-sheet-modal.tsx
"use client";

import * as React from "react";
import { format } from "date-fns";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail, Phone, Calendar, User, Activity, Crown, Shield, Settings, Edit, MessageCircle, UserMinus, Building } from "lucide-react";

import { useTeam } from "@/hooks/use-team";

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "admin": return "bg-red-100 text-red-800";
    case "manager": return "bg-purple-100 text-purple-800";
    case "designer": return "bg-blue-100 text-blue-800";
    case "developer": return "bg-green-100 text-green-800";
    case "content_writer": return "bg-yellow-100 text-yellow-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getRoleIcon = (role: string) => {
  switch (role) {
    case "admin": return <Crown className="h-5 w-5 text-red-500" />;
    case "manager": return <Shield className="h-5 w-5 text-purple-500" />;
    case "designer": return <Settings className="h-5 w-5 text-blue-500" />;
    case "developer": return <Settings className="h-5 w-5 text-green-500" />;
    case "content_writer": return <Edit className="h-5 w-5 text-yellow-500" />;
    default: return <User className="h-5 w-5 text-gray-500" />;
  }
};

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "active": return "bg-green-100 text-green-800";
    case "inactive": return "bg-gray-100 text-gray-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getAvatarInitials = (name: string) =>
  name?.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase() || "?";

interface TeamSheetModalProps {
  memberId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TeamSheetModal({ memberId, open, onOpenChange }: TeamSheetModalProps) {
  const { getTeamMemberById } = useTeam();

  if (!memberId || !open) return null;

  const member = getTeamMemberById(memberId);
  if (!member) return null;

  const avatarInitials = getAvatarInitials(member.name);
  const roleDisplay = (member.role || "viewer").replace("_", " ");
  const statusDisplay = (member.status || "unknown").charAt(0).toUpperCase() + (member.status || "unknown").slice(1);
  const formattedJoinDate = member.joinedAt ? format(new Date(member.joinedAt), "MMMM d, yyyy") : "Unknown date";

  const handleRemove = () => {
    if (confirm(`Remove ${member.name} from project?`)) {
      console.log(`Removing ${member.name}`);
      onOpenChange(false);
    }
  };

  const handleSendMessage = () => console.log("Send message to:", member.name);
  const handleStartDiscussion = () => console.log("Start discussion with:", member.name);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-hidden">
        <ScrollArea className="h-full pr-6">
          <SheetHeader className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={member.avatarUrl || ""} alt={`${member.name} avatar`} />
                <AvatarFallback className="text-xl">{avatarInitials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <SheetTitle className="text-2xl">{member.name || "Unknown Member"}</SheetTitle>
                <SheetDescription>{member.email || "No email provided"}</SheetDescription>
                <div className="flex items-center gap-2 mt-2">
                  {getRoleIcon(member.role || "viewer")}
                  <Badge className={getRoleBadgeColor(member.role || "viewer")}>{roleDisplay}</Badge>
                  <Badge className={getStatusBadgeColor(member.status || "unknown")}>{statusDisplay}</Badge>
                </div>
              </div>
            </div>
          </SheetHeader>

          <div className="space-y-6 mt-6">
            {/* Member Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><User className="h-5 w-5" />Member Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-muted-foreground">ID</label><p className="text-sm font-mono">{member.id}</p></div>
                <div><label className="text-sm font-medium text-muted-foreground">Status</label><Badge className={getStatusBadgeColor(member.status || "unknown")}>{statusDisplay}</Badge></div>
                <div><label className="text-sm font-medium text-muted-foreground">Role</label><div className="flex items-center gap-2">{getRoleIcon(member.role || "viewer")}<span className="text-sm">{roleDisplay}</span></div></div>
                <div><label className="text-sm font-medium text-muted-foreground">Joined</label><p className="text-sm">{formattedJoinDate}</p></div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Mail className="h-5 w-5" />Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-muted-foreground" /><p className="text-sm">{member.email || "No email"}</p></div>
                {member.phone && <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-muted-foreground" /><p className="text-sm">{member.phone}</p></div>}
                {member.company && <div className="flex items-center gap-3"><Building className="h-4 w-4 text-muted-foreground" /><p className="text-sm">{member.company}</p></div>}
                <div className="flex items-center gap-3"><Calendar className="h-4 w-4 text-muted-foreground" /><p className="text-sm">{formattedJoinDate}</p></div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Activity className="h-5 w-5" />Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={handleSendMessage}><Mail className="h-4 w-4 mr-2" />Send Message</Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleStartDiscussion}><MessageCircle className="h-4 w-4 mr-2" />Start Discussion</Button>
                <Separator />
                <Button variant="destructive" className="w-full justify-start" onClick={handleRemove}><UserMinus className="h-4 w-4 mr-2" />Remove from Project</Button>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
