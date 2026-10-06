import { SessionWorkspace } from '@/components/session-workspace';
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <SessionWorkspace>{children}</SessionWorkspace>;
}
