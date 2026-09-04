import { Sidebar } from './Sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-ivory flex">
      <Sidebar />
      <main className="flex-1 ml-60 p-8 lg:p-12">
        {children}
      </main>
    </div>
  )
}
