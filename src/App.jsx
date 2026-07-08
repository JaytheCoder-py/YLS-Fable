import { useEffect, useRef } from 'react';
import { RouterProvider, usePath } from './Router.jsx';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './components/HomePage.jsx';
import UseCasesPage from './components/UseCasesPage.jsx';

const routes = {
  '/': { Page: HomePage, title: 'Home \\ Anthropic' },
  '/use-cases': { Page: UseCasesPage, title: 'Use cases \\ Anthropic' },
};

function Routed() {
  const path = usePath();
  const { Page, title } = routes[path] ?? routes['/'];
  // Compare against the previous path rather than a mount flag: StrictMode
  // double-invokes effects, and a boolean guard would mistake the re-run
  // for a navigation and steal focus on page load.
  const prevPath = useRef(path);
  useEffect(() => {
    document.title = title;
  }, [title]);
  // Screen readers don't announce pushState navigations; moving focus to
  // <main> makes the page change perceivable.
  useEffect(() => {
    if (prevPath.current === path) return;
    prevPath.current = path;
    document.getElementById('main')?.focus();
  }, [path]);
  return <Page />;
}

export default function App() {
  return (
    <RouterProvider>
      <Nav />
      <main id="main" tabIndex={-1}>
        <Routed />
      </main>
      <Footer />
    </RouterProvider>
  );
}
