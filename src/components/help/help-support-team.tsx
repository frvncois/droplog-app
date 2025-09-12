// components/documentation/help-support-team.tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Users, MessageCircle, Download, BookOpen, ExternalLink } from 'lucide-react'
import { supportTeam } from '@/lib/utils/dummy-data'

export function HelpSupportTeam() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Support Team */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Support Team
          </CardTitle>
          <CardDescription>
            Get help from our expert support team
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {supportTeam.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-gray-600">{member.role}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className={`w-2 h-2 rounded-full ${
                      member.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    <span className="text-xs text-gray-500">
                      {member.status === 'online' ? 'Available' : 'Away'}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-1" />
                Chat
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Contact Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Contact Options
          </CardTitle>
          <CardDescription>
            Choose the best way to reach us
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full justify-start" variant="outline">
            <MessageCircle className="h-4 w-4 mr-3" />
            <div className="text-left">
              <div className="font-medium">Live Chat</div>
              <div className="text-sm text-gray-600">Usually responds in a few minutes</div>
            </div>
          </Button>

          <Button className="w-full justify-start" variant="outline">
            <Download className="h-4 w-4 mr-3" />
            <div className="text-left">
              <div className="font-medium">Email Support</div>
              <div className="text-sm text-gray-600">support@droplog.com</div>
            </div>
          </Button>

          <Button className="w-full justify-start" variant="outline">
            <BookOpen className="h-4 w-4 mr-3" />
            <div className="text-left">
              <div className="font-medium">Knowledge Base</div>
              <div className="text-sm text-gray-600">Browse our comprehensive guides</div>
            </div>
          </Button>

          <Button className="w-full justify-start" variant="outline">
            <ExternalLink className="h-4 w-4 mr-3" />
            <div className="text-left">
              <div className="font-medium">Community Forum</div>
              <div className="text-sm text-gray-600">Connect with other users</div>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}