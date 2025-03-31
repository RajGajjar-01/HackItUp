// components/Sidebar.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

// Navigation items - customize these based on your website structure
const navItems = [
  { name: "Home", href: "/dashnoard" },
  { name: "Inventory", href: "/inventory" },
  { name: "AI Recipe Maker", href: "/recipe-maker" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      {/* Mobile sidebar (shows as a drawer) */}
      <div className="block md:hidden font-poppins">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <nav className="flex flex-col gap-4 mt-8 font-poppins">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 text-lg font-medium rounded-md hover:bg-gray-100 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar (shows as fixed sidebar) */}
      <div className="hidden md:block">
        <aside className="w-64 h-screen fixed left-0 top-0 border-r bg-white">
          <div className="p-4 flex flex-col h-full">
            <div className="mb-6 p-2">
              <h1 className="text-xl font-bold font-poppins">Your Site Name</h1>
            </div>
            <nav className="flex flex-col gap-2 flex-1">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 text-base font-medium rounded-md hover:bg-gray-100 transition-colors font-poppins"
                >
                  {item.name}
                </a>
              ))}
            </nav>
            <div className="mt-auto p-4 border-t">
              <p className="text-sm text-gray-500">© 2025 Your Company</p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}