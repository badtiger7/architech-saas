"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Bell,
  Settings,
  LogOut,
  User,
  Calendar,
  FolderOpen,
  Archive,
  BookOpen,
  LayoutDashboard,
  Menu,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Timeline", href: "/timeline", icon: Calendar },
    { name: "Drive", href: "/drive", icon: FolderOpen },
    { name: "Journal", href: "/journal", icon: BookOpen },
    { name: "Archive", href: "/archive", icon: Archive },
  ]

  return (
    <nav className="border-b-2 border-black/10 sticky top-0 z-40 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-16">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - Nike Style */}
          <Link href="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-sand-500 text-white hover:bg-sand-600 flex items-center justify-center transition-all rounded-lg">
              <span className="font-black text-sm md:text-base">A</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black tracking-tighter text-black">
                ARCHITECH
              </span>
              <span className="text-[0.65rem] text-sand-600 font-medium">
                MOROCCO
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <Button 
                    variant="ghost"
                    className={`rounded-lg border-2 transition-all font-medium tracking-wide text-sm px-4 py-2 h-auto ${
                      isActive 
                        ? "bg-sand-500 text-white border-sand-500 hover:bg-sand-600 hover:text-white [&_svg]:text-white [&_svg]:hover:text-white" 
                        : "text-black/60 border-transparent hover:border-sand-200 hover:text-black hover:bg-transparent"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Notifications */}
            <Link href="/notifications">
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative rounded-lg border-2 border-transparent hover:border-black/20 text-black/60 hover:text-black transition-all h-10 w-10 p-0"
              >
                <Bell className="h-4 w-4 md:h-5 md:w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-black text-white border-2 border-black rounded-full">
                  3
                </Badge>
              </Button>
            </Link>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-10 w-10 rounded-lg border-2 border-transparent hover:border-black/20 p-0 transition-all"
                >
                  <Avatar className="h-10 w-10 border-2 border-black/10 rounded-full">
                    <AvatarImage src="/placeholder-user.jpg" alt="@username" />
                    <AvatarFallback className="bg-black text-white font-black rounded-full">
                      JD
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-56 bg-white border-2 border-black shadow-lg rounded-lg" 
                align="end" 
                forceMount
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-black leading-none text-black">
                      Jean Dupont
                    </p>
                    <p className="text-xs leading-none text-black/50 font-light">
                      jean.dupont@architech.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-black/10" />
                <Link href="/settings">
                  <DropdownMenuItem className="text-black/70 hover:bg-black hover:text-white transition-all rounded-lg cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/settings">
                  <DropdownMenuItem className="text-black/70 hover:bg-black hover:text-white transition-all rounded-lg cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Paramètres</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator className="bg-black/10" />
                <DropdownMenuItem className="text-black/70 hover:bg-black hover:text-white transition-all rounded-lg cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="md:hidden rounded-lg border-2 border-transparent hover:border-black/20 text-black/60 hover:text-black transition-all h-10 w-10 p-0"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-64 bg-white border-l-2 border-black"
              >
                <div className="flex flex-col space-y-2 mt-8">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)}>
                        <Button 
                          variant="ghost"
                          className={`w-full justify-start rounded-lg border-2 transition-all font-medium tracking-wide ${
                            isActive 
                              ? "bg-sand-500 text-white border-sand-500 hover:bg-sand-600 hover:text-white [&_svg]:text-white [&_svg]:hover:text-white" 
                              : "text-black/60 border-transparent hover:border-sand-200 hover:text-black hover:bg-transparent"
                          }`}
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {item.name}
                        </Button>
                      </Link>
                    )
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
