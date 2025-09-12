// components/documentation/help-faq-list.tsx
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ExternalLink, Lightbulb, FileText, CheckCircle2, Users, Zap, Shield } from 'lucide-react'
import { faqs } from '@/lib/utils/dummy-data'

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'getting-started': return <Lightbulb className="h-4 w-4" />
    case 'projects': return <FileText className="h-4 w-4" />
    case 'tasks': return <CheckCircle2 className="h-4 w-4" />
    case 'team': return <Users className="h-4 w-4" />
    case 'integrations': return <Zap className="h-4 w-4" />
    case 'troubleshooting': return <Shield className="h-4 w-4" />
    default: return <FileText className="h-4 w-4" />
  }
}

export function HelpFaqList() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq) => (
        <AccordionItem key={faq.id} value={faq.id}>
          <AccordionTrigger className="text-left">
            <div className="flex items-center gap-3">
              {getCategoryIcon(faq.category)}
              <span>{faq.question}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 space-y-2">
            <p>{faq.answer}</p>
            {faq.relatedArticles && faq.relatedArticles.length > 0 && (
              <div className="pt-3 border-t">
                <p className="font-medium text-sm text-gray-700 mb-2">Related Articles:</p>
                <div className="flex flex-wrap gap-2">
                  {faq.relatedArticles.map((article, index) => (
                    <Button key={index} variant="outline" size="sm">
                      {article}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}