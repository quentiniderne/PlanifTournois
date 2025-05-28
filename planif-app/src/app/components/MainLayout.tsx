// app/components/MainLayout.tsx

type MainLayoutProps = {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </div>
  )
}
