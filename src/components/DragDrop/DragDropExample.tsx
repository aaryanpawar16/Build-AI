import React, { useState } from 'react';

// Simple drag and drop component using HTML5 API
export const DragDropExample: React.FC = () => {
  const [droppedItems, setDroppedItems] = useState<string[]>([]);

  // Available items that can be dragged
  const availableItems = ['Text', 'Button', 'Input', 'Card', 'Image'];

  // Handle drag start - sets the data being dragged
  const handleDragStart = (e: React.DragEvent, item: string) => {
    e.dataTransfer.setData('text/plain', item);
    e.dataTransfer.effectAllowed = 'copy';
    
    // Add visual feedback
    const target = e.target as HTMLElement;
    target.style.opacity = '0.5';
  };

  // Handle drag end - reset visual feedback
  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    target.style.opacity = '1';
  };

  // Handle drag over - CRITICAL: must prevent default to allow drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // This is ESSENTIAL - without it, drop won't work
    e.dataTransfer.dropEffect = 'copy';
  };

  // Handle drop - gets the dragged data and updates state
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); // Prevent default behavior
    
    const draggedItem = e.dataTransfer.getData('text/plain');
    if (draggedItem) {
      setDroppedItems(prev => [...prev, `${draggedItem}-${Date.now()}`]);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Drag & Drop Demo</h2>
      
      <div className="grid grid-cols-2 gap-8">
        {/* Draggable Items List */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Available Components</h3>
          <div className="space-y-2">
            {availableItems.map((item) => (
              <div
                key={item}
                draggable={true} // Make element draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onDragEnd={handleDragEnd}
                className="p-3 bg-blue-100 border border-blue-200 rounded-lg cursor-grab active:cursor-grabbing hover:bg-blue-200 transition-colors select-none"
                style={{ userSelect: 'none' }} // Prevent text selection
              >
                📦 {item}
              </div>
            ))}
          </div>
        </div>

        {/* Drop Zone */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Canvas (Drop Zone)</h3>
          <div
            onDragOver={handleDragOver} // CRITICAL: allows drop by preventing default
            onDrop={handleDrop} // Handles the actual drop
            className="min-h-[300px] p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            {droppedItems.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                Drop components here
              </div>
            ) : (
              <div className="space-y-2">
                {droppedItems.map((item, index) => (
                  <div
                    key={item}
                    className="p-2 bg-green-100 border border-green-200 rounded text-green-800"
                  >
                    ✅ {item.split('-')[0]} (dropped)
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={() => setDroppedItems([])}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
      >
        Clear Canvas
      </button>
    </div>
  );
};