'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  const links = [
    { href: '/programmation', label: 'Programmation' },
    { href: '/historique', label: 'Historique' },
    { href: '/profil', label: 'Profil' },
  ]

  return (
    <nav className="flex gap-6 font-medium">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`pb-1 border-b-2 ${
            pathname === href
              ? 'text-primary border-primary'
              : 'text-black-500 border-transparent hover:border-black-300'
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}
