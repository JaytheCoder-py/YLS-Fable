import { createContext, useContext, useEffect, useState } from 'react';

// Minimal pathname router — two routes don't justify a dependency. Netlify
// rewrites /* -> /index.html and Vite's dev server falls back to index.html,
// so deep links resolve; popstate keeps back/forward working.
//
// The null default marks "no router mounted": shared chrome (Nav/Footer)
// also renders inside the research.html MPA document, where a pushState
// "navigation" would change the URL without changing the page — RouteLink
// falls back to a plain anchor there.

const PathContext = createContext(null);

export function normalizePath(pathname) {
  const p = pathname.replace(/\/+$/, '');
  return p === '' ? '/' : p;
}

export function navigate(href) {
  if (normalizePath(window.location.pathname) === normalizePath(href)) return;
  window.history.pushState(null, '', href);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function RouterProvider({ children }) {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));
  useEffect(() => {
    const onPop = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  return <PathContext.Provider value={path}>{children}</PathContext.Provider>;
}

export function usePath() {
  return useContext(PathContext);
}

// Internal link: intercepts plain left-clicks, defers to the browser for
// modified clicks (new tab, etc.) and for documents without a router.
export function RouteLink({ href, children, ...rest }) {
  const inSpa = useContext(PathContext) !== null;
  const onClick = (e) => {
    if (!inSpa) return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(href);
    window.scrollTo(0, 0);
  };
  return (
    <a href={href} onClick={onClick} {...rest}>
      {children}
    </a>
  );
}
