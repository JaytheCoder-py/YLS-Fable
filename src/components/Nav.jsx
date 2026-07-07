import { WORDMARK, navLinks } from '../data.js';
import { RouteLink } from '../Router.jsx';
import { Caret, Menu } from './Icons.jsx';

export default function Nav() {
  return (
    <header className="nav">
      <div className="container-page nav__inner">
        <RouteLink className="wordmark" href="/" aria-label="Anthropic home">{WORDMARK}</RouteLink>

        <nav className="nav__links" aria-label="Primary">
          {navLinks.map((l) => (
            <a key={l.label} className="nav__link" href={l.href}>
              {l.label}
              {l.caret && <Caret />}
            </a>
          ))}
          <span className="trybtn">
            <a className="trybtn__main" href="#">Try Claude</a>
            <a className="trybtn__caret" href="#" aria-label="More"><Caret /></a>
          </span>
        </nav>

        <button className="nav__toggle" aria-label="Open menu"><Menu /></button>
      </div>
    </header>
  );
}
