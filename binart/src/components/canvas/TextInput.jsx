import React from 'react';

const TextInput = ({
  showTextInput,
  textPosition,
  textInput,
  setTextInput,
  addTextToCanvas,
  setShowTextInput,
  size,
  color
}) => {
  if (!showTextInput) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: textPosition.x,
        top: textPosition.y,
        zIndex: 1000,
        background: 'white',
        border: '2px solid #3b82f6',
        borderRadius: '8px',
        padding: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}
    >
      <input
        type="text"
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            addTextToCanvas();
          } else if (e.key === 'Escape') {
            setShowTextInput(false);
            setTextInput('');
          }
        }}
        placeholder="Type text here..."
        autoFocus
        style={{
          border: 'none',
          outline: 'none',
          fontSize: size + 'px',
          color: color,
          background: 'transparent',
          minWidth: '150px'
        }}
      />
      <div style={{ marginTop: '4px', fontSize: '12px', color: '#666' }}>
        Press Enter to add, Escape to cancel
      </div>
    </div>
  );
};

export default TextInput;
