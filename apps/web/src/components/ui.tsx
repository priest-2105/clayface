'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Dialog, Heading, Modal, ModalOverlay } from 'react-aria-components';
import { X, Hexagon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export function Button({ variant = 'secondary', className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }) {
  return <button type="button" className={cn('button', `button-${variant}`, className)} {...props}/>;
}
export function IconButton({ label, children, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return <button type="button" aria-label={label} title={label} className={cn('icon-button', className)} {...props}>{children}</button>;
}
export function ClayfaceMark({ small = false }: { small?: boolean }) {
  return <svg className={small ? 'clayface-mark small' : 'clayface-mark'} width="27" height="29" viewBox="0 0 30 32" aria-hidden="true"><path d="m4 9 11-6 11 6v14l-11 6-11-6z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="m4 9 11 7 11-7M15 16v13M4 16l11 7 11-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>;
}
export function NavigationDrawer({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  if (!open) return <>{children}</>;
  return <ModalOverlay isOpen onOpenChange={value => { if (!value) onClose(); }} isDismissable className="nav-modal-overlay"><Modal className="nav-modal"><Dialog aria-label="Project navigation menu" className="nav-dialog"><motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: .22, ease: 'easeOut' }}>{children}</motion.div></Dialog></Modal></ModalOverlay>;
}
export function ModalDialog({ open, onClose, title, description, children, wide = false }: { open: boolean; onClose: () => void; title: string; description?: string; children: ReactNode; wide?: boolean }) {
  return <ModalOverlay isOpen={open} onOpenChange={value => { if (!value) onClose(); }} isDismissable className="modal-overlay"><Modal className={cn('modal', wide && 'modal-wide')}><Dialog className="dialog"><motion.div initial={{ opacity: 0, y: 12, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .2, ease: 'easeOut' }}><div className="dialog-heading"><Heading slot="title">{title}</Heading><IconButton label="Close dialog" onClick={onClose}><X size={18}/></IconButton></div>{description && <p className="dialog-description">{description}</p>}{children}</motion.div></Dialog></Modal></ModalOverlay>;
}
export function EmptyState({ title, description, children }: { title: string; description: string; children?: ReactNode }) {
  return <div className="empty-state"><span className="empty-symbol"><Hexagon size={25} strokeWidth={1.3}/></span><h2>{title}</h2><p>{description}</p>{children}</div>;
}
export function downloadJson(value: unknown, filename: string) {
  const url = URL.createObjectURL(new Blob([typeof value === 'string' ? value : JSON.stringify(value, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a'); link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url);
}
