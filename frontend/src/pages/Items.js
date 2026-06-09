import React, { useEffect, useState } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';
import { useDebounce } from '../hooks/useDebounce';

function Items() {
  const { items, total, fetchItems } = useData();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetchItems(controller.signal, page, debouncedSearch)
      .catch((err) => {
        if (err.name !== 'AbortError') setError('Failed to load items.');
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [fetchItems, page, debouncedSearch]);

  const totalPages = Math.ceil(total / 10);

  const Row = ({ index, style }) => {
    const item = items[index];
    if (!item) return null;
    return (
      <div style={{ ...style, paddingLeft: 16, display: 'flex', alignItems: 'center' }}>
        <Link to={'/items/' + item.id}>{item.name}</Link>
      </div>
    );
  };

  return (
    <div style={{ padding: 16 }}>
      <input
        type="text"
        placeholder="Search items..."
        value={search}
        aria-label="Search items"
        onChange={e => { setSearch(e.target.value); setPage(1); }}
        style={{ marginBottom: 12, padding: 8, width: '100%' }}
      />

      {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}

      {loading ? (
        <div aria-busy="true" aria-label="Loading items">
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{
              height: 32, marginBottom: 8, borderRadius: 4,
              background: '#e0e0e0', animation: 'pulse 1.5s infinite'
            }} />
          ))}
        </div>
      ) : (
        <List
          height={400}
          itemCount={items.length}
          itemSize={40}
          width="100%"
          style={{ overflowX: 'hidden' }}
        >
          {Row}
        </List>
      )}

      <div style={{ marginTop: 12 }}>
        <button onClick={() => setPage(p => p - 1)} disabled={page === 1} aria-label="Previous page">Prev</button>
        <span style={{ margin: '0 12px' }}>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages} aria-label="Next page">Next</button>
      </div>
    </div>
  );
}

export default Items;