import { ReactNode } from "react";
import { MemberSidebar } from "@/app/components/MemberSidebar";
import { GlobalNav } from "@/app/components/GlobalNav";

interface MemberLayoutProps {
  children: ReactNode;
}

export function MemberLayout({ children }: MemberLayoutProps) {
  return (
    <div className="min-h-screen bg-[#fbf0f3]">
      <GlobalNav />
      <MemberSidebar />
      <main className="ml-[280px] min-h-screen">
        {children}
      </main>
    </div>
  );
}
