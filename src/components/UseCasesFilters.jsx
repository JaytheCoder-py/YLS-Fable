import { useState } from 'react';
import { filterGroups } from '../useCasesData.js';
import { Caret, CheckMark } from './Icons.jsx';

function FilterGroup({ group, selected, onToggleOption }) {
  const [open, setOpen] = useState(false);
  const listId = `uc-group-${group.key}`;
  const count = selected.size;
  return (
    <div className="uc-group">
      <button
        type="button"
        className="uc-group__btn"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen(!open)}
      >
        <span>
          {group.label}
          {count > 0 && <span className="uc-group__count">{count}</span>}
        </span>
        <Caret className={open ? 'uc-group__caret uc-group__caret--open' : 'uc-group__caret'} />
      </button>
      {open && (
        <ul className="uc-group__list" id={listId}>
          {group.options.map((option) => (
            <li key={option}>
              <label className="uc-check">
                <input
                  type="checkbox"
                  checked={selected.has(option)}
                  onChange={() => onToggleOption(group.key, option)}
                />
                <span className="uc-check__box" aria-hidden="true">
                  <CheckMark />
                </span>
                {option}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function UseCasesFilters({ selections, onToggleOption, onClearAll }) {
  const anySelected = filterGroups.some((g) => selections[g.key].size > 0);
  return (
    <aside className="uc-rail" aria-label="Filter use cases">
      <div className="uc-rail__head">
        <h2 className="uc-rail__heading">Filter</h2>
        {anySelected && (
          <button type="button" className="uc-rail__clear" onClick={onClearAll}>
            Clear all
          </button>
        )}
      </div>
      {filterGroups.map((group) => (
        <FilterGroup
          key={group.key}
          group={group}
          selected={selections[group.key]}
          onToggleOption={onToggleOption}
        />
      ))}
    </aside>
  );
}
