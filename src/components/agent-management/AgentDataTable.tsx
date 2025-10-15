'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowUpDown, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface AgentData {
  agentId: string
  agentName: string
  timeInStatus: number
  status: 'available' | 'busy' | 'break' | 'offline' | 'training'
  answered: number
  handled: number
  avgHandle: number
  avgTalk: number
  avgHold: number
  avgACW: number
  hold: number
  transfer: number
}

interface AgentDataTableProps {
  data: AgentData[]
  loading?: boolean
}

export function AgentDataTable({ data, loading = false }: AgentDataTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<keyof AgentData>('agentName')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const itemsPerPage = 10

  // Sort data
  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
    }
    
    return 0
  })

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (field: keyof AgentData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field: keyof AgentData) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 opacity-50" />
    return sortDirection === 'asc' 
      ? <TrendingUp className="h-4 w-4" />
      : <TrendingDown className="h-4 w-4" />
  }

  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`
    }
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`
    } else {
      return `${remainingSeconds}s`
    }
  }

  const getStatusText = (status: AgentData['status']) => {
    const labels: Record<AgentData['status'], string> = {
      available: 'Available',
      busy: 'Busy',
      break: 'Break',
      offline: 'Offline',
      training: 'Training'
    }
    
    return labels[status]
  }

  const formatPerformanceValue = (value: number, type: 'time' | 'count') => {
    return type === 'time' ? formatTime(value) : value
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Agent Performance Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Performance Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('agentName')}
                >
                  <div className="flex items-center gap-2">
                    Agent Name {getSortIcon('agentName')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('timeInStatus')}
                >
                  <div className="flex items-center gap-2">
                    Time in Status {getSortIcon('timeInStatus')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-2">
                    Status {getSortIcon('status')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('answered')}
                >
                  <div className="flex items-center gap-2">
                    Answer {getSortIcon('answered')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('handled')}
                >
                  <div className="flex items-center gap-2">
                    Handle {getSortIcon('handled')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('avgHandle')}
                >
                  <div className="flex items-center gap-2">
                    Avg Handle {getSortIcon('avgHandle')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('avgTalk')}
                >
                  <div className="flex items-center gap-2">
                    Avg Talk {getSortIcon('avgTalk')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('avgHold')}
                >
                  <div className="flex items-center gap-2">
                    Avg Hold {getSortIcon('avgHold')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('avgACW')}
                >
                  <div className="flex items-center gap-2">
                    Avg ACW {getSortIcon('avgACW')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('hold')}
                >
                  <div className="flex items-center gap-2">
                    Hold {getSortIcon('hold')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('transfer')}
                >
                  <div className="flex items-center gap-2">
                    Transfer {getSortIcon('transfer')}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((agent, index) => (
                <TableRow key={agent.agentId} className={index % 2 === 0 ? 'bg-muted/20' : ''}>
                  <TableCell className="font-medium">{agent.agentName}</TableCell>
                  <TableCell>{formatDuration(agent.timeInStatus)}</TableCell>
                  <TableCell>{getStatusText(agent.status)}</TableCell>
                  <TableCell>{formatPerformanceValue(agent.answered, 'count')}</TableCell>
                  <TableCell>{formatPerformanceValue(agent.handled, 'count')}</TableCell>
                  <TableCell>{formatPerformanceValue(agent.avgHandle, 'time')}</TableCell>
                  <TableCell>{formatPerformanceValue(agent.avgTalk, 'time')}</TableCell>
                  <TableCell>{formatPerformanceValue(agent.avgHold, 'time')}</TableCell>
                  <TableCell>{formatPerformanceValue(agent.avgACW, 'time')}</TableCell>
                  <TableCell>{agent.hold}</TableCell>
                  <TableCell>{agent.transfer}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                      className="cursor-pointer"
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        <div className="mt-4 text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData.length)} of {sortedData.length} agents
        </div>
      </CardContent>
    </Card>
  )
}