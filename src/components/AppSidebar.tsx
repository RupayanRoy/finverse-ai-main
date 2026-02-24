import {
  LayoutDashboard, Bot, Landmark, TrendingUp, Receipt,
  ShieldCheck, BrainCircuit, ChevronLeft, ChevronRight, Zap, Menu, X, LogOut, User
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "AI Copilot", url: "/copilot", icon: Bot },
  { title: "Debt Intelligence", url: "/debt", icon: Landmark },
  { title: "Micro Investing", url: "/investing", icon: TrendingUp },
  { title: "Tax Intelligence", url: "/tax", icon: Receipt },
  { title: "Credit Graph", url: "/credit", icon: ShieldCheck },
  { title: "Financial Twin", url: "/twin", icon: BrainCircuit },
];

import { createContext, useContext } from "react";
const MobileMenuContext = createContext<(() => void) | null>(null);
export const useMobileMenu = () => useContext(MobileMenuContext);

export function AppSidebarWrapper({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout, user } = useAuth();

  return (
    <MobileMenuContext.Provider value={() => setMobileOpen(true)}>
      {isMobile && (
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-40"
                onClick={() => setMobileOpen(false)}
              />
              <motion.aside
                initial={{ x: -260 }}
                animate={{ x: 0 }}
                exit={{ x: -260 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed top-0 left-0 w-[260px] h-screen flex flex-col border-r border-sidebar-border bg-sidebar z-50"
              >
                <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border shrink-0">
                  <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground text-sm tracking-wide">FINVERSE</span>
                    <span className="text-[10px] text-muted-foreground tracking-widest">OPERATING SYSTEM</span>
                  </div>
                  <button onClick={() => setMobileOpen(false)} className="ml-auto text-muted-foreground hover:text-foreground">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.url}
                      to={item.url}
                      end={item.url === "/"}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                        "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
                      )}
                      activeClassName="bg-primary/10 text-primary border border-primary/20"
                      onClick={() => setMobileOpen(false)}
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span>{item.title}</span>
                    </NavLink>
                  ))}
                </nav>

                <div className="p-4 border-t border-sidebar-border space-y-4">
                  <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-foreground truncate">{user?.name}</span>
                      <span className="text-[10px] text-muted-foreground truncate">{user?.email}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-neon-rose hover:bg-destructive/10"
                  >
                    <LogOut className="w-5 h-5 shrink-0" />
                    <span>Logout Session</span>
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      )}
      {!isMobile && <DesktopSidebar />}
      {children}
    </MobileMenuContext.Provider>
  );
}

function DesktopSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, user } = useAuth();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen sticky top-0 flex flex-col border-r border-sidebar-border bg-sidebar overflow-hidden z-30 shrink-0"
    >
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border shrink-0">
        <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex flex-col">
              <span className="font-bold text-foreground text-sm tracking-wide">FINVERSE</span>
              <span className="text-[10px] text-muted-foreground tracking-widest">OPERATING SYSTEM</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            end={item.url === "/"}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
            )}
            activeClassName="bg-primary/10 text-primary border border-primary/20"
          >
            <item.icon className="w-5 h-5 shrink-0" />
            <AnimatePresence>
              {!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{item.title}</motion.span>}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-4">
        <div className={cn("flex items-center gap-3 px-2", collapsed && "justify-center px-0")}>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-primary" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-foreground truncate">{user?.name}</span>
                <span className="text-[10px] text-muted-foreground truncate">{user?.email}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={() => logout()}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-neon-rose hover:bg-destructive/10",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t border-sidebar-border text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </motion.aside>
  );
}