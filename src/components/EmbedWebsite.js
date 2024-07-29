import React, { useState } from 'react';
import { useDrag } from 'react-dnd';

const EmbedWebsite = ({ url, id, onDelete, style }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [{ isDraggingSource }, drag] = useDrag(() => ({
    type: 'embed',
    item: { type: 'embed', id, url },
    collect: (monitor) => ({
      isDraggingSource: !!monitor.isDragging(),
    }),
    end: () => setIsDragging(false),
  }));

  return (
    <div
      ref={drag}
      style={{ ...style, opacity: isDraggingSource ? 0.5 : 1, cursor: 'move', position: 'relative', pointerEvents: 'none' }}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
    >
      <div style={{ pointerEvents: isDragging ? 'none' : 'auto' }}>
        <iframe
          src={url}
          style={{ width: '200px', height: '200px', border: 'none' }}
          title="Embedded Website"
        />
      </div>
      <button onClick={() => onDelete(id)} style={{ position: 'absolute', top: 0, right: 0 }}>
        X
      </button>
    </div>
  );
};

export default EmbedWebsite;
