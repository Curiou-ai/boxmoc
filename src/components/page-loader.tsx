
'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';

function NProgressDone() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  return null;
}


export function PageLoader() {
  useEffect(() => {
    NProgress.configure({ showSpinner: false });

    const handleAnchorClick = (event: MouseEvent) => {
      const targetUrl = (event.currentTarget as HTMLAnchorElement).href;
      const currentUrl = window.location.href;
      if (targetUrl !== currentUrl) {
        NProgress.start();
      }
    };

    const handleMutation = () => {
      const anchorElements = document.querySelectorAll('a');
      anchorElements.forEach((anchor) => {
        const hasListener = (anchor as any).hasNProgressListener;
        if (!hasListener) {
            anchor.addEventListener('click', handleAnchorClick);
            (anchor as any).hasNProgressListener = true;
        }
      });
    };

    handleMutation();
    
    const mutationObserver = new MutationObserver(handleMutation);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
        mutationObserver.disconnect();
         document.querySelectorAll('a').forEach((anchor) => {
            anchor.removeEventListener('click', handleAnchorClick);
            delete (anchor as any).hasNProgressListener;
        });
    };
  }, []);

  return (
    <Suspense fallback={null}>
      <NProgressDone />
    </Suspense>
  );
}

