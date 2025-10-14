'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowUpDown, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface QueueData {
  queueId: string
  queueName: string
  offered: number
  answered: number
  abandoned: number
  asa: number
  serviceLevel: number
  avgWait: number
  avgHandle: number
  avgTalk: number
  avgHold: number
  avgACW: number
  hold: number
  transfer: number
}

interface QueueDataTableProps {
  data: QueueData[]
  loading?: boolean
}

export function QueueDataTable({ data, loading = false }: QueueDataTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<keyof QueueData>('queueName')
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

  const handleSort = (field: keyof QueueData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field: keyof QueueData) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 opacity-50" />
    return sortDirection === 'asc' 
      ? <TrendingUp className="h-4 w-4" />
      : <TrendingDown className="h-4 w-4" />
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`
    }
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatPerformanceValue = (value: number, type: 'percentage' | 'time' | 'count') => {
    if (type === 'percentage') {
      return formatPercentage(value)
    } else if (type === 'time') {
      return formatTime(value)
    } else {
      return value
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Queue Performance Data</CardTitle>
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
        <CardTitle>Queue Performance Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('queueName')}
                >
                  <div className="flex items-center gap-2">
                    Queue Name {getSortIcon('queueName')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('offered')}
                >
                  <div className="flex items-center gap-2">
                    Offer {getSortIcon('offered')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('answered')}
                >
                  <div className="flex items-center gap-2">
                    Answer % {getSortIcon('answered')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('abandoned')}
                >
                  <div className="flex items-center gap-2">
                    Abandon % {getSortIcon('abandoned')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('asa')}
                >
                  <div className="flex items-center gap-2">
                    ASA {getSortIcon('asa')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('serviceLevel')}
                >
                  <div className="flex items-center gap-2">
                    Service Level % {getSortIcon('serviceLevel')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('avgWait')}
                >
                  <div className="flex items-center gap-2">
                    Avg Wait {getSortIcon('avgWait')}
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
              {paginatedData.map((queue, index) => (
                <TableRow key={queue.queueId} className={index % 2 === 0 ? 'bg-muted/20' : ''}>
                  <TableCell className="font-medium">{queue.queueName}</TableCell>
                  <TableCell>{queue.offered}</TableCell>
                  <TableCell>{formatPerformanceValue(queue.answered, 'percentage')}</TableCell>
                  <TableCell>{formatPerformanceValue(queue.abandoned, 'percentage')}</TableCell>
                  <TableCell>{formatPerformanceValue(queue.asa, 'time')}</TableCell>
                  <TableCell>{formatPerformanceValue(queue.serviceLevel, 'percentage')}</TableCell>
                  <TableCell>{formatPerformanceValue(queue.avgWait, 'time')}</TableCell>
                  <TableCell>{formatPerformanceValue(queue.avgHandle, 'time')}</TableCell>
                  <TableCell>{formatPerformanceValue(queue.avgTalk, 'time')}</TableCell>
                  <TableCell>{formatPerformanceValue(queue.avgHold, 'time')}</TableCell>
                  <TableCell>{formatPerformanceValue(queue.avgACW, 'time')}</TableCell>
                  <TableCell>{queue.hold}</TableCell>
                  <TableCell>{queue.transfer}</TableCell>
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
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData.length)} of {sortedData.length} queues
        </div>
      </CardContent>
    </Card>
  )
}