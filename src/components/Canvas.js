import React from 'react';
import { useDrop } from 'react-dnd';
import DraggableText from './DraggableText';
import DraggableImage from './DraggableImage';

const Canvas = ({ elements, setElements, selectedElementId, setSelectedElementId, customization, backgroundColor }) => {
  const [, drop] = useDrop({
    accept: ['text', 'image'],
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset) return;

      const canvasElement = document.querySelector('.canvas');
      if (!canvasElement) return;

      const canvasRect = canvasElement.getBoundingClientRect();

      const elementWidth = item.type === 'text' ? 150 : 150; // Default width for new elements
      const elementHeight = item.type === 'text' ? 100 : 150; // Default height for new elements

      const adjustedLeft = offset.x - canvasRect.left - elementWidth / 2;
      const adjustedTop = offset.y - canvasRect.top - elementHeight / 2;

      if (item.id) {
        // Move existing element
        setElements((elements) =>
          elements.map((el) =>
            el.id === item.id
              ? {
                  ...el,
                  left: adjustedLeft,
                  top: adjustedTop,
                }
              : el
          )
        );
      } else {
        // Add new element
        const newElement = {
          id: Date.now(),
          type: item.type,
          left: adjustedLeft,
          top: adjustedTop,
          customization: {
            fontSize: '16px',
            fontWeight: 'normal',
            fontStyle: 'normal',
            textDecoration: 'none',
            color: '#000000',
            fontFamily: 'Arial',
            textAlign: 'left',
            hyperlink: '', // Add hyperlink property
          },
          ...(item.type === 'text'
            ? { text: 'New Text' }
            : { src: 'https://via.placeholder.com/150', alt: 'New Image' }),
        };

        setElements((elements) => [...elements, newElement]);
      }
    },
  });

  const handleSelect = (id) => {
    setSelectedElementId(id);
  };

  const handleDeselect = () => {
    setSelectedElementId(null);
  };

  return (
    <div
      ref={drop}
      className="canvas"
      style={{ flex: 1, position: 'relative', backgroundColor, overflow: 'hidden' }}
      onClick={handleDeselect} // Deselect when clicking on canvas
    >
      {elements.map((el) =>
        el.type === 'text' ? (
          <DraggableText
            key={el.id}
            id={el.id}
            left={el.left}
            top={el.top}
            text={el.text}
            onSelect={handleSelect}
            isSelected={el.id === selectedElementId}
            customization={el.customization} // Pass customization
          />
        ) : (
          <DraggableImage
            key={el.id}
            id={el.id}
            left={el.left}
            top={el.top}
            src={el.src}
            alt={el.alt}
            onSelect={handleSelect}
            isSelected={el.id === selectedElementId}
            customization={el.customization} // Pass customization
          />
        )
      )}
    </div>
  );
};

export default Canvas;
