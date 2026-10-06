'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { connectWorkspace, disconnectWorkspace, useWorkspace } from '@clayface/editor';
import type { Project } from '@clayface/schema';
import { api, ApiError, accountPath, type Account } from '@/lib/api';
import { AccountFrame, ErrorMessage } from './account-flow';
export function SessionWorkspace({ children }: { children: ReactNode }) {
  const router = useRouter(), [ready, setReady] = useState(false), [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    async function load() { try {
      const { user } = await api<{ user: Account }>('/auth/session');
      if (!active) return;
      if (user.onboardingStep !== 'complete') { router.replace(accountPath(user)); return; }
      const result = await api<{ project: { workspace_document: Project | null; project_version: number } | null }>('/project');
      if (!active) return;
      if (!result.project?.workspace_document) throw new Error('Your account has no saved workspace. Please finish project setup or contact support.');
      let version = result.project.project_version;
      connectWorkspace(result.project.workspace_document, async project => {
        const saved = await api<{ project: Project; version: number }>('/project', { project, version }, 'PUT'); version = saved.version; return saved.project;
      }); setReady(true);
    } catch (err) { if (!active) return; if (err instanceof ApiError && err.status === 401) router.replace('/signin'); else setError(err instanceof Error ? err.message : 'Your workspace could not be opened.'); } }
    void load();
    const beforeUnload = (event: BeforeUnloadEvent) => { if (useWorkspace.getState().saveStatus !== 'saved') { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', beforeUnload);
    return () => { active = false; disconnectWorkspace(); window.removeEventListener('beforeunload', beforeUnload); };
  }, [router]);
  if (!ready) return <AccountFrame><section className="account-panel"><h1>{error ? 'Your workspace couldn’t open.' : 'Opening your workspace…'}</h1><ErrorMessage message={error}/>{error && <button className="account-primary" onClick={() => location.reload()}>Try again</button>}</section></AccountFrame>;
  return children;
}
