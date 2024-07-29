import React, { useState, useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

const DraggableText = ({ id, left, top, text, onSelect, isSelected, customization }) => {
  const [currentText, setCurrentText] = useState(text);
  const [canDrag, setCanDrag] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const ref = useRef(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'text',
    item: { id, type: 'text' },
    canDrag: () => canDrag,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Control') {
        e.preventDefault();
        setCanDrag(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'Control') {
        setCanDrag(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleMouseDown = () => {
    if (canDrag) {
      drag(ref.current);
    }
  };

  const handleClick = (e) => {
    e.stopPropagation(); // Prevent triggering deselect on canvas
    onSelect(id);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setCurrentText(e.target.value);
  };

  return (
    <div
      ref={(node) => {
        ref.current = node;
        preview(node);
      }}
      style={{
        position: 'absolute',
        left,
        top,
        border: 'none', // Remove the border
        boxShadow: isSelected ? '0 0 3px 3px rgba(173, 216, 230, 0.5)' : 'none', // Highlight if selected
        backgroundColor: 'transparent', // Make background transparent
        outline: 'none',
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      tabIndex={0}
    >
      <ResizableBox
        width={150}
        height={100}
        minConstraints={[50, 20]}
        maxConstraints={[300, 200]}
        resizeHandles={['se']}
        style={{ width: '100%', height: '100%' }}
      >
        {isEditing ? (
          <textarea
            value={currentText}
            onChange={handleChange}
            onBlur={handleBlur}
            autoFocus
            style={{
              width: '100%',
              height: '100%',
              border: 'none', // Remove border
              background: 'transparent', // Make background transparent
              resize: 'none', // Disable resizing within the textarea
              outline: 'none', // Remove focus outline
              fontSize: customization.fontSize,
              fontWeight: customization.fontWeight,
              fontStyle: customization.fontStyle,
              textDecoration: customization.textDecoration,
              color: customization.color,
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              fontSize: customization.fontSize,
              fontWeight: customization.fontWeight,
              fontStyle: customization.fontStyle,
              textDecoration: customization.textDecoration,
              color: customization.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {customization.hyperlink ? (
              <a
                href={customization.hyperlink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.preventDefault()}
              >
                {currentText}
              </a>
            ) : (
              currentText
            )}
          </div>
        )}
      </ResizableBox>
    </div>
  );
};

export default DraggableText;
