import React, { useState, useRef } from "react";
import { Stage, Layer, Line } from "react-konva";
import {
  Pencil,
  Highlighter,
  Eraser,
  Paintbrush,
  Trash2,
  Save,
  Shuffle,
  Bomb,
} from "lucide-react";

export default function MainPage() {
  const [tool, setTool] = useState("pen");
  const [lines, setLines] = useState([]);
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [eraserWidth, setEraserWidth] = useState(10);
  const isDrawing = useRef(false);
  const stageRef = useRef(null);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([
      ...lines,
      {
        tool,
        points: [pos.x, pos.y],
        color,
        strokeWidth:
          tool === "marker"
            ? strokeWidth * 2
            : tool === "brush"
            ? strokeWidth * 1.5
            : tool === "eraser"
            ? eraserWidth
            : 3, // pen always fixed size
      },
    ]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    const newLines = lines.slice(0, lines.length - 1).concat(lastLine);
    setLines(newLines);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleClear = () => {
    setLines([]);
  };

  const handleExport = () => {
    const uri = stageRef.current.toDataURL();
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = uri;
    link.click();
  };

  return (
    <div className="w-screen h-screen relative bg-gray-50">
      {/* ✅ Toolbar */}
      <div className="toolbar">
        <button
          className={tool === "pen" ? "active" : ""}
          onClick={() => setTool("pen")}
        >
          <Pencil size={18} />
        </button>
        <button
          className={tool === "marker" ? "active" : ""}
          onClick={() => setTool("marker")}
        >
          <Highlighter size={18} />
        </button>
        <button
          className={tool === "brush" ? "active" : ""}
          onClick={() => setTool("brush")}
        >
          <Paintbrush size={18} />
        </button>
        <button
          className={tool === "eraser" ? "active" : ""}
          onClick={() => setTool("eraser")}
        >
          <Eraser size={18} />
        </button>

        {/* ✅ Color only for marker/brush */}
        {(tool === "marker" || tool === "brush") && (
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        )}

        {/* ✅ Size bar only for marker/brush */}
        {(tool === "marker" || tool === "brush") && (
          <input
            type="range"
            min="1"
            max="20"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
          />
        )}

        {/* ✅ Eraser size */}
        {tool === "eraser" && (
          <input
            type="range"
            min="5"
            max="50"
            value={eraserWidth}
            onChange={(e) => setEraserWidth(Number(e.target.value))}
          />
        )}

        <button onClick={handleExport}>
          <Save size={18} />
        </button>
        <button onClick={handleClear}>
          <Trash2 size={18} />
        </button>
        <button onClick={handleClear}>
          <Bomb size={18} className="text-red-500" /> {/* 💥 BOOM! */}
        </button>
        <button onClick={() => alert("Wiggle mode coming soon!")}>
          <Shuffle size={18} />
        </button>
      </div>

      {/* ✅ Drawing canvas */}
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        className="cursor-crosshair"
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.color}
              strokeWidth={line.strokeWidth}
              tension={0.6}
              bezier={true}
              opacity={line.tool === "brush" ? 0.5 : 1}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                line.tool === "eraser" ? "destination-out" : "source-over"
              }
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
