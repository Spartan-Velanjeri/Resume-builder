import React, { useState, useEffect } from 'react';
import { Box, IconButton, HStack, VStack, Select, Tooltip } from '@chakra-ui/react';
import { useDrag } from 'react-dnd';
import { ChromePicker } from 'react-color';
import { AiOutlineDelete, AiOutlineBold, AiOutlineItalic, AiOutlineUnderline, AiOutlineLink } from 'react-icons/ai';
import { IoText, IoColorFillSharp } from 'react-icons/io5';
import { MdImage, MdFormatAlignLeft, MdFormatAlignCenter, MdFormatAlignRight, MdFormatAlignJustify } from 'react-icons/md';
import { CgColorPicker } from 'react-icons/cg';

const Sidebar = ({ addElement, onCustomizationChange, selectedElementType, handleHyperlink, hasHyperlink }) => {
  const [fontSize, setFontSize] = useState('16px');
  const [color, setColor] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBackgroundColorPicker, setShowBackgroundColorPicker] = useState(false);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [recentColors, setRecentColors] = useState(['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF']);

  const [{ isDragging: isDraggingText }, dragText] = useDrag(() => ({
    type: 'text',
    item: { type: 'text', text: 'Drag this text' },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [{ isDragging: isDraggingImage }, dragImage] = useDrag(() => ({
    type: 'image',
    item: { type: 'image', src: 'https://via.placeholder.com/150', alt: 'Placeholder' },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleColorChange = (color) => {
    setColor(color.hex);
    onCustomizationChange('color', color.hex);

    if (selectedElementType === 'text') {
      setRecentColors((prevColors) => {
        const newColors = [color.hex, ...prevColors];
        return newColors.slice(0, 5);
      });
    }
  };

  const handleBackgroundColorChange = (color) => {
    onCustomizationChange('canvasBackgroundColor', color.hex);
  };

  const defaultColors = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF'];

  return (
    <Box width="250px" padding="10px" borderRight="1px solid black" bg="gray.200">
      <VStack spacing="10px">
        <HStack spacing="10px">
          <Tooltip label="Add Text" aria-label="Add Text">
            <IconButton
              icon={<IoText />}
              ref={dragText}
              aria-label="Add Text"
              opacity={isDraggingText ? 0.5 : 1}
              cursor="move"
              onClick={() => addElement('text')}
            />
          </Tooltip>
          <Tooltip label="Add Image" aria-label="Add Image">
            <IconButton
              icon={<MdImage />}
              ref={dragImage}
              aria-label="Add Image"
              opacity={isDraggingImage ? 0.5 : 1}
              cursor="move"
              onClick={() => addElement('image')}
            />
          </Tooltip>
        </HStack>
        <HStack spacing="10px">
          <Tooltip label="Delete" aria-label="Delete">
            <IconButton
              icon={<AiOutlineDelete />}
              colorScheme="red"
              aria-label="Delete"
              onClick={() => addElement('delete')}
            />
          </Tooltip>
          <Tooltip label="Add/Edit Hyperlink" aria-label="Add/Edit Hyperlink">
            <IconButton
              icon={<AiOutlineLink />}
              aria-label="Add/Edit Hyperlink"
              colorScheme={hasHyperlink ? 'blue' : 'gray'}
              onClick={handleHyperlink}
            />
          </Tooltip>
        </HStack>
        <HStack spacing="10px">
          <Select
            placeholder="Size"
            value={fontSize}
            onChange={(e) => {
              setFontSize(e.target.value);
              onCustomizationChange('fontSize', e.target.value);
            }}
            width="80px"
          >
            <option value="12px">12</option>
            <option value="14px">14</option>
            <option value="16px">16</option>
            <option value="18px">18</option>
            <option value="20px">20</option>
            <option value="24px">24</option>
            <option value="28px">28</option>
            <option value="32px">32</option>
          </Select>
          <Select
            placeholder="Font"
            value={fontFamily}
            onChange={(e) => {
              setFontFamily(e.target.value);
              onCustomizationChange('fontFamily', e.target.value);
            }}
            width="150px"
          >
            <option value="Arial" style={{ fontFamily: 'Arial' }}>Arial</option>
            <option value="Georgia" style={{ fontFamily: 'Georgia' }}>Georgia</option>
            <option value="Oswald" style={{ fontFamily: 'Oswald' }}>Oswald</option>
            <option value="Roboto" style={{ fontFamily: 'Roboto' }}>Roboto</option>
            <option value="Times New Roman" style={{ fontFamily: 'Times New Roman' }}>Times New Roman</option>
            <option value="Verdana" style={{ fontFamily: 'Verdana' }}>Verdana</option>
          </Select>
        </HStack>
        <HStack spacing="10px">
          <Tooltip label="Bold" aria-label="Bold">
            <IconButton
              icon={<AiOutlineBold />}
              aria-label="Bold"
              onClick={() => onCustomizationChange('fontWeight', 'bold')}
            />
          </Tooltip>
          <Tooltip label="Italic" aria-label="Italic">
            <IconButton
              icon={<AiOutlineItalic />}
              aria-label="Italic"
              onClick={() => onCustomizationChange('fontStyle', 'italic')}
            />
          </Tooltip>
          <Tooltip label="Underline" aria-label="Underline">
            <IconButton
              icon={<AiOutlineUnderline />}
              aria-label="Underline"
              onClick={() => onCustomizationChange('textDecoration', 'underline')}
            />
          </Tooltip>
        </HStack>
        <HStack spacing="10px">
          <Tooltip label="Align Left" aria-label="Align Left">
            <IconButton
              icon={<MdFormatAlignLeft />}
              aria-label="Align Left"
              onClick={() => onCustomizationChange('textAlign', 'left')}
            />
          </Tooltip>
          <Tooltip label="Align Center" aria-label="Align Center">
            <IconButton
              icon={<MdFormatAlignCenter />}
              aria-label="Align Center"
              onClick={() => onCustomizationChange('textAlign', 'center')}
            />
          </Tooltip>
          <Tooltip label="Align Right" aria-label="Align Right">
            <IconButton
              icon={<MdFormatAlignRight />}
              aria-label="Align Right"
              onClick={() => onCustomizationChange('textAlign', 'right')}
            />
          </Tooltip>
          <Tooltip label="Justify" aria-label="Justify">
            <IconButton
              icon={<MdFormatAlignJustify />}
              aria-label="Justify"
              onClick={() => onCustomizationChange('textAlign', 'justify')}
            />
          </Tooltip>
        </HStack>
        <HStack spacing="10px">
          {defaultColors.map((color, index) => (
            <Tooltip key={index} label={color} aria-label={color}>
              <Box
                width="20px"
                height="20px"
                bg={color}
                borderRadius="50%"
                cursor="pointer"
                onClick={() => {
                  setColor(color);
                  onCustomizationChange('color', color);
                }}
              />
            </Tooltip>
          ))}
        </HStack>
        <HStack spacing="10px">
          {recentColors.map((color, index) => (
            <Tooltip key={index} label={color} aria-label={color}>
              <Box
                width="20px"
                height="20px"
                bg={color}
                borderRadius="50%"
                cursor="pointer"
                onClick={() => {
                  setColor(color);
                  onCustomizationChange('color', color);
                }}
              />
            </Tooltip>
          ))}
          {selectedElementType === 'text' && (
            <Tooltip label="Color Picker" aria-label="Color Picker">
              <IconButton
                icon={<CgColorPicker />}
                aria-label="Color Picker"
                onClick={() => setShowColorPicker(!showColorPicker)}
              />
            </Tooltip>
          )}
        </HStack>
        {showColorPicker && selectedElementType === 'text' && (
          <Box position="absolute" zIndex="popover">
            <ChromePicker color={color} onChangeComplete={handleColorChange} />
          </Box>
        )}
        <HStack spacing="10px">
          <Tooltip label="Background Color Picker" aria-label="Background Color Picker">
            <IconButton
              icon={<IoColorFillSharp />}
              aria-label="Background Color Picker"
              onClick={() => setShowBackgroundColorPicker(!showBackgroundColorPicker)}
            />
          </Tooltip>
        </HStack>
        {showBackgroundColorPicker && (
          <Box position="absolute" zIndex="popover">
            <ChromePicker color={color} onChangeComplete={handleBackgroundColorChange} />
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default Sidebar;
