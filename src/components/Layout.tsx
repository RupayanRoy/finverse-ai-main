import { AppSidebarWrapper, useMobileMenu } from "./AppSidebar";
import { Outlet } from "react-router-dom";
import { Bell, User, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

function LayoutContent() {
  const isMobile = useIsMobile();
  const openMenu = useMobileMenu();

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Top bar */}
      <header className="h-14 sm:h-16 border-b border-border flex items-center justify-between px-4 sm:px-6 shrink-0 backdrop-blur-sm bg-background/50">
        <div className="flex items-center gap-3">
          {isMobile && openMenu && (
            <button onClick={openMenu} className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
        </div>
      </header>
      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
}

export function Layout() {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebarWrapper>
        <LayoutContent />
      </AppSidebarWrapper>
    </div>
  );
}
