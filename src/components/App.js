import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Canvas from './Canvas';

const App = () => {
  const [elements, setElements] = useState([]);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [canvasBackgroundColor, setCanvasBackgroundColor] = useState('#f0f0f0'); // Default background color

  const addElement = (type) => {
    if (type === 'delete' && selectedElementId) {
      setElements((elements) => elements.filter((el) => el.id !== selectedElementId));
      setSelectedElementId(null);
    } else if (type !== 'delete') {
      const canvasElement = document.querySelector('.canvas');
      const canvasRect = canvasElement.getBoundingClientRect();
      const centerX = canvasRect.width / 2;
      const centerY = canvasRect.height / 2;

      const newElement = {
        id: Date.now(),
        type: type,
        left: centerX - 75,
        top: centerY - 50,
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
        ...(type === 'text'
          ? { text: 'New Text' }
          : { src: 'https://via.placeholder.com/150', alt: 'New Image' }),
      };

      setElements((elements) => [...elements, newElement]);
    }
  };

  const handleCustomizationChange = (key, value) => {
    if (key === 'canvasBackgroundColor') {
      setCanvasBackgroundColor(value);
    } else {
      setElements((elements) =>
        elements.map((el) =>
          el.id === selectedElementId
            ? {
                ...el,
                customization: {
                  ...el.customization,
                  [key]: key === 'textDecoration'
                    ? el.customization[key] === value ? 'none' : value
                    : el.customization[key] === value ? 'normal' : value,
                },
              }
            : el
        )
      );
    }
  };

  const handleHyperlinkChange = (url) => {
    setElements((elements) =>
      elements.map((el) =>
        el.id === selectedElementId
          ? {
              ...el,
              customization: {
                ...el.customization,
                hyperlink: url,
              },
            }
          : el
      )
    );
  };

  const handleHyperlink = () => {
    const currentElement = elements.find((el) => el.id === selectedElementId);
    const currentHyperlink = currentElement?.customization?.hyperlink || '';
    const url = prompt('Enter the URL:', currentHyperlink);
    if (url !== null) {
      handleHyperlinkChange(url);
    }
  };

  const selectedElementType = elements.find(el => el.id === selectedElementId)?.type;
  const hasHyperlink = elements.find(el => el.id === selectedElementId)?.customization?.hyperlink;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'k' && selectedElementId) {
        e.preventDefault();
        handleHyperlink();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedElementId, elements]);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar
        addElement={addElement}
        onCustomizationChange={handleCustomizationChange}
        selectedElementType={selectedElementType}
        handleHyperlink={handleHyperlink}
        hasHyperlink={!!hasHyperlink}
      />
      <Canvas
        elements={elements}
        setElements={setElements}
        selectedElementId={selectedElementId}
        setSelectedElementId={setSelectedElementId}
        backgroundColor={canvasBackgroundColor} // Pass the background color
      />
    </div>
  );
};

export default App;
