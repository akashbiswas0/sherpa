"use client";

import { useCompareStore } from "@/store/compareStore";

export function useCompare() {
  const { selectedIds, toggle, clear, isSelected, isFull } = useCompareStore();

  return {
    selectedIds,
    toggle,
    clear,
    isSelected,
    isFull,
    count: selectedIds.length,
    isVisible: selectedIds.length >= 2,
  };
}
