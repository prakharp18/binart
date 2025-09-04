import React from 'react';
import { Stage, Layer, Line, Circle, Text, Rect } from 'react-konva';

const Canvas = ({
  stageRef,
  layerRef,
  wrapperRef,
  CANVAS_W,
  CANVAS_H,
  startDrawing,
  moveDrawing,
  endDrawing,
  lines,
  tool,
  pointerPos,
  eraserSize,
  selectedShapeId,
  size,
  renderBinaryImage
}) => {
  const handleTouchStart = (e) => {
    e.evt.preventDefault(); // Prevent scrolling
    startDrawing(e);
  };

  const handleTouchMove = (e) => {
    e.evt.preventDefault(); // Prevent scrolling
    moveDrawing(e);
  };

  const handleTouchEnd = (e) => {
    e.evt.preventDefault(); // Prevent scrolling
    endDrawing(e);
  };

  return (
    <div 
      ref={wrapperRef} 
      className="canvas-wrapper"
      style={{ 
        width: "100%", 
        height: "100vh", 
        overflow: "auto", 
        position: "relative",
        background: "linear-gradient(180deg, #faf9f7, #f5f4f2)",
        backgroundImage: "radial-gradient(circle at 2px 2px, rgba(0,0,0,0.04) 1px, transparent 0)",
        backgroundSize: "25px 25px",
        touchAction: "none"
      }}
    >
      <Stage
        ref={stageRef}
        width={CANVAS_W}
        height={CANVAS_H}
        onMouseDown={startDrawing}
        onMouseMove={moveDrawing}
        onMouseUp={endDrawing}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ background: "#f5f4f2", touchAction: "none" }}
      >
        <Layer ref={layerRef}>
          {lines.map((line) => {
            if (line.tool === 'text') {
              return (
                <Text
                  key={line.id}
                  x={line.x}
                  y={line.y}
                  text={line.text}
                  fontSize={line.fontSize || size * 2}
                  fill={line.color}
                  fontFamily="Inter, Arial, sans-serif"
                />
              );
            }

            if (line.tool === 'shape') {
              if (line.shapeType === 'circle') {
                return (
                  <Circle
                    key={line.id}
                    x={line.x + line.width / 2}
                    y={line.y + line.height / 2}
                    radius={Math.min(line.width, line.height) / 2}
                    stroke={line.color}
                    strokeWidth={line.strokeWidth}
                    fill="transparent"
                  />
                );
              } else if (line.shapeType === 'triangle') {
                const trianglePoints = [
                  line.x + line.width / 2, line.y,
                  line.x, line.y + line.height,
                  line.x + line.width, line.y + line.height,
                ];
                return (
                  <Line
                    key={line.id}
                    points={trianglePoints}
                    stroke={line.color}
                    strokeWidth={line.strokeWidth}
                    fill="transparent"
                    closed={true}
                  />
                );
              } else if (line.shapeType === 'star') {
                const starPoints = [];
                const outerRadius = Math.min(line.width, line.height) / 2;
                const innerRadius = outerRadius * 0.4;
                const centerX = line.x + line.width / 2;
                const centerY = line.y + line.height / 2;
                for (let i = 0; i < 10; i++) {
                  const radius = i % 2 === 0 ? outerRadius : innerRadius;
                  const angle = (i * Math.PI) / 5;
                  starPoints.push(centerX + radius * Math.sin(angle));
                  starPoints.push(centerY - radius * Math.cos(angle));
                }
                return (
                  <Line
                    key={line.id}
                    points={starPoints}
                    stroke={line.color}
                    strokeWidth={line.strokeWidth}
                    fill="transparent"
                    closed={true}
                  />
                );
              } else if (line.shapeType === 'diamond') {
                const diamondPoints = [
                  line.x + line.width / 2, line.y,
                  line.x + line.width, line.y + line.height / 2,
                  line.x + line.width / 2, line.y + line.height,
                  line.x, line.y + line.height / 2,
                ];
                return (
                  <Line
                    key={line.id}
                    points={diamondPoints}
                    stroke={line.color}
                    strokeWidth={line.strokeWidth}
                    fill="transparent"
                    closed={true}
                  />
                );
              } else {
                return (
                  <Rect
                    key={line.id}
                    x={line.x}
                    y={line.y}
                    width={line.width}
                    height={line.height}
                    stroke={line.color}
                    strokeWidth={line.strokeWidth}
                    fill="transparent"
                  />
                );
              }
            }

            if (line.tool === 'binary-import') {
              return renderBinaryImage(line);
            }

            // Simple, fast stroke rendering
            if (line.tool === 'pen' || line.tool === 'brush' || line.tool === 'marker') {
              const hasNeonGlow = line.tool === 'marker' && line.markerStyle === 'neon';
              return (
                <Line
                  key={line.id}
                  points={line.points}
                  stroke={line.color}
                  strokeWidth={line.size}
                  opacity={line.opacity || 1}
                  tension={0.3}
                  lineCap="round"
                  lineJoin="round"
                  shadowColor={hasNeonGlow ? line.color : undefined}
                  shadowBlur={hasNeonGlow ? 8 : 0}
                  shadowOpacity={hasNeonGlow ? 0.6 : 0}
                />
              );
            }

            // Fallback for eraser and other tools
            return (
              <Line
                key={line.id}
                points={line.points}
                stroke={line.tool === "eraser" ? "#ffffff" : line.color}
                strokeWidth={line.size}
                opacity={line.opacity || 1}
                tension={0.3}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={line.tool === "eraser" ? "destination-out" : "source-over"}
              />
            );
          })}

          {/* Eraser preview */}
          {tool === "eraser" && (
            <Circle
              x={pointerPos.x}
              y={pointerPos.y}
              radius={eraserSize / 2}
              stroke="#00000033"
              dash={[6, 6]}
            />
          )}

          {/* Selection box for selected shape or text */}
          {selectedShapeId && (() => {
            const selectedElement = lines.find(line => line.id === selectedShapeId);
            if (!selectedElement || (selectedElement.tool !== 'shape' && selectedElement.tool !== 'text')) return null;
            
            let bounds;
            if (selectedElement.tool === 'shape') {
              bounds = {
                x: selectedElement.x,
                y: selectedElement.y,
                width: selectedElement.width,
                height: selectedElement.height
              };
            } else if (selectedElement.tool === 'text') {
              const textWidth = (selectedElement.text?.length || 0) * (selectedElement.fontSize || 20) * 0.6;
              const textHeight = selectedElement.fontSize || 20;
              bounds = {
                x: selectedElement.x,
                y: selectedElement.y,
                width: textWidth,
                height: textHeight
              };
            }
            
            return (
              <>
                <Rect
                  x={bounds.x - 2}
                  y={bounds.y - 2}
                  width={bounds.width + 4}
                  height={bounds.height + 4}
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dash={[8, 4]}
                  fill="transparent"
                  listening={false}
                />
                
                {selectedElement.tool === 'shape' && [
                  { x: bounds.x - 4, y: bounds.y - 4, handle: 'nw' },
                  { x: bounds.x + bounds.width - 4, y: bounds.y - 4, handle: 'ne' },
                  { x: bounds.x - 4, y: bounds.y + bounds.height - 4, handle: 'sw' },
                  { x: bounds.x + bounds.width - 4, y: bounds.y + bounds.height - 4, handle: 'se' }
                ].map(({ x, y, handle }) => (
                  <Rect
                    key={handle}
                    x={x}
                    y={y}
                    width={8}
                    height={8}
                    fill="#3b82f6"
                    stroke="#ffffff"
                    strokeWidth={1}
                    listening={false}
                  />
                ))}
              </>
            );
          })()}
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas;
