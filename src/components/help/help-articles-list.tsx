// components/documentation/help-articles-list.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Star, ThumbsUp, ThumbsDown, Clock, ExternalLink,
  Lightbulb, FileText, CheckCircle2, Users, Zap, Shield, BookOpen 
} from 'lucide-react'
import { helpArticles } from '@/lib/utils/dummy-data'

const categories = ['all', 'getting-started', 'projects', 'tasks', 'team', 'integrations', 'troubleshooting']

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'getting-started': return <Lightbulb className="h-4 w-4" />
    case 'projects': return <FileText className="h-4 w-4" />
    case 'tasks': return <CheckCircle2 className="h-4 w-4" />
    case 'team': return <Users className="h-4 w-4" />
    case 'integrations': return <Zap className="h-4 w-4" />
    case 'troubleshooting': return <Shield className="h-4 w-4" />
    default: return <BookOpen className="h-4 w-4" />
  }
}

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'getting-started': return 'Getting Started'
    case 'projects': return 'Projects'
    case 'tasks': return 'Tasks'
    case 'team': return 'Team'
    case 'integrations': return 'Integrations'
    case 'troubleshooting': return 'Troubleshooting'
    default: return 'All Categories'
  }
}

export function HelpArticlesList() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [likedArticles, setLikedArticles] = useState<Set<string>>(new Set())
  const [dislikedArticles, setDislikedArticles] = useState<Set<string>>(new Set())

  const filteredArticles = helpArticles.filter(article => 
    selectedCategory === 'all' || article.category === selectedCategory
  )

  const handleLike = (articleId: string) => {
    setLikedArticles(prev => {
      const newSet = new Set(prev)
      if (newSet.has(articleId)) {
        newSet.delete(articleId)
      } else {
        newSet.add(articleId)
        setDislikedArticles(prev => {
          const newDisliked = new Set(prev)
          newDisliked.delete(articleId)
          return newDisliked
        })
      }
      return newSet
    })
  }

  const handleDislike = (articleId: string) => {
    setDislikedArticles(prev => {
      const newSet = new Set(prev)
      if (newSet.has(articleId)) {
        newSet.delete(articleId)
      } else {
        newSet.add(articleId)
        setLikedArticles(prev => {
          const newLiked = new Set(prev)
          newLiked.delete(articleId)
          return newLiked
        })
      }
      return newSet
    })
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="flex items-center gap-2"
          >
            {getCategoryIcon(category)}
            {getCategoryLabel(category)}
          </Button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <Card key={article.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Badge variant="outline" className="w-fit">
                    {getCategoryLabel(article.category)}
                  </Badge>
                  <CardTitle className="text-lg leading-tight">{article.title}</CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">{article.rating}</span>
                </div>
              </div>
              <CardDescription>{article.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {article.readTime}
                  </div>
                  <span>{article.updatedAt}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(article.id)}
                      className={likedArticles.has(article.id) ? "text-green-600" : ""}
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDislike(article.id)}
                      className={dislikedArticles.has(article.id) ? "text-red-600" : ""}
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="outline" size="sm">
                    Read More
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}