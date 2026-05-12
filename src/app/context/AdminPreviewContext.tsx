import { createContext, useContext, useState, ReactNode } from "react";

export type PreviewRole = "admin" | "blueprint-member" | "gold-standard-member" | "new-member" | "expired-member";

interface AdminPreviewContextType {
  isAdminPreview: boolean;
  previewRole: PreviewRole;
  setPreviewRole: (role: PreviewRole) => void;
  isMobilePreview: boolean;
  setIsMobilePreview: (isMobile: boolean) => void;
  isToolbarVisible: boolean;
  toggleToolbar: () => void;
}

const AdminPreviewContext = createContext<AdminPreviewContextType | undefined>(undefined);

export function AdminPreviewProvider({ children }: { children: ReactNode }) {
  // Check if user is admin (you can customize this logic)
  const isAdmin = typeof window !== "undefined" && window.location.search.includes("admin-preview=true");

  const [previewRole, setPreviewRole] = useState<PreviewRole>("admin");
  const [isMobilePreview, setIsMobilePreview] = useState(false);
  const [isToolbarVisible, setIsToolbarVisible] = useState(isAdmin);

  const toggleToolbar = () => setIsToolbarVisible(!isToolbarVisible);

  return (
    <AdminPreviewContext.Provider
      value={{
        isAdminPreview: isAdmin,
        previewRole,
        setPreviewRole,
        isMobilePreview,
        setIsMobilePreview,
        isToolbarVisible,
        toggleToolbar,
      }}
    >
      {children}
    </AdminPreviewContext.Provider>
  );
}

export function useAdminPreview() {
  const context = useContext(AdminPreviewContext);
  if (context === undefined) {
    throw new Error("useAdminPreview must be used within AdminPreviewProvider");
  }
  return context;
}
