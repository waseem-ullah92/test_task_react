import { Badge } from '@/components/ui/Badge'

type StockBadgeProps = {
  stock: number
}

export function StockBadge({ stock }: StockBadgeProps) {
  if (stock === 0) return <Badge variant="destructive">Out of Stock</Badge>
  if (stock <= 5) return <Badge variant="warning">Low Stock</Badge>
  return <Badge variant="success">In Stock</Badge>
}
