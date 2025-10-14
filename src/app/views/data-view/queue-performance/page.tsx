"use client"

import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { QueueDataTable } from '@/components/queue-management/QueueDataTable'
import { CalendarWithDropdowns } from '@/components/ui/calendar-with-dropdowns'
import { TimePicker } from '@/components/ui/time-picker'
import { DateRangeDisplay } from '@/components/ui/date-range-display'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DateRangeDialog } from '@/components/dashboard-wrappers/DateRangeDialog'
import { DashboardLayoutSimple } from '@/components/dashboard-layout-simple'

import { toast } from 'sonner'
import {
  Search,
  Filter,
  Download,
  Calendar,
  BarChart3,
  Phone,
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Timer,
  Zap,
  Target,
  Pause,
  Calendar as CalendarIcon,
  RotateCcw,
  AlertTriangle as AlertTriangleIcon,
  MessageSquare,
  Check,
  RotateCw,
  X,
  RefreshCw,
  Building
} from 'lucide-react'

interface QueueOption {
  id: string
  name: string
  mediaTypes: string[]
}

interface QueueMetric {
  metric: string
  stats: {
    count?: number
    max?: number
    min?: number
    sum?: number
    ratio?: number
    numerator?: number
    denominator?: number
    target?: number
  }
}

interface QueueData {
  interval: string
  metrics: QueueMetric[]
}

interface QueueGroup {
  mediaType: string
  queueId: string
  data: QueueData[]
}

interface ProcessedQueueData {
  queueId: string
  queueName: string
  mediaType: string
  totalCalls: number
  connectedCalls: number
  errorCalls: number
  offeredCalls: number
  abandonedCalls: number
  transferredCalls: number
  averageHandleTime: string
  averageTalkTime: string
  averageWaitTime: string
  averageHoldTime: string
  averageAcwTime: string
  serviceLevel: number
  serviceLevelTarget: number
  overSla: number
  utilization: number
  status: 'excellent' | 'good' | 'fair' | 'poor'
  answerRate: number
  abandonRate: number
  holdCount: number
  transferCount: number
}

// Queue name mapping function
const getQueueName = (queueId: string): string => {
  const queueNames: Record<string, string> = {
    '027396f4-553b-43ed-8ec0-09303971bd1c': 'Sales Support',
    '05f1c285-6777-4ccc-806f-8db085ae0793': 'Customer Service',
    '069bd957-53dc-40d7-837d-2691a5df6455': 'Technical Support',
    '0c42ff58-231e-4f85-a47c-a81ea703718f': 'Billing Support',
    '16342adc-9cb3-4106-947c-003699a7715d': 'Premium Support',
    '28a9d881-8d9b-4e97-87fb-0a25baa00292': 'Enterprise Support',
    '3276e936-29ae-496b-9bec-4735c61deca0': 'VIP Support',
    '4498e44c-cbb0-47c7-9bba-d30dd875f403': 'Emergency Support',
    '533070ce-5e91-40e5-8060-10d4be6f0d9b': 'Outbound Sales',
    '5b3fe137-0663-439a-b2d4-c6ac3a323261': 'Inbound Sales',
    '70e3e115-cbb6-4705-bb4a-91b263b53c06': 'Account Management',
    '782fa411-e88a-4fcf-95e0-2f837fbd853f': 'Retentions',
    '79ad10f3-4ecb-498b-908a-b68797f82cbb': 'General Support',
    '822f5704-bfe3-47a9-bd66-210e00633d41': 'Quality Assurance',
    '88936a51-2060-4d7a-9401-9660097c0e80': 'Training Support',
    '92c4908f-eba5-4255-8aef-39e735b44a4f': 'Supervisor Queue',
    'b80290c5-b367-4f9d-9289-4ac8e09eb9cb': 'Escalations',
    'c42c2ed4-794d-4b62-af97-c3afe46d1678': 'Compliance',
    'ce6705ad-61c8-4b74-9308-68a38782d706': 'Fraud Prevention',
    'd02c94be-ff67-4bca-8127-027a0ffc4b34': 'Risk Management',
    'ef2ab0ec-13ba-42fe-b91e-e4c7907a0387': 'Collections',
    'fc24fb0d-55ca-40a6-8596-a47feae09fe3': 'Dispute Resolution'
  }

  return queueNames[queueId] || `Queue ${queueId.substring(0, 6)}`
}

// Time range options
const timeRangeOptions = [
  { value: 'last_hour', label: 'Last Hour' },
  { value: 'last_24_hours', label: 'Last 24 Hours' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'this_week', label: 'This Week' },
  { value: 'last_week', label: 'Last Week' },
  { value: 'this_month', label: 'This Month' },
  { value: 'last_month', label: 'Last Month' },
  { value: 'last_7_days', label: 'Last 7 Days' },
  { value: 'last_30_days', label: 'Last 30 Days' },
  { value: 'custom', label: 'Custom Range' }
]

const mediaTypeOptions = [
  { value: 'all', label: 'All Media' },
  { value: 'voice', label: 'Voice' },
  { value: 'chat', label: 'Chat' },
  { value: 'email', label: 'Email' },
  { value: 'callback', label: 'Callback' }
]

const mockQueueData: QueueGroup[] = [
  {
    "group": {
      "mediaType": "voice",
      "queueId": "027396f4-553b-43ed-8ec0-09303971bd1c"
    },
    "data": [
      {
        "interval": "2025-01-25T21:00:00.000Z/2025-02-01T21:00:00.000Z",
        "metrics": [
          { "metric": "nBlindTransferred", "stats": { "count": 1 } },
          { "metric": "nConnected", "stats": { "count": 590 } },
          { "metric": "nError", "stats": { "count": 1387 } },
          { "metric": "nOutbound", "stats": { "count": 1385 } },
          { "metric": "nOutboundAttempted", "stats": { "count": 1313 } },
          { "metric": "nTransferred", "stats": { "count": 1 } },
          { "metric": "tAcw", "stats": { "max": 65000, "min": 2194, "count": 20, "sum": 1030811 } },
          { "metric": "tContacting", "stats": { "max": 4365, "min": 8, "count": 1385, "sum": 958500 } },
          { "metric": "tDialing", "stats": { "max": 71944, "min": 352, "count": 1313, "sum": 35310144 } },
          { "metric": "tHandle", "stats": { "max": 596146, "min": 11, "count": 1385, "sum": 70430555 } },
          { "metric": "tTalkComplete", "stats": { "max": 590670, "min": 371, "count": 590, "sum": 33131100 } }
        ]
      }
    ]
  },
  {
    "group": {
      "mediaType": "voice",
      "queueId": "05f1c285-6777-4ccc-806f-8db085ae0793"
    },
    "data": [
      {
        "interval": "2025-01-25T21:00:00.000Z/2025-02-01T21:00:00.000Z",
        "metrics": [
          { "metric": "nBlindTransferred", "stats": { "count": 634 } },
          { "metric": "nConnected", "stats": { "count": 7 } },
          { "metric": "nError", "stats": { "count": 751 } },
          { "metric": "nOffered", "stats": { "count": 877 } },
          { "metric": "nOutbound", "stats": { "count": 29 } },
          { "metric": "nOverSla", "stats": { "count": 373 } },
          { "metric": "nTransferred", "stats": { "count": 634 } },
          { "metric": "tAbandon", "stats": { "max": 219470, "min": 94, "count": 83, "sum": 5750770 } },
          { "metric": "tAcw", "stats": { "max": 65223, "min": 1018, "count": 816, "sum": 13049044 } },
          { "metric": "tAnswered", "stats": { "max": 451577, "min": 2324, "count": 787, "sum": 40279740 } },
          { "metric": "tContacting", "stats": { "max": 1207, "min": 24, "count": 29, "sum": 23762 } },
          { "metric": "tDialing", "stats": { "max": 50873, "min": 1070, "count": 29, "sum": 274630 } },
          { "metric": "tFlowOut", "stats": { "max": 216768, "min": 213423, "count": 7, "sum": 1505756 } },
          { "metric": "tHandle", "stats": { "max": 1040810, "min": 5211, "count": 817, "sum": 131580101 } },
          { "metric": "tHeldComplete", "stats": { "max": 1584, "min": 1584, "count": 1, "sum": 1584 } },
          { "metric": "tTalkComplete", "stats": { "max": 1036889, "min": 1750, "count": 795, "sum": 118231081 } },
          { "metric": "oServiceLevel", "stats": { "ratio": 0.47586206896551725, "numerator": 414, "denominator": 870, "target": 0.8 } },
          { "metric": "tWait", "stats": { "max": 451577, "min": 94, "count": 877, "sum": 47536266 } },
          { "metric": "tShortAbandon", "stats": { "max": 5658, "min": 94, "count": 7, "sum": 15442 } }
        ]
      }
    ]
  },
  {
    "group": {
      "mediaType": "voice",
      "queueId": "069bd957-53dc-40d7-837d-2691a5df6455"
    },
    "data": [
      {
        "interval": "2025-01-25T21:00:00.000Z/2025-02-01T21:00:00.000Z",
        "metrics": [
          { "metric": "nConnected", "stats": { "count": 371 } },
          { "metric": "nError", "stats": { "count": 700 } },
          { "metric": "nOutbound", "stats": { "count": 701 } },
          { "metric": "nOutboundAttempted", "stats": { "count": 671 } },
          { "metric": "tAcw", "stats": { "max": 85000, "min": 2986, "count": 10, "sum": 754669 } },
          { "metric": "tContacting", "stats": { "max": 2962, "min": 15, "count": 701, "sum": 760869 } },
          { "metric": "tDialing", "stats": { "max": 71161, "min": 92, "count": 671, "sum": 19338365 } },
          { "metric": "tHandle", "stats": { "max": 759975, "min": 940, "count": 701, "sum": 43721510 } },
          { "metric": "tTalkComplete", "stats": { "max": 644063, "min": 1853, "count": 371, "sum": 22867607 } }
        ]
      }
    ]
  },
  {
    "group": {
      "mediaType": "voice",
      "queueId": "0c42ff58-231e-4f85-a47c-a81ea703718f"
    },
    "data": [
      {
        "interval": "2025-01-25T21:00:00.000Z/2025-02-01T21:00:00.000Z",
        "metrics": [
          { "metric": "nError", "stats": { "count": 2 } },
          { "metric": "nOffered", "stats": { "count": 47 } },
          { "metric": "tAbandon", "stats": { "max": 835717, "min": 158, "count": 40, "sum": 4234971 } },
          { "metric": "tFlowOut", "stats": { "max": 1087729, "min": 214060, "count": 7, "sum": 3034521 } },
          { "metric": "oServiceLevel", "stats": { "ratio": 0.0, "numerator": 0, "denominator": 40, "target": 0.8 } },
          { "metric": "tWait", "stats": { "max": 1087729, "min": 158, "count": 47, "sum": 7269492 } },
          { "metric": "tShortAbandon", "stats": { "max": 3775, "min": 158, "count": 5, "sum": 9196 } }
        ]
      }
    ]
  },
  {
    "group": {
      "mediaType": "voice",
      "queueId": "16342adc-9cb3-4106-947c-003699a7715d"
    },
    "data": [
      {
        "interval": "2025-01-25T21:00:00.000Z/2025-02-01T21:00:00.000Z",
        "metrics": [
          { "metric": "nBlindTransferred", "stats": { "count": 150 } },
          { "metric": "nError", "stats": { "count": 177 } },
          { "metric": "nOffered", "stats": { "count": 205 } },
          { "metric": "nOverSla", "stats": { "count": 91 } },
          { "metric": "nTransferred", "stats": { "count": 150 } },
          { "metric": "tAbandon", "stats": { "max": 150382, "min": 7485, "count": 18, "sum": 1383114 } },
          { "metric": "tAcw", "stats": { "max": 65245, "min": 1391, "count": 186, "sum": 3177949 } },
          { "metric": "tAnswered", "stats": { "max": 260689, "min": 3069, "count": 181, "sum": 11481661 } },
          { "metric": "tFlowOut", "stats": { "max": 431438, "min": 214186, "count": 6, "sum": 1510940 } },
          { "metric": "tHandle", "stats": { "max": 1265110, "min": 22264, "count": 186, "sum": 54462772 } },
          { "metric": "tTalkComplete", "stats": { "max": 1237726, "min": 4829, "count": 186, "sum": 51284823 } },
          { "metric": "oServiceLevel", "stats": { "ratio": 0.45226130653266333, "numerator": 90, "denominator": 199, "target": 0.8 } },
          { "metric": "tWait", "stats": { "max": 431438, "min": 3069, "count": 205, "sum": 14375715 } },
          { "metric": "tShortAbandon", "stats": { "max": 3775, "min": 158, "count": 5, "sum": 9196 } }
        ]
      }
    ]
  },
  {
    "group": {
      "mediaType": "voice",
      "queueId": "28a9d881-8d9b-4e97-87fb-0a25baa00292"
    },
    "data": [
      {
        "interval": "2025-01-25T21:00:00.000Z/2025-02-01T21:00:00.000Z",
        "metrics": [
          { "metric": "nConnected", "stats": { "count": 151 } },
          { "metric": "nError", "stats": { "count": 370 } },
          { "metric": "nOutbound", "stats": { "count": 363 } },
          { "metric": "nOutboundAttempted", "stats": { "count": 333 } },
          { "metric": "tAcw", "stats": { "max": 65000, "min": 65000, "count": 8, "sum": 520000 } },
          { "metric": "tContacting", "stats": { "max": 3358, "min": 16, "count": 363, "sum": 220109 } },
          { "metric": "tDialing", "stats": { "max": 67651, "min": 150, "count": 333, "sum": 9390512 } },
          { "metric": "tHandle", "stats": { "max": 257568, "min": 64, "count": 363, "sum": 18587299 } },
          { "metric": "tTalkComplete", "stats": { "max": 237026, "min": 248, "count": 151, "sum": 8456678 } }
        ]
      }
    ]
  },
  {
    "group": {
      "mediaType": "voice",
      "queueId": "3276e936-29ae-496b-9bec-4735c61deca0"
    },
    "data": [
      {
        "interval": "2025-01-25T21:00:00.000Z/2025-02-01T21:00:00.000Z",
        "metrics": [
          { "metric": "nBlindTransferred", "stats": { "count": 341 } },
          { "metric": "nError", "stats": { "count": 454 } },
          { "metric": "nOffered", "stats": { "count": 513 } },
          { "metric": "nOverSla", "stats": { "count": 216 } },
          { "metric": "nTransferred", "stats": { "count": 341 } },
          { "metric": "tAbandon", "stats": { "max": 320605, "min": 5122, "count": 37, "sum": 2953106 } },
          { "metric": "tAcw", "stats": { "max": 65284, "min": 1414, "count": 477, "sum": 9647452 } },
          { "metric": "tAnswered", "stats": { "max": 422907, "min": 2455, "count": 475, "sum": 25254043 } },
          { "metric": "tFlowOut", "stats": { "max": 215908, "min": 215908, "count": 1, "sum": 215908 } },
          { "metric": "tHandle", "stats": { "max": 1103802, "min": 5265, "count": 477, "sum": 67896468 } },
          { "metric": "tTalkComplete", "stats": { "max": 1098489, "min": 190, "count": 477, "sum": 58249016 } },
          { "metric": "oServiceLevel", "stats": { "ratio": 0.505859375, "numerator": 259, "denominator": 512, "target": 0.8 } },
          { "metric": "tWait", "stats": { "max": 422907, "min": 2455, "count": 513, "sum": 28423057 } },
          { "metric": "tShortAbandon", "stats": { "max": 5122, "min": 5122, "count": 1, "sum": 5122 } }
        ]
      }
    ]
  },
  {
    "group": {
      "mediaType": "voice",
      "queueId": "4498e44c-cbb0-47c7-9bba-d30dd875f403"
    },
    "data": [
      {
        "interval": "2025-01-25T21:00:00.000Z/2025-02-01T21:00:00.000Z",
        "metrics": [
          { "metric": "nConnected", "stats": { "count": 12 } },
          { "metric": "nError", "stats": { "count": 16 } },
          { "metric": "nOutbound", "stats": { "count": 29 } },
          { "metric": "tAcw", "stats": { "max": 73635, "min": 3709, "count": 29, "sum": 630595 } },
          { "metric": "tContacting", "stats": { "max": 1678, "min": 821, "count": 29, "sum": 30113 } },
          { "metric": "tDialing", "stats": { "max": 63314, "min": 0, "count": 29, "sum": 820068 } },
          { "metric": "tHandle", "stats": { "max": 211990, "min": 8002, "count": 29, "sum": 2566994 } },
          { "metric": "tTalkComplete", "stats": { "max": 168711, "min": 5670, "count": 12, "sum": 1086218 } }
        ]
      }
    ]
  },
  {
    "group": {
      "mediaType": "voice",
      "queueId": "533070ce-5e91-40e5-8060-10d4be6f0d9b"
    },
    "data": [
      {
        "interval": "2025-01-25T21:00:00.000Z/2025-02-01T21:00:00.000Z",
        "metrics": [
          { "metric": "nConnected", "stats": { "count": 96 } },
          { "metric": "nError", "stats": { "count": 155 } },
          { "metric": "nOutbound", "stats": { "count": 156 } },
          { "metric": "nOutboundAttempted", "stats": { "count": 154 } },
          { "metric": "tContacting", "stats": { "max": 60015, "min": 14, "count": 156, "sum": 171075 } },
          { "metric": "tDialing", "stats": { "max": 64295, "min": 253, "count": 154, "sum": 3291069 } },
          { "metric": "tHandle", "stats": { "max": 392470, "min": 1095, "count": 156, "sum": 14868973 } },
          { "metric": "tTalkComplete", "stats": { "max": 386448, "min": 0, "count": 96, "sum": 11406829 } }
        ]
      }
    ]
  },
  {
    "group": {
      "mediaType": "voice",
      "queueId": "5b3fe137-0663-439a-b2d4-c6ac3a323261"
    },
    "data": [
      {
        "interval": "2025-01-25T21:00:00.000Z/2025-02-01T21:00:00.000Z",
        "metrics": [
          { "metric": "nConnected", "stats": { "count": 215 } },
          { "metric": "nError", "stats": { "count": 322 } },
          { "metric": "nOutbound", "stats": { "count": 325 } },
          { "metric": "nOutboundAttempted", "stats": { "count": 324 } },
          { "metric": "tContacting", "stats": { "max": 2380, "min": 16, "count": 325, "sum": 245864 } },
          { "metric": "tDialing", "stats": { "max": 65609, "min": 691, "count": 324, "sum": 7929897 } },
          { "metric": "tHandle", "stats": { "max": 322868, "min": 707, "count": 325, "sum": 23994908 } },
          { "metric": "tTalkComplete", "stats": { "max": 283008, "min": 1616, "count": 215, "sum": 15819147 } }
        ]
      }
    ]
  },
  {
    "group": {
      "mediaType": "voice",
      "queueId": "70e3e115-cbb6-4705-bb4a-91b263b53c06"
    },
    "data": [
      {
        "interval": "2025-01-25T21:00:00.000Z/2025-02-01T21:00:00.000Z",
        "metrics": [
          { "metric": "nConnected", "stats": { "count": 148 } },
          { "metric": "nError", "stats": { "count": 257 } },
          { "metric": "nOutbound", "stats": { "count": 257 } },
          { "metric": "nOutboundAttempted", "stats": { "count": 235 } },
          { "metric": "tAcw", "stats": { "max": 9336, "min": 4882, "count": 2, "sum": 14218 } },
          { "metric": "tContacting", "stats": { "max": 4006, "min": 16, "count": 257, "sum": 83651 } },
          { "metric": "tDialing", "stats": { "max": 64891, "min": 1608, "count": 236, "sum": 6000877 } },
          { "metric": "tHandle", "stats": { "max": 257091, "min": 64, "count": 257, "sum": 14732203 } },
          { "metric": "tTalkComplete", "stats": { "max": 244945, "min": 573, "count": 148, "sum": 8633457 } }
        ]
      }
    ]
  },
  {
    "group": {
      "mediaType": "voice",
      "queueId": "782fa411-e88a-4fcf-95e0-2f837fbd853f"
    },
    "data": [
      {
        "interval": "2025-01-25T21:00:00.000Z/2025-02-01T21:00:00.000Z",
        "metrics": [
          { "metric": "nConnected", "stats": { "count": 31 } },
          { "metric": "nError", "stats": { "count": 61 } },
          { "metric": "nOutbound", "stats": { "count": 63 } },
          { "metric": "tAcw", "stats": { "max": 65000, "min": 65000, "count": 2, "sum": 130000 } },
          { "metric": "tContacting", "stats": { "max": 60004, "min": 20, "count": 63, "sum": 128090 } },
          { "metric": "tDialing", "stats": { "max": 63208, "min": 21, "count": 61, "sum": 1054862 } },
          { "metric": "tHandle", "stats": { "max": 593365, "min": 282, "count": 61, "sum": 4263349 } },
          { "metric": "tTalkComplete", "stats": { "max": 542255, "min": 657, "count": 31, "sum": 2956691 } }
        ]
      }
    ]
  },
  {
    "group": {
      "mediaType": "voice",
      "queueId": "79ad10f3-4ecb-498b-908a-b68797f82cbb"
    },
    "data": [
      {
        "interval": "2025-01-25T21:00:00.000Z/2025-02-01T21:00:00.000Z",
        "metrics": [
          { "metric": "nConnected", "stats": { "count": 891 } },
          { "metric": "nError", "stats": { "count": 1573 } },
          { "metric": "nOutbound", "stats": { "count": 1570 } },
          { "metric": "nOutboundAttempted", "stats": { "count": 1488 } },
          { "metric": "tAcw", "stats": { "max": 65000, "min": 3029, "count": 26, "sum": 1339722 } },
          { "metric": "tContacting", "stats": { "max": 5209, "min": 8, "count": 1570, "sum": 1152248 } },
          { "metric": "tDialing", "stats": { "max": 80262, "min": 0, "count": 1491, "sum": 37379104 } },
          { "metric": "tHandle", "stats": { "max": 572335, "min": 8, "count": 1570, "sum": 101098465 } },
          { "metric": "tHeldComplete", "stats": { "max": 3116, "min": 3116, "count": 1, "sum": 3116 } },
          { "metric": "tTalkComplete", "stats": { "max": 535686, "min": 0, "count": 890, "sum": 61224275 } }
        ]
      }
    ]
  },
  {
    "group": {
      "mediaType": "voice",
      "queueId": "822f5704-bfe3-47a9-bd66-210e00633d41"
    },
    "data": [
      {
        "interval": "2025-01-25T21:00:00.000Z/2025-02-01T21:00:00.000Z",
        "metrics": [
          { "metric": "nConnected", "stats": { "count": 580 } },
          { "metric": "nError", "stats": { "count": 552 } },
          { "metric": "nOutbound", "stats": { "count": 977 } },
          { "metric": "tAcw", "stats": { "max": 300000, "min": 2555, "count": 977, "sum": 79976036 } },
          { "metric": "tContacting", "stats": { "max": 2107, "min": 4, "count": 977, "sum": 58949 } },
          { "metric": "tDialing", "stats": { "max": 69591, "min": 4, "count": 976, "sum": 19628350 } },
          { "metric": "tHandle", "stats": { "max": 1206228, "min": 3454, "count": 977, "sum": 201631492 } },
          { "metric": "tTalkComplete", "stats": { "max": 955530, "min": 224, "count": 580, "sum": 101968157 } }
        ]
      }
    ]
  },
  {
    "group": {
      "mediaType": "voice",
      "queueId": "88936a51-2060-4d7a-9401-9660097c0e80"
    },
    "data": [
      {
        "interval": "2025-01-25T21:00:00.000Z/2025-02-01T21:00:00.000Z",
        "metrics": [
          { "metric": "nBlindTransferred", "stats": { "count": 1157 } },
          { "metric": "nError", "stats": { "count": 1258 } },
          { "metric": "nOffered", "stats": { "count": 1382 } },
          { "metric": "nOverSla", "stats": { "count": 580 } },
          { "metric": "nTransferred", "stats": { "count": 1157 } },
          { "metric": "tAbandon", "stats": { "max": 637304, "min": 249, "count": 74, "sum": 6431206 } },
          { "metric": "tAcw", "stats": { "max": 65258, "min": 1105, "count": 1303, "sum": 17135136 } },
          { "metric": "tAnswered", "stats": { "max": 460127, "min": 2071, "count": 1300, "sum": 70001333 } },
          { "metric": "tFlowOut", "stats": { "max": 431297, "min": 213740, "count": 8, "sum": 1945965 } },
          { "metric": "tHandle", "stats": { "max": 580555, "min": 9843, "count": 1303, "sum": 168921612 } },
          { "metric": "tHeldComplete", "stats": { "max": 1852, "min": 1852, "count": 1, "sum": 1852 } },
          { "metric": "tTalkComplete", "stats": { "max": 574805, "min": 0, "count": 1303, "sum": 151784624 } },
          { "metric": "oServiceLevel", "stats": { "ratio": 0.5240174672489083, "numerator": 720, "denominator": 1374, "target": 0.8 } },
          { "metric": "tWait", "stats": { "max": 637304, "min": 249, "count": 1382, "sum": 78378504 } },
          { "metric": "tShortAbandon", "stats": { "max": 5844, "min": 249, "count": 6, "sum": 18349 } }
        ]
      }
    ]
  },
  {
    "group": {
      "mediaType": "voice",
      "queueId": "92c4908f-eba5-4255-8aef-39e735b44a4f"
    },
    "data": [
      {
        "interval": "2025-01-25T21:00:00.000Z/2025-02-01T21:00:00.000Z",
        "metrics": [
          { "metric": "nBlindTransferred", "stats": { "count": 3 } },
          { "metric": "nConnected", "stats": { "count": 23 } },
          { "metric": "nError", "stats": { "count": 41 } },
          { "metric": "nOffered", "stats": { "count": 31 } },
          { "metric": "nOutbound", "stats": { "count": 34 } },
          { "metric": "nOutboundAttempted", "stats": { "count": 5 } },
          { "metric": "nTransferred", "stats": { "count": 3 } },
          { "metric": "tAcw", "stats": { "max": 65000, "min": 4180, "count": 10, "sum": 199079 } },
          { "metric": "tAnswered", "stats": { "max": 11111, "min": 4833, "count": 4, "sum": 27743 } },
          { "metric": "tContacting", "stats": { "max": 60008, "min": 20, "count": 34, "sum": 84984 } },
          { "metric": "tDialing", "stats": { "max": 62616, "min": 8, "count": 32, "sum": 372367 } },
          { "metric": "tFlowOut", "stats": { "max": 31231, "min": 11851, "count": 27, "sum": 642169 } },
          { "metric": "tHandle", "stats": { "max": 582283, "min": 64, "count": 40, "sum": 8219483 } },
          { "metric": "tTalkComplete", "stats": { "max": 558503, "min": 4161, "count": 29, "sum": 7563053 } },
          { "metric": "oServiceLevel", "stats": { "ratio": 1.0, "numerator": 4, "denominator": 4, "target": 0.8 } },
          { "metric": "tWait", "stats": { "max": 31231, "min": 4833, "count": 31, "sum": 669912 } }
        ]
      }
    ]
  },
  {
    "group": {
      "mediaType": "voice",
      "queueId": "b80290c5-b367-4f9d-9289-4ac8e09eb9cb"
    },
    "data": [
      {
        "interval": "2025-01-25T21:00:00.000Z/2025-02-01T21:00:00.000Z",
        "metrics": [
          { "metric": "nConnected", "stats": { "count": 311 } },
          { "metric": "nError", "stats": { "count": 286 } },
          { "metric": "nOutbound", "stats": { "count": 608 } },
          { "metric": "tAcw", "stats": { "max": 75226, "min": 2428, "count": 607, "sum": 12547440 } },
          { "metric": "tContacting", "stats": { "max": 2423, "min": 13, "count": 608, "sum": 373787 } },
          { "metric": "tDialing", "stats": { "max": 70793, "min": 0, "count": 608, "sum": 15950732 } },
          { "metric": "tHandle", "stats": { "max": 1408160, "min": 1499, "count": 608, "sum": 64812124 } },
          { "metric": "tTalkComplete", "stats": { "max": 1391143, "min": 0, "count": 311, "sum": 35940165 } }
        ]
      }
    ]
  },
  {
    "group": {
      "mediaType": "voice",
      "queueId": "c42c2ed4-794d-4b62-af97-c3afe46d1678"
    },
    "data": [
      {
        "interval": "2025-01-25T21:00:00.000Z/2025-02-01T21:00:00.000Z",
        "metrics": [
          { "metric": "nBlindTransferred", "stats": { "count": 1 } },
          { "metric": "nConnected", "stats": { "count": 617 } },
          { "metric": "nError", "stats": { "count": 1589 } },
          { "metric": "nOutbound", "stats": { "count": 1586 } },
          { "metric": "nOutboundAttempted", "stats": { "count": 1510 } },
          { "metric": "nTransferred", "stats": { "count": 1 } },
          { "metric": "tAcw", "stats": { "max": 65000, "min": 2451, "count": 17, "sum": 873290 } },
          { "metric": "tContacting", "stats": { "max": 4939, "min": 8, "count": 1586, "sum": 980869 } },
          { "metric": "tDialing", "stats": { "max": 92979, "min": 16, "count": 1510, "sum": 42411384 } },
          { "metric": "tHandle", "stats": { "max": 427393, "min": 8, "count": 1587, "sum": 80515629 } },
          { "metric": "tTalkComplete", "stats": { "max": 413854, "min": 141, "count": 618, "sum": 36250086 } }
        ]
      }
    ]
  },
  {
    "group": {
      "mediaType": "voice",
      "queueId": "ce6705ad-61c8-4b74-9308-68a38782d706"
    },
    "data": [
      {
        "interval": "2025-01-25T21:00:00.000Z/2025-02-01T21:00:00.000Z",
        "metrics": [
          { "metric": "nConnected", "stats": { "count": 28 } },
          { "metric": "nError", "stats": { "count": 53 } },
          { "metric": "nOutbound", "stats": { "count": 51 } },
          { "metric": "nOutboundAttempted", "stats": { "count": 45 } },
          { "metric": "tAcw", "stats": { "max": 65000, "min": 65000, "count": 1, "sum": 65000 } },
          { "metric": "tContacting", "stats": { "max": 2873, "min": 12, "count": 51, "sum": 27741 } },
          { "metric": "tDialing", "stats": { "max": 64199, "min": 5600, "count": 45, "sum": 1321781 } },
          { "metric": "tHandle", "stats": { "max": 249256, "min": 12, "count": 51, "sum": 3326712 } },
          { "metric": "tTalkComplete", "stats": { "max": 220574, "min": 12890, "count": 28, "sum": 1912190 } }
        ]
      }
    ]
  },
  {
    "group": {
      "mediaType": "voice",
      "queueId": "d02c94be-ff67-4bca-8127-027a0ffc4b34"
    },
    "data": [
      {
        "interval": "2025-01-25T21:00:00.000Z/2025-02-01T21:00:00.000Z",
        "metrics": [
          { "metric": "nConnected", "stats": { "count": 177 } },
          { "metric": "nError", "stats": { "count": 448 } },
          { "metric": "nOutbound", "stats": { "count": 448 } },
          { "metric": "nOutboundAttempted", "stats": { "count": 430 } },
          { "metric": "tAcw", "stats": { "max": 65000, "min": 15504, "count": 14, "sum": 849335 } },
          { "metric": "tContacting", "stats": { "max": 6770, "min": 12, "count": 448, "sum": 253515 } },
          { "metric": "tDialing", "stats": { "max": 71952, "min": 748, "count": 430, "sum": 11033561 } },
          { "metric": "tHandle", "stats": { "max": 366987, "min": 12, "count": 448, "sum": 22709853 } },
          { "metric": "tHeldComplete", "stats": { "max": 1365, "min": 1365, "count": 1, "sum": 1365 } },
          { "metric": "tTalkComplete", "stats": { "max": 348227, "min": 1705, "count": 177, "sum": 10572077 } }
        ]
      }
    ]
  },
  {
    "group": {
      "mediaType": "voice",
      "queueId": "ef2ab0ec-13ba-42fe-b91e-e4c7907a0387"
    },
    "data": [
      {
        "interval": "2025-01-25T21:00:00.000Z/2025-02-01T21:00:00.000Z",
        "metrics": [
          { "metric": "nConnected", "stats": { "count": 191 } },
          { "metric": "nError", "stats": { "count": 332 } },
          { "metric": "nOutbound", "stats": { "count": 336 } },
          { "metric": "nOutboundAttempted", "stats": { "count": 330 } },
          { "metric": "tAcw", "stats": { "max": 65000, "min": 2881, "count": 8, "sum": 222588 } },
          { "metric": "tContacting", "stats": { "max": 45449, "min": 16, "count": 336, "sum": 338982 } },
          { "metric": "tDialing", "stats": { "max": 68651, "min": 851, "count": 335, "sum": 8226107 } },
          { "metric": "tHandle", "stats": { "max": 495098, "min": 949, "count": 335, "sum": 20940722 } },
          { "metric": "tTalkComplete", "stats": { "max": 475878, "min": 2218, "count": 191, "sum": 12198737 } }
        ]
      }
    ]
  },
  {
    "group": {
      "mediaType": "voice",
      "queueId": "fc24fb0d-55ca-40a6-8596-a47feae09fe3"
    },
    "data": [
      {
        "interval": "2025-01-25T21:00:00.000Z/2025-02-01T21:00:00.000Z",
        "metrics": [
          { "metric": "nBlindTransferred", "stats": { "count": 371 } },
          { "metric": "nError", "stats": { "count": 460 } },
          { "metric": "nOffered", "stats": { "count": 549 } },
          { "metric": "nOverSla", "stats": { "count": 212 } },
          { "metric": "nTransferred", "stats": { "count": 371 } },
          { "metric": "tAbandon", "stats": { "max": 458221, "min": 302, "count": 71, "sum": 5703773 } },
          { "metric": "tAcw", "stats": { "max": 65235, "min": 1312, "count": 478, "sum": 8124379 } },
          { "metric": "tAnswered", "stats": { "max": 319694, "min": 2623, "count": 476, "sum": 23497734 } },
          { "metric": "tFlowOut", "stats": { "max": 216779, "min": 215901, "count": 2, "sum": 432680 } },
          { "metric": "tHandle", "stats": { "max": 559839, "min": 8057, "count": 478, "sum": 77211518 } },
          { "metric": "tTalkComplete", "stats": { "max": 541389, "min": 4690, "count": 478, "sum": 69087139 } },
          { "metric": "oServiceLevel", "stats": { "ratio": 0.4826325411334552, "numerator": 264, "denominator": 547, "target": 0.8 } },
          { "metric": "tWait", "stats": { "max": 458221, "min": 302, "count": 549, "sum": 29634187 } },
          { "metric": "tShortAbandon", "stats": { "max": 3326, "min": 302, "count": 5, "sum": 9101 } }
        ]
      }
    ]
  }
]

export default function DataViewQueuePerformance() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTimeRange, setSelectedTimeRange] = useState('last_24_hours')
  const [selectedMediaTypes, setSelectedMediaTypes] = useState<string[]>(['all'])
  const [selectedQueues, setSelectedQueues] = useState<string[]>(['all'])
  const [queueSearchTerm, setQueueSearchTerm] = useState('')
  const [availableQueues, setAvailableQueues] = useState<any[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [showDateRangeDialog, setShowDateRangeDialog] = useState(false)
  const [dateRangeError, setDateRangeError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Custom date range state
  const [customDateRange, setCustomDateRange] = useState<{
    startDate: Date | undefined
    endDate: Date | undefined
    startTime: string
    endTime: string
  }>({
    startDate: undefined,
    endDate: undefined,
    startTime: '00:00',
    endTime: '23:59'
  })

  // API data fetching
  const [queueData, setQueueData] = useState<any[]>([])

  const fetchQueueData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/queue-performance')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setQueueData(data.queuePerformance.queues)
    } catch (error) {
      console.error('Failed to fetch queue data:', error)
      toast.error('Failed to fetch queue data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQueueData()
  }, [])

  // Date range helper functions
  const formatTime = useCallback((time: string) => {
    const [hours, minutes] = time.split(':')
    return `${hours}:${minutes}`
  }, [])

  const getFormattedDateRangeDisplay = useCallback(() => {
    if (selectedTimeRange === 'custom' && customDateRange.startDate && customDateRange.endDate) {
      const start = format(customDateRange.startDate, 'MMM dd, yyyy')
      const end = format(customDateRange.endDate, 'MMM dd, yyyy')
      return `${start} - ${end}`
    }

    // For preset ranges, return the label
    const option = timeRangeOptions.find(opt => opt.value === selectedTimeRange)
    return option ? option.label : 'Select range'
  }, [selectedTimeRange, customDateRange])

  const validateDateRange = useCallback((range: typeof customDateRange) => {
    if (!range.startDate || !range.endDate) {
      setDateRangeError('Please select both start and end dates')
      return false
    }

    if (range.startDate > range.endDate) {
      setDateRangeError('Start date must be before end date')
      return false
    }

    setDateRangeError(null)
    return true
  }, [])

  const applyCustomDateRange = useCallback(() => {
    if (validateDateRange(customDateRange)) {
      setShowDateRangeDialog(false)
      setSelectedTimeRange('custom')
      toast.success('Custom date range applied successfully')
    }
  }, [customDateRange, validateDateRange])

  // Date range handlers
  const handleCustomDateRangeChange = (range: {
    startDate: Date | undefined
    endDate: Date | undefined
    startTime: string
    endTime: string
  }) => {
    setCustomDateRange(range)
  }

  const handleDateRangeErrorChange = (error: string | null) => {
    setDateRangeError(error)
  }

  const handleRefresh = () => {
    fetchQueueData()
    toast.success('Queue performance data refreshed successfully')
  }

  const handleApplyDateRange = () => {
    // This will be called when the date range is applied
    handleRefresh()
  }

  // Date Range Dialog Content - Using the sophisticated DateRangeDialog component
  const dateRangeDialogContent = (
    <DateRangeDialog
      showDateRangeDialog={showDateRangeDialog}
      customDateRange={customDateRange}
      dateRangeError={dateRangeError}
      selectedTimeRange={selectedTimeRange}
      onDateRangeDialogChange={setShowDateRangeDialog}
      onCustomDateRangeChange={handleCustomDateRangeChange}
      onSelectedTimeRangeChange={setSelectedTimeRange}
      onDateRangeErrorChange={handleDateRangeErrorChange}
      onApplyDateRange={handleApplyDateRange}
      formatTime={formatTime}
      onFetchDashboardData={handleRefresh}
      isLoading={loading}
    />
  )
  const processedData: ProcessedQueueData[] = queueData.map(queue => {
    // Transform API data to match ProcessedQueueData interface
    return {
      queueId: queue.id,
      queueName: queue.name,
      mediaType: 'voice',
      totalCalls: queue.totalCalls,
      connectedCalls: queue.answeredCalls,
      errorCalls: queue.totalCalls - queue.answeredCalls,
      offeredCalls: queue.totalCalls,
      abandonedCalls: queue.abandonedCalls,
      transferredCalls: 0,
      averageHandleTime: queue.averageHandleTime,
      averageTalkTime: queue.averageHandleTime, // Using handle time as talk time
      averageWaitTime: queue.averageWaitTime,
      averageHoldTime: '0:00',
      averageAcwTime: '0:00',
      serviceLevel: parseInt(queue.serviceLevel),
      serviceLevelTarget: 80,
      overSla: 0,
      utilization: 75,
      status: queue.status === 'fair' ? 'fair' : queue.status === 'excellent' ? 'excellent' : 'good',
      answerRate: Math.round((queue.answeredCalls / queue.totalCalls) * 100),
      abandonRate: Math.round((queue.abandonedCalls / queue.totalCalls) * 100),
      holdCount: 0,
      transferCount: 0
    }
  })

  // Filter data (search by queue name only)
  const filteredData = processedData
    .filter(queue =>
      queue.queueName.toLowerCase().includes(searchTerm.toLowerCase())
    )

  // Transform filteredData to match QueueDataTable interface
  const transformedQueueData = filteredData.map(queue => {
    // Parse time strings back to seconds for calculations
    const parseTimeToSeconds = (timeStr: string): number => {
      const [minutes, seconds] = timeStr.split(':').map(Number)
      return minutes * 60 + seconds
    }

    return {
      queueId: queue.queueId,
      queueName: queue.queueName,
      offered: queue.offeredCalls,
      answered: queue.answerRate,
      abandoned: queue.abandonRate,
      asa: parseTimeToSeconds(queue.averageWaitTime),
      serviceLevel: queue.serviceLevel,
      avgWait: parseTimeToSeconds(queue.averageWaitTime),
      avgHandle: parseTimeToSeconds(queue.averageHandleTime),
      avgTalk: parseTimeToSeconds(queue.averageTalkTime),
      avgHold: parseTimeToSeconds(queue.averageHoldTime),
      avgACW: parseTimeToSeconds(queue.averageAcwTime),
      hold: queue.holdCount,
      transfer: queue.transferCount
    }
  })

  const getPerformanceColor = (value: number, type: 'serviceLevel' | 'utilization' = 'serviceLevel') => {
    if (type === 'serviceLevel') {
      if (value >= 80) return 'text-green-600'
      if (value >= 60) return 'text-yellow-600'
      return 'text-red-600'
    } else {
      if (value >= 70) return 'text-green-600'
      if (value >= 50) return 'text-yellow-600'
      return 'text-red-600'
    }
  }

  const handleExportData = () => {
    toast.success('Queue performance data exported successfully')
  }





  // Calculate totals
  const totals = processedData.reduce((acc, queue) => ({
    totalCalls: acc.totalCalls + queue.totalCalls,
    connectedCalls: acc.connectedCalls + queue.connectedCalls,
    errorCalls: acc.errorCalls + queue.errorCalls,
    offeredCalls: acc.offeredCalls + queue.offeredCalls,
    abandonedCalls: acc.abandonedCalls + queue.abandonedCalls,
    transferredCalls: acc.transferredCalls + queue.transferredCalls,
    avgServiceLevel: acc.avgServiceLevel + queue.serviceLevel,
    avgUtilization: acc.avgUtilization + queue.utilization,
    avgAnswerRate: acc.avgAnswerRate + queue.answerRate,
    avgAbandonRate: acc.avgAbandonRate + queue.abandonRate,
    totalHold: acc.totalHold + queue.holdCount,
    totalTransfer: acc.totalTransfer + queue.transferCount
  }), {
    totalCalls: 0,
    connectedCalls: 0,
    errorCalls: 0,
    offeredCalls: 0,
    abandonedCalls: 0,
    transferredCalls: 0,
    avgServiceLevel: 0,
    avgUtilization: 0,
    avgAnswerRate: 0,
    avgAbandonRate: 0,
    totalHold: 0,
    totalTransfer: 0
  })

  const avgServiceLevel = processedData.length > 0 ? Math.round(totals.avgServiceLevel / processedData.length) : 0
  const avgUtilization = processedData.length > 0 ? Math.round(totals.avgUtilization / processedData.length) : 0
  const avgAnswerRate = processedData.length > 0 ? Math.round(totals.avgAnswerRate / processedData.length) : 0
  const avgAbandonRate = processedData.length > 0 ? Math.round(totals.avgAbandonRate / processedData.length) : 0

  // Initialize available queues
  useEffect(() => {
    setAvailableQueues([
      { id: 'sales', name: 'Sales Queue', mediaTypes: ['voice', 'chat'] },
      { id: 'support', name: 'Support Queue', mediaTypes: ['voice', 'email', 'chat'] },
      { id: 'billing', name: 'Billing Queue', mediaTypes: ['voice', 'email'] },
      { id: 'technical', name: 'Technical Support', mediaTypes: ['voice', 'chat'] },
      { id: 'retention', name: 'Customer Retention', mediaTypes: ['voice'] }
    ])
  }, [])

  const handleMediaTypeToggle = (value: string) => {
    if (value === 'all') {
      setSelectedMediaTypes(['all'])
    } else {
      setSelectedMediaTypes(prev => {
        const newTypes = prev.filter(type => type !== 'all')
        if (newTypes.includes(value)) {
          return newTypes.length > 0 ? newTypes.filter(type => type !== value) : ['all']
        } else {
          return [...newTypes, value]
        }
      })
    }
  }

  const handleQueueToggle = (value: string) => {
    if (value === 'all') {
      setSelectedQueues(['all'])
    } else {
      setSelectedQueues(prev => {
        const newQueues = prev.filter(queue => queue !== 'all')
        if (newQueues.includes(value)) {
          return newQueues.length > 0 ? newQueues.filter(queue => queue !== value) : ['all']
        } else {
          return [...newQueues, value]
        }
      })
    }
  }

  const getFilteredQueues = () => {
    return availableQueues.filter(queue =>
      queue.name.toLowerCase().includes(queueSearchTerm.toLowerCase())
    )
  }

  const resetFilters = () => {
    setSelectedTimeRange('last_24_hours')
    setSelectedMediaTypes(['all'])
    setSelectedQueues(['all'])
    setQueueSearchTerm('')
    setDateRangeError(null)
  }

  const getMediaTypeIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'voice': return <Phone className="h-3 w-3" />
      case 'chat': return <MessageSquare className="h-3 w-3" />
      case 'email': return <RotateCcw className="h-3 w-3" />
      case 'callback': return <RefreshCw className="h-3 w-3" />
      default: return <Users className="h-3 w-3" />
    }
  }

  const getMediaTypeColor = (mediaType: string) => {
    switch (mediaType) {
      case 'voice': return 'bg-blue-100 text-blue-800'
      case 'chat': return 'bg-green-100 text-green-800'
      case 'email': return 'bg-purple-100 text-purple-800'
      case 'callback': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSelectedMediaTypesLabel = () => {
    if (selectedMediaTypes.includes('all')) return 'All Media'
    return selectedMediaTypes.join(', ')
  }

  const getSelectedQueuesLabel = () => {
    if (selectedQueues.includes('all')) return 'All Queues'
    return selectedQueues.map(id => availableQueues.find(q => q.id === id)?.name || id).join(', ')
  }



  return (
    <DashboardLayoutSimple>


      <div className="p-6 space-y-6">
        {/* Header with Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-bold tracking-tight">Queues Performance</h1>
            <p className="text-muted-foreground">
              Comprehensive queue performance metrics and analytics
            </p>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="cursor-pointer transition-all duration-200 hover:scale-105"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="cursor-pointer transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={loading}
              className="cursor-pointer transition-all duration-200 hover:scale-105"
            > <Download className="h-4 w-4 mr-2" /> Export</Button>
          </div>
        </div>

        {/* Active Filters Display - Show on top in one line */}
        <div className="flex flex-wrap gap-2 items-center p-1 mb-1 bg-muted/50 rounded-lg">
          <span className="text-sm font-bold text-muted-foreground">Active Filters</span>

          {/* Date Range Section */}
          <CalendarIcon className="h-4 w-4 ml-2 text-muted-foreground flex-shrink-0" />
          <span className="text-sm font-medium text-muted-foreground">Date:</span>
          <Badge variant="secondary">
            {selectedTimeRange === 'custom' && customDateRange.startDate && customDateRange.endDate ? (
              <span>
                {(() => {
                  const startDateTime = new Date(customDateRange.startDate);
                  const endDateTime = new Date(customDateRange.endDate);
                  const [startHour, startMinute, startSecond] = customDateRange.startTime.split(':').map(Number);
                  const [endHour, endMinute, endSecond] = customDateRange.endTime.split(':').map(Number);

                  startDateTime.setHours(startHour, startMinute, startSecond || 0);
                  endDateTime.setHours(endHour, endMinute, endSecond || 59);

                  return `${format(startDateTime, 'MMM dd, yyyy HH:mm:ss')} - ${format(endDateTime, 'MMM dd, yyyy HH:mm:ss')}`;
                })()}
              </span>
            ) : (
              timeRangeOptions.find(opt => opt.value === selectedTimeRange)?.label || 'Select range'
            )}
          </Badge>

          {/* Media Type Section */}
          <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm font-medium text-muted-foreground">Media Type:</span>

          {/* Individual Media Type Badges */}
          {selectedMediaTypes.includes('all') ? (
            <Badge variant="secondary">
              All Media
            </Badge>
          ) : (
            <div className="flex gap-1">
              {selectedMediaTypes.map(type => (
                <Badge key={type} variant="outline" className={getMediaTypeColor(type)}>
                  <div className="flex items-center gap-1">
                    {getMediaTypeIcon(type)}
                    {type}
                  </div>
                </Badge>
              ))}
            </div>
          )}

          {/* Queues Section */}
          <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm font-medium text-muted-foreground">Queues:</span>

          {/* Individual Queue Badges */}
          {selectedQueues.includes('all') ? (
            <Badge variant="secondary">
              All Queues
            </Badge>
          ) : (
            <div className="flex gap-1">
              {selectedQueues.map(queueId => {
                const queue = availableQueues.find(q => q.id === queueId)
                return (
                  <Badge key={queueId} variant="outline" className="bg-gray-100 text-gray-800">
                    {queue?.name || queueId}
                  </Badge>
                )
              })}
            </div>
          )}

          {/* Reset Filters Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="ml-auto h-6 px-2 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        </div>

        {/* Queue Performance Table */}
        <div className="space-y-4">
          <QueueDataTable data={transformedQueueData} />
        </div>
      </div>


      {/* Filter Panel */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-background border-l border-border transform transition-transform duration-300 ease-in-out z-50 ${showFilters ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(false)}
              className="cursor-pointer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Time Range
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Time Range</label>
                <Select value={selectedTimeRange} onValueChange={(value) => {
                  if (value === 'custom') {
                    setShowDateRangeDialog(true)
                  }
                  setSelectedTimeRange(value)
                }}>
                  <SelectTrigger>
                    <SelectValue>
                      {selectedTimeRange === 'custom' && customDateRange.startDate && customDateRange.endDate
                        ? `${format(customDateRange.startDate, 'MMM dd, yyyy')} - ${format(customDateRange.endDate, 'MMM dd, yyyy')}`
                        : timeRangeOptions.find(opt => opt.value === selectedTimeRange)?.label || 'Select range'
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {timeRangeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Range Details */}
              <div className="space-y-3 border-t pt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Start:</span>
                    <span className="font-medium">
                      {customDateRange.startDate
                        ? `${format(customDateRange.startDate, 'MMM dd, yyyy')} at ${formatTime(customDateRange.startTime)}`
                        : 'Not selected'
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">End:</span>
                    <span className="font-medium">
                      {customDateRange.endDate
                        ? `${format(customDateRange.endDate, 'MMM dd, yyyy')} at ${formatTime(customDateRange.endTime)}`
                        : 'Not selected'
                      }
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs text-muted-foreground">Duration:</span>
                  <Badge variant="secondary" className="text-xs">
                    {customDateRange.startDate && customDateRange.endDate ? (() => {
                      const startDateTime = new Date(customDateRange.startDate)
                      const endDateTime = new Date(customDateRange.endDate)
                      const [startHour, startMinute] = customDateRange.startTime.split(':').map(Number)
                      const [endHour, endMinute] = customDateRange.endTime.split(':').map(Number)

                      startDateTime.setHours(startHour, startMinute, 0, 0)
                      endDateTime.setHours(endHour, endMinute, 59, 999)

                      const durationMs = endDateTime - startDateTime
                      const durationDays = Math.floor(durationMs / (1000 * 60 * 60 * 24))
                      const durationHours = Math.floor((durationMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

                      if (durationDays > 0) {
                        return `${durationDays} day${durationDays !== 1 ? 's' : ''}${durationHours > 0 ? `, ${durationHours} hr${durationHours !== 1 ? 's' : ''}` : ''}`
                      } else {
                        return `${durationHours} hour${durationHours !== 1 ? 's' : ''}`
                      }
                    })() : 'Select dates to calculate'}
                  </Badge>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowDateRangeDialog(true)
                  }}
                  className="w-full cursor-pointer"
                >
                  <CalendarIcon className="h-3 w-3 mr-2" />
                  Edit Range
                </Button>
              </div>

              {/* Custom Date Range Picker */}
              {selectedTimeRange === 'custom' && (!customDateRange.startDate || !customDateRange.endDate) && (
                <div className="space-y-4 border-t pt-4">
                  <Button
                    onClick={() => {
                      setShowDateRangeDialog(true)
                    }}
                    className="w-full flex items-center gap-2 cursor-pointer"
                    variant="outline"
                  >
                    <CalendarIcon className="h-4 w-4" />
                    Configure Date Range
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Queues
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Queues</label>
                <div className="space-y-3">
                  {/* Search Input */}
                  <div className="relative">
                    <Input
                      placeholder="Search queues..."
                      value={queueSearchTerm}
                      onChange={(e) => setQueueSearchTerm(e.target.value)}
                      className="pr-8"
                    />
                    {queueSearchTerm && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-6 w-6 p-0 cursor-pointer"
                        onClick={() => setQueueSearchTerm('')}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  {/* All Queues Option */}
                  <Button
                    variant={selectedQueues.includes('all') ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleQueueToggle('all')}
                    className="w-full justify-start cursor-pointer"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    All Queues
                  </Button>

                  {/* Queue List */}
                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {getFilteredQueues().map(queue => (
                      <Button
                        key={queue.id}
                        variant={selectedQueues.includes(queue.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleQueueToggle(queue.id)}
                        className="w-full justify-start cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          {selectedQueues.includes(queue.id) ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <span className="h-4 w-4 border border-gray-300 rounded-full" />
                          )}
                          <span className="text-sm">{queue.name}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Media Type
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Media Types</label>
                <div className="grid grid-cols-2 gap-2">
                  {mediaTypeOptions.map(option => (
                    <Button
                      key={option.value}
                      variant={selectedMediaTypes.includes(option.value) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleMediaTypeToggle(option.value)}
                      className="justify-start cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        {getMediaTypeIcon(option.value)}
                        {option.label}
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  handleRefresh()
                  setShowFilters(false)
                }}
                className="w-full cursor-pointer"
              >
                <RotateCw className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="w-full cursor-pointer"
              >
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Overlay for mobile */}
      {showFilters && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setShowFilters(false)}
        />
      )}

      {/* Date Range Dialog */}
      <Dialog open={showDateRangeDialog} onOpenChange={setShowDateRangeDialog}>
        {dateRangeDialogContent}
      </Dialog>

    </DashboardLayoutSimple>
  )
}