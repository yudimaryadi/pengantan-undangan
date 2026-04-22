import { WeddingApp } from '@/components/WeddingApp'
import { weddingData } from '@/lib/weddingData'

// Requirements: 1.1, 13.3

export default function Page() {
  return <WeddingApp data={weddingData} />
}
