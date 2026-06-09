import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/items/' + id, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error('Item not found');
        return res.json();
      })
      .then(setItem)
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message);
      });
    return () => controller.abort();
  }, [id]);

  if (error) return (
    <div style={{ padding: 16 }}>
      <p role="alert" style={{ color: 'red' }}>{error}</p>
      <Link to="/">Back to items</Link>
    </div>
  );

  if (!item) return <p aria-busy="true">Loading...</p>;

  return (
    <div style={{ padding: 16 }}>
      <Link to="/">← Back</Link>
      <h2>{item.name}</h2>
      <p><strong>Category:</strong> {item.category}</p>
      <p><strong>Price:</strong> ${item.price}</p>
    </div>
  );
}

export default ItemDetail;