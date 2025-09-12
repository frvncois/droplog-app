// components/settings/danger-zone.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, Trash2 } from 'lucide-react'

export function DangerZone() {
  const [loading, setLoading] = useState(false)
  const [deleteAccountDialog, setDeleteAccountDialog] = useState(false)
  const [confirmationText, setConfirmationText] = useState('')

  const handleDeleteAccount = async () => {
    if (confirmationText !== 'DELETE') {
      alert('Please type "DELETE" to confirm account deletion')
      return
    }

    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Account deletion initiated')
      // In real app, redirect to confirmation page or sign out
      alert('Account deletion has been initiated. You will receive a confirmation email.')
    } catch (error) {
      console.error('Failed to delete account:', error)
      alert('Failed to delete account. Please try again.')
    } finally {
      setLoading(false)
      setDeleteAccountDialog(false)
      setConfirmationText('')
    }
  }

  return (
    <>
      {/* Danger Zone */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription className="text-red-600">
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-white">
              <div>
                <h4 className="font-medium text-red-700">Delete Account</h4>
                <p className="text-sm text-red-600">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </div>
              <Button 
                variant="destructive" 
                onClick={() => setDeleteAccountDialog(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={deleteAccountDialog} onOpenChange={setDeleteAccountDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Delete Account
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and all associated data.
            </DialogDescription>
          </DialogHeader>
          
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Warning:</strong> Deleting your account will:
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Permanently delete all your projects and tasks</li>
                <li>Remove you from all team collaborations</li>
                <li>Delete all your content and assets</li>
                <li>Cancel any active subscriptions</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="confirm-deletion">
                Type <strong>"DELETE"</strong> to confirm account deletion
              </Label>
              <Input
                id="confirm-deletion"
                placeholder="Type DELETE here"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setDeleteAccountDialog(false)
                  setConfirmationText('')
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteAccount}
                disabled={loading || confirmationText !== 'DELETE'}
                className="bg-red-600 hover:bg-red-700"
              >
                {loading ? 'Deleting...' : 'Delete Account'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}