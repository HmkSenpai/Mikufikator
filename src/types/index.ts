export interface HistoryItem {
  id: string
  source: string
  result: string
  prompt: string
  timestamp: number
}

export type Status = 'idle' | 'loading' | 'success' | 'error'
