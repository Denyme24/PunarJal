"use client";

import { motion } from "framer-motion";
import { Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navLinks = [
    { href: "/map", label: "MAP VIEW" },
    { href: "/simulation", label: "SIMULATION" },
    { href: "/iot-sensors", label: "IOT SENSORS" },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-2xl border-b border-white/5"
    >
      <div className="container mx-auto px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="group">
            <span className="text-2xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent tracking-tight hover:from-cyan-200 hover:via-blue-200 hover:to-white transition-all duration-300">
              AquaRenew
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4">
            <nav className="flex items-center gap-2">
              {navLinks.map((link, index) => (
                <Link key={link.href} href={link.href}>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="relative px-5 py-2 text-xs font-semibold tracking-wider text-white/70 hover:text-white transition-colors group cursor-pointer"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 group-hover:w-full transition-all duration-500 ease-out" />
                  </motion.div>
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            {isAuthenticated && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 p-0 hover:from-cyan-600 hover:to-blue-700"
                  >
                    <User className="h-4 w-4 text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.organizationName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.organizationEmail}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-4 pt-4 border-t border-white/10"
          >
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                >
                  {link.label}
                </div>
              </Link>
            ))}
            {isAuthenticated && user && (
              <>
                <div className="px-4 py-3 border-t border-white/10 mt-2">
                  <p className="text-xs text-white/60 mb-1">Signed in as</p>
                  <p className="text-sm font-medium text-white">
                    {user.organizationName}
                  </p>
                  <p className="text-xs text-white/60">
                    {user.organizationEmail}
                  </p>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </button>
              </>
            )}
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
