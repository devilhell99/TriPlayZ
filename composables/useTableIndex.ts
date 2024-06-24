import { usePaginationStore } from '~~/stores/pagination'

export function useTableIndex(index: number) {
  const paginationStore = usePaginationStore()

  const page = paginationStore.page || 1
  const take = paginationStore.take || 10
  return (page - 1) * take + index + 1
}
