"use client";

import Link from "next/link";
import { supabase } from '@/app/lib/supabase/supabase'
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Trophy, User, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Routes où la navbar ne doit pas apparaître
  const hiddenRoutes = ["/", "/landing", "/login", "/signup", "/completeProfile"];
  if (hiddenRoutes.includes(pathname)) return null;

  const handleLogout = async () => {
    // si tu utilises Supabase :
    await supabase.auth.signOut();
    router.push("/landing");
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Trophy className="h-8 w-8 text-[#170647]" />
            <span className="text-2xl font-bold text-gray-900">
              SmashUp
            </span>
          </Link>

          {/* Menu desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/tournoisList"
              className={`hover:text-[#170647] ${
                pathname === "/tournoisList" ? "text-[#170647] font-medium" : "text-gray-700"
              }`}
            >
              Tournois
            </Link>
            <Link
              href="/scheduling"
              className={`hover:text-[#170647] ${
                pathname === "/scheduling" ? "text-[#170647] font-medium" : "text-gray-700"
              }`}
            >
              Planification
            </Link>
            <Link
              href="/scheduled"
              className={`hover:text-[#170647] ${
                pathname === "/scheduled" ? "text-[#170647] font-medium" : "text-gray-700"
              }`}
            >
              Mes tournois
            </Link>
            <Link
              href="/analysis"
              className={`hover:text-[#170647] ${
                pathname === "/analysis" ? "text-[#170647] font-medium" : "text-gray-700"
              }`}
            >
              Analyse
            </Link>
            <Link href="/profile">
              <User className="h-5 w-5 text-gray-700 hover:text-[#170647]" />
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          {/* Bouton menu mobile */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 flex flex-col space-y-4">
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              Accueil
            </Link>
            <Link href="/tournoisList" onClick={() => setMobileMenuOpen(false)}>
              Tournois
            </Link>
            <Link href="/scheduling" onClick={() => setMobileMenuOpen(false)}>
              Planification
            </Link>
            <Link href="/scheduled" onClick={() => setMobileMenuOpen(false)}>
              Mes tournois
            </Link>
            <Link href="/analysis" onClick={() => setMobileMenuOpen(false)}>
              Analyse
            </Link>
            <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
              Profil
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
