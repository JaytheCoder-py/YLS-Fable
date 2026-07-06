import { WORDMARK, footerColumns, footerLegal } from '../data.js';
import { LinkedIn, XIcon, YouTube } from './Icons.jsx';

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container-page">
        <div className="footer__top">
          <span className="footer__wordmark">{WORDMARK}</span>
          <div className="footer__social">
            <a href="#" aria-label="LinkedIn"><LinkedIn /></a>
            <a href="#" aria-label="X"><XIcon /></a>
            <a href="#" aria-label="YouTube"><YouTube /></a>
          </div>
        </div>

        <div className="footer__cols">
          {footerColumns.map((col) => (
            <div className="footer__col" key={col.heading}>
              <h4>{col.heading}</h4>
              <ul>
                {col.links.map((link) => (
                  <li key={link}><a href="#">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer__bottom">
          <span className="footer__copy">© 2025 Anthropic PBC</span>
          <div className="footer__legal">
            {footerLegal.map((l) => (
              <a href="#" key={l}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
