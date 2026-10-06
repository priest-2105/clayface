import { PublicFrame } from '@/components/public-site';
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <PublicFrame>{children}</PublicFrame>;
}
