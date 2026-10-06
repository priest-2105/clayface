import type { Metadata } from 'next';
import '@fontsource-variable/geist';
import '@clayface/design-tokens/product.css';
import './globals.css';

export const metadata: Metadata = { title: 'Clayface — A little structure. A lot of possibility.', description: 'A design-system-driven workspace for intentional interfaces.' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
