import React from 'react';

const styles = [
  { id: 'minimal', name: 'Minimal', description: 'Clean, simple, and modern' },
  { id: 'maximalist', name: 'Maximalist', description: 'Bold, vibrant, and expressive' },
  { id: 'luxury', name: 'Luxury', description: 'Elegant, premium, and sophisticated' },
  { id: 'delicate', name: 'Delicate', description: 'Soft, gentle, and refined' }
];

function StylePicker({ selectedStyle, onStyleSelect }) {
  return (
    <div className="style-grid">
      {styles.map(style => (
        <div
          key={style.id}
          className={`style-card ${selectedStyle === style.id ? 'selected' : ''}`}
          onClick={() => onStyleSelect(style.id)}
        >
          <h4>{style.name}</h4>
          <p>{style.description}</p>
        </div>
      ))}
    </div>
  );
}

export default StylePicker;
