// src/hooks/use-team.ts
import { useState, useEffect } from 'react'
import { TeamMember } from '@/lib/types'

interface UseTeamReturn {
  team: TeamMember[]
  isLoading: boolean
  error: string | null
  refetch: () => void
  getTeamMemberById: (id: string) => TeamMember | undefined
}

export function useTeam(): UseTeamReturn {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTeam = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      await new Promise(resolve => setTimeout(resolve, 150))
      
      const { team: dummyTeam } = await import('@/lib/utils/dummy-data')
      setTeam(dummyTeam)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch team')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTeam()
  }, [])

  const getTeamMemberById = (id: string) => {
    return team.find(member => member.id === id)
  }

  return {
    team,
    isLoading,
    error,
    refetch: fetchTeam,
    getTeamMemberById
  }
}