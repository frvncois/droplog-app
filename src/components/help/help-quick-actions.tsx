// components/documentation/help-quick-actions.tsx
import { Card } from '@/components/ui/card'
import { BookOpen, Video, MessageCircle, HelpCircle } from 'lucide-react'

const quickActions = [
  {
    icon: BookOpen,
    title: 'Quick Start Guide',
    description: 'Get started in 5 minutes',
    color: 'blue'
  },
  {
    icon: Video,
    title: 'Video Tutorials',
    description: 'Learn with step-by-step videos',
    color: 'green'
  },
  {
    icon: MessageCircle,
    title: 'Contact Support',
    description: 'Get help from our team',
    color: 'purple'
  },
  {
    icon: HelpCircle,
    title: 'FAQ',
    description: 'Common questions answered',
    color: 'orange'
  }
]

const getColorClasses = (color: string) => {
  switch (color) {
    case 'blue': return 'bg-blue-100 text-blue-600'
    case 'green': return 'bg-green-100 text-green-600'
    case 'purple': return 'bg-purple-100 text-purple-600'
    case 'orange': return 'bg-orange-100 text-orange-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}

export function HelpQuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {quickActions.map((action) => {
        const Icon = action.icon
        return (
          <Card key={action.title} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${getColorClasses(action.color)}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}