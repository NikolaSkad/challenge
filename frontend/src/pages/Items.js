import React, { useEffect, useState } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';

function Items() {
  const { items, total, fetchItems } = useData();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    fetchItems(controller.signal, page, search).catch((err) => {
      if (err.name !== 'AbortError') console.error(err);
    });
    return () => controller.abort();
  }, [fetchItems, page, search]);

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
        onChange={e => { setSearch(e.target.value); setPage(1); }}
        style={{ marginBottom: 12, padding: 8, width: '100%' }}
      />
      {items.length > 0 && (
        <List
          height={400}
          itemCount={items.length}
          itemSize={40}
          width="100%"
        >
          {Row}
        </List>
      )}
      <div style={{ marginTop: 12 }}>
        <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>Prev</button>
        <span style={{ margin: '0 12px' }}>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Next</button>
      </div>
    </div>
  );
}

export default Items;