import React, { useState } from 'react';

// Minimal drag and drop component using HTML5 API
export const MinimalDragDrop: React.FC = () => {
  const [droppedItems, setDroppedItems] = useState<string[]>([]);

  // Available items that can be dragged
  const availableItems = ['Text', 'Button', 'Input', 'Card', 'Image'];

  // CRITICAL: Handle drag start - sets the data being dragged
  const handleDragStart = (e: React.DragEvent, item: string) => {
    // Store the dragged item data - this is what gets transferred to drop zone
    e.dataTransfer.setData('text/plain', item);
    e.dataTransfer.effectAllowed = 'copy';
    
    // Visual feedback during drag
    const target = e.target as HTMLElement;
    target.style.opacity = '0.5';
  };

  // Reset visual feedback when drag ends
  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    target.style.opacity = '1';
  };

  // CRITICAL: Handle drag over - MUST prevent default to allow drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // This is ESSENTIAL - without it, drop won't work
    e.dataTransfer.dropEffect = 'copy';
  };

  // CRITICAL: Handle drop - gets the dragged data and updates state
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); // Prevent default browser behavior
    
    // Get the data that was set in handleDragStart
    const draggedItem = e.dataTransfer.getData('text/plain');
    if (draggedItem) {
      // Add the dropped item to our state with unique ID
      setDroppedItems(prev => [...prev, `${draggedItem}-${Date.now()}`]);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Drag & Drop Components</h2>
      
      <div className="grid grid-cols-2 gap-8">
        {/* LEFT SIDE: Draggable Items List */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Available Components</h3>
          <div className="space-y-2">
            {availableItems.map((item) => (
              <div
                key={item}
                draggable={true} // Make element draggable
                onDragStart={(e) => handleDragStart(e, item)} // Set drag data
                onDragEnd={handleDragEnd} // Reset visual feedback
                className="p-3 bg-blue-100 border border-blue-200 rounded-lg cursor-grab active:cursor-grabbing hover:bg-blue-200 transition-colors select-none"
                style={{ 
                  userSelect: 'none', // Prevent text selection - CRITICAL for drag to work
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none'
                }}
              >
                📦 {item}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: Drop Zone */}
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
                    ✅ {item.split('-')[0]} (dropped at {new Date().toLocaleTimeString()})
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

/*
HOW THIS FIXES DRAG-AND-DROP ISSUES:

1. **onDragStart**: 
   - Sets the data being transferred using e.dataTransfer.setData()
   - Provides visual feedback by reducing opacity
   - CRITICAL: This is where we define what gets dragged

2. **onDragOver**: 
   - MUST call e.preventDefault() - this is the most common issue
   - Without preventDefault(), the drop zone won't accept drops
   - Sets the visual drop effect

3. **onDrop**: 
   - MUST call e.preventDefault() to prevent default browser behavior
   - Retrieves the data using e.dataTransfer.getData()
   - Updates component state with the dropped item

4. **Text Selection Prevention**:
   - userSelect: 'none' prevents text selection during drag
   - This is CRITICAL - text selection interferes with dragging

5. **Cursor States**:
   - cursor-grab when hovering
   - cursor-grabbing when actively dragging
   - Provides clear visual feedback to users

COMMON ISSUES THIS FIXES:
- Items not dragging: Usually missing userSelect: 'none'
- Drop not working: Usually missing e.preventDefault() in onDragOver
- Data not transferring: Usually incorrect dataTransfer usage
- Visual glitches: Usually missing drag end handlers
*/