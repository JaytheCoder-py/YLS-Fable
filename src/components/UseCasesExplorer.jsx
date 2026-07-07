import { useMemo, useRef, useState } from 'react';
import { useCases, filterGroups, PAGE_SIZE } from '../useCasesData.js';
import UseCaseCard, { detailUrl } from './UseCaseCard.jsx';
import UseCasesFilters from './UseCasesFilters.jsx';
import { SearchIcon, ViewGrid, ViewList } from './Icons.jsx';

const emptySelections = () =>
  Object.fromEntries(filterGroups.map((g) => [g.key, new Set()]));

// Within a group OR; across groups AND; search ANDs on title + description.
function matches(useCase, selections, query) {
  for (const group of filterGroups) {
    const selected = selections[group.key];
    if (selected.size === 0) continue;
    const values = [].concat(useCase[group.key]);
    if (!values.some((v) => selected.has(v))) return false;
  }
  if (query) {
    const haystack = `${useCase.title} ${useCase.desc}`.toLowerCase();
    if (!haystack.includes(query)) return false;
  }
  return true;
}

function ListView({ items }) {
  return (
    <div className="uc-list">
      <div className="uc-list__head" aria-hidden="true">
        <span />
        <span>Author</span>
        <span>Category</span>
        <span>Model</span>
        <span>Features</span>
      </div>
      <ul className="uc-list__rows">
        {items.map((uc) => (
          <li key={uc.slug} className="uc-row">
            <h3 className="uc-row__title">
              <a className="uc-card__link" href={detailUrl(uc.slug)} target="_blank" rel="noreferrer">
                {uc.title}
              </a>
            </h3>
            <span className="uc-row__cell" data-label="Author">{uc.author}</span>
            <span className="uc-row__cell" data-label="Category">{uc.categories.join(', ') || '—'}</span>
            <span className="uc-row__cell" data-label="Model">{uc.model}</span>
            <span className="uc-row__cell" data-label="Features">{uc.features.join(', ') || '—'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function UseCasesExplorer() {
  const [selections, setSelections] = useState(emptySelections);
  const [query, setQuery] = useState('');
  const [view, setView] = useState('grid');
  const [page, setPage] = useState(1);
  const topRef = useRef(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return useCases.filter((uc) => matches(uc, selections, q));
  }, [selections, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const toggleOption = (key, option) => {
    setSelections((prev) => {
      const next = new Set(prev[key]);
      next.has(option) ? next.delete(option) : next.add(option);
      return { ...prev, [key]: next };
    });
    setPage(1);
  };

  const clearAll = () => {
    setSelections(emptySelections());
    setQuery('');
    setPage(1);
  };

  const goToPage = (n) => {
    setPage(n);
    topRef.current?.scrollIntoView({ block: 'start' });
  };

  return (
    <div className="uc-layout container-page" ref={topRef}>
      <UseCasesFilters selections={selections} onToggleOption={toggleOption} onClearAll={clearAll} />

      <div className="uc-main">
        <div className="uc-toolbar">
          <label className="uc-search">
            <SearchIcon />
            <span className="u-sr-only">Search use cases</span>
            <input
              type="search"
              placeholder="Search use cases"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </label>
          <div className="uc-viewtoggle" role="group" aria-label="View">
            <button type="button" aria-pressed={view === 'grid'} onClick={() => setView('grid')}>
              <ViewGrid />
              Grid
            </button>
            <button type="button" aria-pressed={view === 'list'} onClick={() => setView('list')}>
              <ViewList />
              List
            </button>
          </div>
        </div>

        <p className="u-sr-only" role="status">
          {filtered.length} use case{filtered.length === 1 ? '' : 's'} found
        </p>

        {visible.length === 0 ? (
          <div className="uc-empty">
            <p className="uc-empty__title">No results found</p>
            <p className="uc-empty__hint">Try a different search, or remove some filters.</p>
            <button type="button" className="btn" onClick={clearAll}>
              Clear filters
            </button>
          </div>
        ) : view === 'grid' ? (
          <ul className="uc-grid">
            {visible.map((uc, i) => (
              <UseCaseCard key={uc.slug} useCase={uc} variant={(i % 4) + 1} />
            ))}
          </ul>
        ) : (
          <ListView items={visible} />
        )}

        {pageCount > 1 && visible.length > 0 && (
          <nav className="uc-pagination" aria-label="Pagination">
            {currentPage > 1 && (
              <button type="button" className="uc-pagination__btn" onClick={() => goToPage(currentPage - 1)}>
                Previous
              </button>
            )}
            <span className="uc-pagination__indicator">
              {currentPage} / {pageCount}
            </span>
            {currentPage < pageCount && (
              <button type="button" className="uc-pagination__btn uc-pagination__btn--more" onClick={() => goToPage(currentPage + 1)}>
                View more
              </button>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
