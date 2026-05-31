import { useState, useCallback } from 'react'
import type { HistoryItem } from '../types'
import { HISTORY_KEY } from '../lib/constants'

function loadAll(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useHistory() {
  const [items, setItems] = useState<HistoryItem[]>(loadAll)

  const add = useCallback((item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const entry: HistoryItem = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    }
    setItems((prev) => {
      const next = [entry, ...prev].slice(0, 20)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const clear = useCallback(() => {
    localStorage.removeItem(HISTORY_KEY)
    setItems([])
  }, [])

  const remove = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { items, add, clear, remove }
}
