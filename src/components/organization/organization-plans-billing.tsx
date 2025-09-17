// components/organization/organization-plans-billing.tsx

"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Crown, 
  Check, 
  Calendar, 
  Download, 
  Receipt, 
  AlertCircle,
  TrendingUp,
  Users,
  FolderOpen,
  Database,
  Shield,
  Zap
} from "lucide-react";

interface Organization {
  id: string;
  name: string;
  description?: string;
  plan: string;
  members: number;
  projects: number;
  createdAt: string;
  updatedAt: string;
}

interface OrganizationPlansBillingProps {
  organization: Organization;
}

// Dummy billing data
const billingInfo = {
  currentPlan: {
    name: "Professional",
    price: 29,
    billingCycle: "monthly",
    nextBilling: "2025-10-12T00:00:00Z",
    status: "active"
  },
  usage: {
    projects: { used: 8, limit: 25 },
    members: { used: 12, limit: 50 },
    storage: { used: 2.4, limit: 10 }
  },
  paymentMethod: {
    type: "card",
    last4: "4242",
    brand: "visa",
    expiryMonth: 12,
    expiryYear: 2026
  },
  invoices: [
    {
      id: "inv_001",
      date: "2025-09-12T00:00:00Z",
      amount: 29.00,
      status: "paid",
      downloadUrl: "#"
    },
    {
      id: "inv_002", 
      date: "2025-08-12T00:00:00Z",
      amount: 29.00,
      status: "paid",
      downloadUrl: "#"
    },
    {
      id: "inv_003",
      date: "2025-07-12T00:00:00Z", 
      amount: 19.00,
      status: "paid",
      downloadUrl: "#"
    }
  ]
};

const plans = [
  {
    name: "Starter",
    price: 0,
    period: "month",
    description: "Perfect for small teams just getting started",
    features: [
      "Up to 5 team members",
      "3 projects",
      "1GB storage",
      "Basic support",
      "Task management",
      "File sharing"
    ],
    limits: {
      members: 5,
      projects: 3,
      storage: 1
    },
    current: false,
    popular: false
  },
  {
    name: "Professional", 
    price: 29,
    period: "month",
    description: "Best for growing teams with advanced needs",
    features: [
      "Up to 50 team members",
      "25 projects", 
      "10GB storage",
      "Priority support",
      "Advanced task management",
      "Team collaboration tools",
      "Integrations",
      "Custom branding"
    ],
    limits: {
      members: 50,
      projects: 25,
      storage: 10
    },
    current: true,
    popular: true
  },
  {
    name: "Enterprise",
    price: 99,
    period: "month", 
    description: "For large organizations with complex requirements",
    features: [
      "Unlimited team members",
      "Unlimited projects",
      "100GB storage",
      "24/7 dedicated support",
      "Advanced security",
      "Custom integrations",
      "SSO/SAML",
      "Advanced analytics",
      "API access"
    ],
    limits: {
      members: "unlimited",
      projects: "unlimited", 
      storage: 100
    },
    current: false,
    popular: false
  }
];

export function OrganizationPlansBilling({ organization }: OrganizationPlansBillingProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getUsagePercentage = (used: number, limit: number | string) => {
    if (limit === "unlimited") return 0;
    return (used / Number(limit)) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Current Plan & Usage */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Current Plan
            </CardTitle>
            <CardDescription>
              Your active subscription and usage details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{billingInfo.currentPlan.name}</h3>
                <p className="text-muted-foreground">
                  ${billingInfo.currentPlan.price}/{billingInfo.currentPlan.billingCycle}
                </p>
              </div>
              <Badge variant="secondary" className="bg-green-50 text-green-700">
                Active
              </Badge>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span>Team Members</span>
                  <span className="text-muted-foreground">
                    {billingInfo.usage.members.used}/{billingInfo.usage.members.limit}
                  </span>
                </div>
                <Progress 
                  value={getUsagePercentage(billingInfo.usage.members.used, billingInfo.usage.members.limit)} 
                  className="mt-2"
                />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span>Projects</span>
                  <span className="text-muted-foreground">
                    {billingInfo.usage.projects.used}/{billingInfo.usage.projects.limit}
                  </span>
                </div>
                <Progress 
                  value={getUsagePercentage(billingInfo.usage.projects.used, billingInfo.usage.projects.limit)} 
                  className="mt-2"
                />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span>Storage</span>
                  <span className="text-muted-foreground">
                    {billingInfo.usage.storage.used} GB/{billingInfo.usage.storage.limit} GB
                  </span>
                </div>
                <Progress 
                  value={getUsagePercentage(billingInfo.usage.storage.used, billingInfo.usage.storage.limit)} 
                  className="mt-2"
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Next billing date</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(billingInfo.currentPlan.nextBilling)}
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Change
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Method
            </CardTitle>
            <CardDescription>
              Manage your billing and payment information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-6 bg-blue-100 rounded">
                  <span className="text-xs font-bold text-blue-700 uppercase">
                    {billingInfo.paymentMethod.brand}
                  </span>
                </div>
                <div>
                  <p className="font-medium">**** **** **** {billingInfo.paymentMethod.last4}</p>
                  <p className="text-sm text-muted-foreground">
                    Expires {billingInfo.paymentMethod.expiryMonth}/{billingInfo.paymentMethod.expiryYear}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                Edit
              </Button>
            </div>
            
            <Button variant="outline" className="w-full">
              <CreditCard className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
            
            <Separator />
            
            <div className="space-y-3">
              <h4 className="font-medium">Recent Invoices</h4>
              {billingInfo.invoices.slice(0, 3).map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">${invoice.amount.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(invoice.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-50 text-green-700">
                      {invoice.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="ghost" className="w-full">
              <Receipt className="h-4 w-4 mr-2" />
              View All Invoices
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Available Plans
          </CardTitle>
          <CardDescription>
            Choose the plan that best fits your organization's needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4 p-1 bg-muted rounded-lg">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  billingCycle === "monthly" 
                    ? "bg-background shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  billingCycle === "yearly" 
                    ? "bg-background shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Yearly
                <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => {
              const price = billingCycle === "yearly" ? plan.price * 10 : plan.price;
              const period = billingCycle === "yearly" ? "year" : plan.period;
              
              return (
                <Card key={plan.name} className={`relative ${plan.current ? "ring-2 ring-primary" : ""}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  {plan.current && (
                    <div className="absolute -top-3 right-4">
                      <Badge variant="secondary" className="bg-green-50 text-green-700">
                        Current
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {plan.name === "Enterprise" && <Shield className="h-5 w-5" />}
                      {plan.name === "Professional" && <Zap className="h-5 w-5" />}
                      {plan.name === "Starter" && <Users className="h-5 w-5" />}
                      {plan.name}
                    </CardTitle>
                    <CardDescription>
                      {plan.description}
                    </CardDescription>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">
                        ${price}
                      </span>
                      <span className="text-muted-foreground">/{period}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className="w-full" 
                      variant={plan.current ? "secondary" : "default"}
                      disabled={plan.current}
                    >
                      {plan.current ? "Current Plan" : 
                       plan.name === "Starter" ? "Downgrade" : "Upgrade"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Need something custom?</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Contact our sales team for custom plans, volume discounts, and enterprise features.
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}