'use client';

import { useMemo, useState } from 'react';
import type { Cosplay } from '@/lib/types';
import { filterBySeries, searchCosplays } from '@/lib/data';
import { CosplayCard } from '@/components/CosplayCard';

export default function Gallery({
  cosplays,
  seriesList,
}: {
  cosplays: Cosplay[];
  seriesList: string[];
}) {
  const [query, setQuery] = useState('');
  const [series, setSeries] = useState('All series');

  const filtered = useMemo(() => {
    return filterBySeries(searchCosplays(cosplays, query), series);
  }, [cosplays, query, series]);

  return (
    <>
      <div className="controls">
        <label>
          <span className="count">Search by character or cosplayer</span>
          <input
            type="search"
            placeholder="Try “Agate”, “Leon”, or “@camelcosplays”…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search by character or cosplayer"
          />
        </label>
        <div className="filters" role="group" aria-label="Filter by series">
          {['All series', ...seriesList].map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={series === s}
              onClick={() => setSeries(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="count" aria-live="polite">
          {filtered.length} of {cosplays.length} looks
          {query ? ` matching “${query}”` : ''}
          {series !== 'All series' ? ` in ${series}` : ''}
        </p>
      </div>

      {filtered.length === 0 ? (
        <p>
          No looks match that search yet. Try a different character or
          cosplayer, or <a href="/submit">submit a cosplay</a>.
        </p>
      ) : (
        <div className="masonry">
          {filtered.map((c) => (
            <CosplayCard key={c.id} cosplay={c} />
          ))}
        </div>
      )}
    </>
  );
}
