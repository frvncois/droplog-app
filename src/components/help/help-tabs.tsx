// components/documentation/help-tabs.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HelpArticlesList } from './help-articles-list'
import { HelpVideosList } from './help-videos-list'
import { HelpFaqList } from './help-faq-list'
import { HelpSupportTeam } from './help-support-team'

export function HelpTabs() {
  return (
    <Tabs defaultValue="articles" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="articles">Articles</TabsTrigger>
        <TabsTrigger value="videos">Videos</TabsTrigger>
        <TabsTrigger value="faq">FAQ</TabsTrigger>
        <TabsTrigger value="support">Support</TabsTrigger>
      </TabsList>

      <TabsContent value="articles">
        <HelpArticlesList />
      </TabsContent>

      <TabsContent value="videos">
        <HelpVideosList />
      </TabsContent>

      <TabsContent value="faq">
        <HelpFaqList />
      </TabsContent>

      <TabsContent value="support">
        <HelpSupportTeam />
      </TabsContent>
    </Tabs>
  )
}