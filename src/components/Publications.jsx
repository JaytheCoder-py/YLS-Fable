import { useEffect, useMemo, useRef, useState } from 'react';
import { researchPage } from '../data.js';
import { ArrowDown, Search } from './Icons.jsx';

const INITIAL_ROWS = 10;

export default function Publications() {
  const { publications } = researchPage;
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const firstRevealedRef = useRef(null);

  const q = query.trim().toLowerCase();
  const filtering = q !== '';

  const visible = useMemo(() => {
    if (filtering) {
      return publications.filter(
        (p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }
    return expanded ? publications : publications.slice(0, INITIAL_ROWS);
  }, [publications, filtering, q, expanded]);

  // After "See more", hand focus to the first newly revealed row so the
  // unmounted button doesn't strand keyboard users.
  useEffect(() => {
    if (expanded) firstRevealedRef.current?.focus();
  }, [expanded]);

  const showSeeMore = !filtering && !expanded && publications.length > INITIAL_ROWS;

  return (
    <section className="pubs" aria-label="Publications">
      <div className="container-page pubs__grid">
        <h2 className="pubs__heading">Publications</h2>
        <div className="pubs__search">
          <Search className="pubs__search-icon" />
          <input
            type="search"
            placeholder="Search"
            aria-label="Search publications"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="pubs__listwrap">
          <p className="u-sr-only" aria-live="polite">{visible.length} publications shown</p>
          <p className="u-sr-only">Publications list: date, category, title</p>
          <div className="pubs__colhead" aria-hidden="true">
            <span>Date</span>
            <span>Category</span>
            <span>Title</span>
          </div>
          <ul className="pubs__list">
            {visible.map((p, i) => (
              <li key={`${p.date}-${p.title}`}>
                <a
                  className="pubs__row"
                  href={p.href}
                  ref={!filtering && expanded && i === INITIAL_ROWS ? firstRevealedRef : null}
                >
                  <span className="pubs__date">{p.date}</span>
                  <span className="pubs__cat">{p.category}</span>
                  <span className="pubs__title">{p.title}</span>
                </a>
              </li>
            ))}
            {filtering && visible.length === 0 && <li className="pubs__empty">No results</li>}
          </ul>
          {showSeeMore && (
            <button className="pubs__more" type="button" onClick={() => setExpanded(true)}>
              See more <ArrowDown />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
