'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  CreditCard, 
  Users, 
  Database, 
  Zap, 
  Shield, 
  Download, 
  Calendar, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Crown,
  Star,
  ArrowUpCircle,
  FileText,
  Receipt,
  Clock
} from 'lucide-react'

// Plan and billing interfaces
interface Plan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  features: string[]
  limits: {
    members: number | 'unlimited'
    projects: number | 'unlimited'
    storage: string
    apiCalls: number | 'unlimited'
  }
  popular?: boolean
}

interface BillingHistory {
  id: string
  date: string
  description: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
  invoiceUrl?: string
}

interface UsageStats {
  members: { used: number; limit: number | 'unlimited' }
  projects: { used: number; limit: number | 'unlimited' }
  storage: { used: number; limit: number; unit: string }
  apiCalls: { used: number; limit: number | 'unlimited' }
}

// Available plans
const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    interval: 'month',
    features: [
      'Up to 5 team members',
      '3 projects',
      '1GB storage',
      'Basic support',
      'Core features'
    ],
    limits: {
      members: 5,
      projects: 3,
      storage: '1GB',
      apiCalls: 1000
    }
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 29,
    interval: 'month',
    features: [
      'Up to 25 team members',
      'Unlimited projects',
      '50GB storage',
      'Priority support',
      'Advanced analytics',
      'Custom integrations',
      'Team collaboration tools'
    ],
    limits: {
      members: 25,
      projects: 'unlimited',
      storage: '50GB',
      apiCalls: 10000
    },
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    interval: 'month',
    features: [
      'Unlimited team members',
      'Unlimited projects',
      '500GB storage',
      '24/7 dedicated support',
      'Advanced security',
      'Custom branding',
      'SSO integration',
      'Advanced reporting',
      'API access',
      'Custom workflows'
    ],
    limits: {
      members: 'unlimited',
      projects: 'unlimited',
      storage: '500GB',
      apiCalls: 'unlimited'
    }
  }
]

// Current usage stats
const currentUsage: UsageStats = {
  members: { used: 12, limit: 25 },
  projects: { used: 8, limit: 'unlimited' },
  storage: { used: 24, limit: 50, unit: 'GB' },
  apiCalls: { used: 2847, limit: 10000 }
}

// Billing history
const billingHistory: BillingHistory[] = [
  {
    id: 'inv_001',
    date: '2025-09-01',
    description: 'Professional Plan - Monthly',
    amount: 29.00,
    status: 'paid',
    invoiceUrl: '/invoices/inv_001.pdf'
  },
  {
    id: 'inv_002',
    date: '2025-08-01',
    description: 'Professional Plan - Monthly',
    amount: 29.00,
    status: 'paid',
    invoiceUrl: '/invoices/inv_002.pdf'
  },
  {
    id: 'inv_003',
    date: '2025-07-01',
    description: 'Professional Plan - Monthly',
    amount: 29.00,
    status: 'paid',
    invoiceUrl: '/invoices/inv_003.pdf'
  },
  {
    id: 'inv_004',
    date: '2025-06-01',
    description: 'Starter Plan - Monthly',
    amount: 0.00,
    status: 'paid'
  }
]

export function OrganizationPlan() {
  const [currentPlan] = useState('professional')
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month')
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string>('')

  const getCurrentPlan = () => plans.find(plan => plan.id === currentPlan)
  const currentPlanData = getCurrentPlan()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getUsagePercentage = (used: number, limit: number | 'unlimited') => {
    if (limit === 'unlimited') return 0
    return Math.round((used / limit) * 100)
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="default" className="bg-green-100 text-green-800">Paid</Badge>
      case 'pending':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="current" className="space-y-6">
        <TabsList>
          <TabsTrigger value="current">Current Plan</TabsTrigger>
          <TabsTrigger value="usage">Usage & Limits</TabsTrigger>
          <TabsTrigger value="billing">Billing History</TabsTrigger>
          <TabsTrigger value="plans">All Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          {/* Current Plan Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    Current Plan: {currentPlanData?.name}
                  </CardTitle>
                  <CardDescription>
                    Your organization is currently on the {currentPlanData?.name} plan
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {formatCurrency(currentPlanData?.price || 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    per {currentPlanData?.interval}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Plan Features</h4>
                  <div className="space-y-2">
                    {currentPlanData?.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Plan Limits</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Team Members</span>
                      <span className="text-sm font-medium">
                        {currentUsage.members.used} / {currentPlanData?.limits.members}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Projects</span>
                      <span className="text-sm font-medium">
                        {currentUsage.projects.used} / {currentPlanData?.limits.projects === 'unlimited' ? '∞' : currentPlanData?.limits.projects}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Storage</span>
                      <span className="text-sm font-medium">
                        {currentUsage.storage.used}{currentUsage.storage.unit} / {currentPlanData?.limits.storage}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API Calls</span>
                      <span className="text-sm font-medium">
                        {currentUsage.apiCalls.used.toLocaleString()} / {currentPlanData?.limits.apiCalls === 'unlimited' ? '∞' : currentPlanData?.limits.apiCalls.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t">
                <Button onClick={() => setUpgradeDialogOpen(true)}>
                  <ArrowUpCircle className="h-4 w-4 mr-2" />
                  Upgrade Plan
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
                <Button variant="outline">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Update Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Next Billing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Next Billing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Next billing date: October 12, 2025</p>
                  <p className="text-sm text-muted-foreground">
                    You will be charged {formatCurrency(currentPlanData?.price || 0)} for the {currentPlanData?.name} plan
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">{formatCurrency(currentPlanData?.price || 0)}</div>
                  <div className="text-sm text-muted-foreground">Auto-renewal</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          {/* Usage Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Team Members</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {currentUsage.members.used} / {currentUsage.members.limit}
                  </span>
                </div>
                <Progress 
                  value={getUsagePercentage(currentUsage.members.used, currentUsage.members.limit)} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {getUsagePercentage(currentUsage.members.used, currentUsage.members.limit)}% used
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Storage</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {currentUsage.storage.used}{currentUsage.storage.unit} / {currentUsage.storage.limit}{currentUsage.storage.unit}
                  </span>
                </div>
                <Progress 
                  value={getUsagePercentage(currentUsage.storage.used, currentUsage.storage.limit)} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {getUsagePercentage(currentUsage.storage.used, currentUsage.storage.limit)}% used
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-purple-500" />
                    <span className="font-medium">API Calls</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {currentUsage.apiCalls.used.toLocaleString()} / {currentUsage.apiCalls.limit === 'unlimited' ? '∞' : currentUsage.apiCalls.limit.toLocaleString()}
                  </span>
                </div>
                <Progress 
                  value={currentUsage.apiCalls.limit === 'unlimited' ? 0 : getUsagePercentage(currentUsage.apiCalls.used, currentUsage.apiCalls.limit as number)} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {currentUsage.apiCalls.limit === 'unlimited' ? 'Unlimited' : `${getUsagePercentage(currentUsage.apiCalls.used, currentUsage.apiCalls.limit as number)}% used`}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-orange-500" />
                    <span className="font-medium">Projects</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {currentUsage.projects.used} / {currentUsage.projects.limit === 'unlimited' ? '∞' : currentUsage.projects.limit}
                  </span>
                </div>
                <Progress 
                  value={currentUsage.projects.limit === 'unlimited' ? 0 : getUsagePercentage(currentUsage.projects.used, currentUsage.projects.limit as number)} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {currentUsage.projects.limit === 'unlimited' ? 'Unlimited' : `${getUsagePercentage(currentUsage.projects.used, currentUsage.projects.limit as number)}% used`}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Usage Warnings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                Usage Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getUsagePercentage(currentUsage.storage.used, currentUsage.storage.limit) >= 80 && (
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-800">Storage usage is high</p>
                      <p className="text-sm text-yellow-700">
                        You're using {getUsagePercentage(currentUsage.storage.used, currentUsage.storage.limit)}% of your storage. Consider upgrading your plan.
                      </p>
                    </div>
                  </div>
                )}
                {getUsagePercentage(currentUsage.members.used, currentUsage.members.limit) >= 80 && (
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-800">Team member limit approaching</p>
                      <p className="text-sm text-yellow-700">
                        You're using {getUsagePercentage(currentUsage.members.used, currentUsage.members.limit)}% of your team member slots.
                      </p>
                    </div>
                  </div>
                )}
                {getUsagePercentage(currentUsage.storage.used, currentUsage.storage.limit) < 80 && 
                 getUsagePercentage(currentUsage.members.used, currentUsage.members.limit) < 80 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <h3 className="font-semibold text-green-800">Everything looks good!</h3>
                    <p className="text-sm text-green-600">Your usage is well within limits.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Billing History
              </CardTitle>
              <CardDescription>View and download your past invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billingHistory.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{formatDate(invoice.date)}</TableCell>
                      <TableCell>{invoice.description}</TableCell>
                      <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell>
                        {invoice.invoiceUrl && (
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">•••• •••• •••• 1234</p>
                    <p className="text-sm text-muted-foreground">Expires 12/2026</p>
                  </div>
                </div>
                <Button variant="outline">Update</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={billingInterval === 'month' ? 'font-medium' : 'text-muted-foreground'}>Monthly</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBillingInterval(billingInterval === 'month' ? 'year' : 'month')}
            >
              {billingInterval === 'month' ? 'Switch to Yearly' : 'Switch to Monthly'}
            </Button>
            <span className={billingInterval === 'year' ? 'font-medium' : 'text-muted-foreground'}>
              Yearly
              <Badge variant="secondary" className="ml-2">Save 20%</Badge>
            </span>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const price = billingInterval === 'year' ? plan.price * 12 * 0.8 : plan.price
              const isCurrentPlan = plan.id === currentPlan

              return (
                <Card key={plan.id} className={`relative ${plan.popular ? 'border-blue-500 shadow-lg' : ''} ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-500">Most Popular</Badge>
                    </div>
                  )}
                  {isCurrentPlan && (
                    <div className="absolute -top-3 right-4">
                      <Badge className="bg-green-500">Current Plan</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center gap-2">
                      {plan.name}
                      {plan.id === 'enterprise' && <Crown className="h-5 w-5 text-yellow-500" />}
                    </CardTitle>
                    <div className="text-3xl font-bold">
                      {formatCurrency(price)}
                      <span className="text-sm font-normal text-muted-foreground">
                        /{billingInterval}
                      </span>
                    </div>
                    {billingInterval === 'year' && plan.price > 0 && (
                      <div className="text-sm text-green-600">
                        Save {formatCurrency(plan.price * 12 * 0.2)} per year
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 border-t">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Team Members:</span>
                          <span className="font-medium">{plan.limits.members}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Projects:</span>
                          <span className="font-medium">{plan.limits.projects}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Storage:</span>
                          <span className="font-medium">{plan.limits.storage}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>API Calls:</span>
                          <span className="font-medium">{plan.limits.apiCalls}</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      variant={isCurrentPlan ? 'secondary' : 'default'}
                      disabled={isCurrentPlan}
                      onClick={() => {
                        setSelectedPlan(plan.id)
                        setUpgradeDialogOpen(true)
                      }}
                    >
                      {isCurrentPlan ? 'Current Plan' : plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Upgrade Dialog */}
      <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Plan Change</DialogTitle>
            <DialogDescription>
              {selectedPlan && plans.find(p => p.id === selectedPlan)?.name && (
                <>You are about to change to the {plans.find(p => p.id === selectedPlan)?.name} plan.</>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <span>New Plan:</span>
                <span className="font-medium">
                  {selectedPlan && plans.find(p => p.id === selectedPlan)?.name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Price:</span>
                <span className="font-medium">
                  {selectedPlan && formatCurrency(
                    billingInterval === 'year' 
                      ? (plans.find(p => p.id === selectedPlan)?.price || 0) * 12 * 0.8
                      : plans.find(p => p.id === selectedPlan)?.price || 0
                  )}
                  /{billingInterval}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Next Billing:</span>
                <span className="font-medium">October 12, 2025</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpgradeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setUpgradeDialogOpen(false)}>
              Confirm Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}