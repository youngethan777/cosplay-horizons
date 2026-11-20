'use client';

import { useMemo, useState } from 'react';
import type { Cosplay } from '@/lib/types';
import {
  VARIANT_FILTERS,
  filterByMainSeries,
  filterBySpecificSeries,
  filterByVariant,
  searchCosplays,
} from '@/lib/data';
import type { VariantFilter } from '@/lib/data';
import { CosplayCard } from '@/components/CosplayCard';

export default function Gallery({
  cosplays,
  seriesList,
  mainSeriesList,
}: {
  cosplays: Cosplay[];
  seriesList: string[];
  mainSeriesList?: string[];
  specificSeriesByMain?: Record<string, string[]>;
}) {
  const [query, setQuery] = useState('');
  // Series filters are plain text boxes (Ethan, Nov 18), not
  // dropdowns, selects, or checkboxes. Empty text means no filter.
  // The two boxes are independent: typing in Main never clears
  // Specific, and both filters apply when both are filled.
  const [mainSeries, setMainSeries] = useState('');
  const [specificSeries, setSpecificSeries] = useState('');
  const [variant, setVariant] = useState<VariantFilter>('All looks');

  const mains = mainSeriesList ?? [];
  // Datalist suggestions only. The user can type anything.
  // Specific suggestions are the full list of specific series.
  const specificOptions = seriesList;

  const filtered = useMemo(() => {
    return filterByVariant(
      filterBySpecificSeries(
        filterByMainSeries(searchCosplays(cosplays, query), mainSeries),
        specificSeries,
      ),
      variant,
    );
  }, [cosplays, query, mainSeries, specificSeries, variant]);

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
        <div className="series-filters">
          <label>
            <span className="count">Main series</span>
            <input
              type="text"
              placeholder="e.g. Trails or Fire Emblem"
              value={mainSeries}
              onChange={(e) => setMainSeries(e.target.value)}
              list="main-series-filter"
              aria-label="Filter by main series"
            />
            <datalist id="main-series-filter">
              {mains.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </label>
          <label>
            <span className="count">Specific series (optional)</span>
            <input
              type="text"
              placeholder="e.g. Fire Emblem Three Houses"
              value={specificSeries}
              onChange={(e) => setSpecificSeries(e.target.value)}
              list="specific-series-filter"
              aria-label="Filter by specific series"
            />
            <datalist id="specific-series-filter">
              {specificOptions.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </label>
        </div>
        <div
          className="filters"
          role="group"
          aria-label="Filter by variant"
        >
          {VARIANT_FILTERS.map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={variant === v}
              onClick={() => setVariant(v)}
            >
              {v}
            </button>
          ))}
        </div>
        <p className="count" aria-live="polite">
          {filtered.length} of {cosplays.length} looks
          {query ? ` matching “${query}”` : ''}
          {mainSeries.trim() ? ` in ${mainSeries.trim()}` : ''}
          {specificSeries.trim() ? ` · ${specificSeries.trim()}` : ''}
          {variant !== 'All looks' ? ` · ${variant}` : ''}
        </p>
      </div>

      {filtered.length === 0 ? (
        <p>
          No looks match that search yet. Try a different character or
          cosplayer, or <a href="/submit">make a submission</a>.
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
