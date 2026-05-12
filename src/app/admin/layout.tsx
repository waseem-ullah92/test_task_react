import type { Metadata } from 'next'
import { AdminSidebar } from '@/components/layout/AdminSidebar'

export const metadata: Metadata = {
  title: {
    default: 'Admin',
    template: '%s | Admin – ACS Store',
  },
}

// Admin routes always serve fresh data — skip Next.js cache entirely
export const dynamic = 'force-dynamic'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
