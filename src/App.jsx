import { useEffect } from 'react';
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
  useEffect(() => {
    document.title = title;
  }, [title]);
  return <Page />;
}

export default function App() {
  return (
    <RouterProvider>
      <Nav />
      <main id="main">
        <Routed />
      </main>
      <Footer />
    </RouterProvider>
  );
}
