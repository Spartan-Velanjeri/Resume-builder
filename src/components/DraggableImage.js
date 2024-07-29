import React, { useState, useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

const DraggableImage = ({ id, left, top, src, alt, onSelect, isSelected, customization }) => {
  const [canDrag, setCanDrag] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  const [showInput, setShowInput] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const ref = useRef(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'image',
    item: { id, type: 'image' },
    canDrag: () => canDrag,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setShowInput(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleClickOutside = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setShowInput(false);
      setIsEditing(false);
    }
  };

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
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mousedown', handleClickOutside);
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
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <ResizableBox
        width={150}
        height={150}
        minConstraints={[50, 50]}
        maxConstraints={[300, 300]}
        resizeHandles={['se']}
        style={{ width: '100%', height: '100%' }}
      >
        {isEditing ? (
          <input
            type="file"
            onChange={handleFileChange}
            autoFocus
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              opacity: 0,
              cursor: 'pointer',
            }}
          />
        ) : customization.hyperlink ? (
          <a href={customization.hyperlink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.preventDefault()}>
            <img src={imageSrc} alt={alt} style={{ width: '100%', height: '100%' }} />
          </a>
        ) : (
          <img src={imageSrc} alt={alt} style={{ width: '100%', height: '100%' }} />
        )}
      </ResizableBox>
    </div>
  );
};

export default DraggableImage;
