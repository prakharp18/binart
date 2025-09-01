import { useState, useRef } from "react";
import { Stage, Layer, Line } from "react-konva";
import { Button } from "@/components/ui/button"; // shadcn UI
import { Slider } from "@/components/ui/slider"; // shadcn UI

export default function DrawingBoard() {
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("black");
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);
  const stageRef = useRef(null);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, color, strokeWidth, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    setLines([...lines.slice(0, -1), lastLine]);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleUndo = () => {
    setLines(lines.slice(0, -1));
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
    <div className="flex h-screen w-screen bg-gray-100">
      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center">
        <Stage
          width={800}
          height={600}
          className="bg-white border shadow-xl"
          ref={stageRef}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
        >
          <Layer>
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.color}
                strokeWidth={line.strokeWidth}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
              />
            ))}
          </Layer>
        </Stage>
      </div>

      {/* Sidebar Tools */}
      <div className="w-40 bg-gray-200 flex flex-col items-center p-4 space-y-4 shadow-lg">
        <h2 className="font-bold">Tools</h2>
        <Button onClick={() => setTool("pen")}>✏ Pen</Button>
        <Button onClick={() => setTool("brush")}>🖌 Brush</Button>
        <Button onClick={() => setTool("marker")}>✒ Marker</Button>
        <Button onClick={() => setTool("eraser")}>🩹 Eraser</Button>

        <div className="mt-4">
          <h3 className="font-bold">Colors</h3>
          <div className="flex space-x-2 mt-2">
            <button
              className="w-6 h-6 bg-pink-500 rounded-full"
              onClick={() => setColor("pink")}
            />
            <button
              className="w-6 h-6 bg-cyan-500 rounded-full"
              onClick={() => setColor("cyan")}
            />
            <button
              className="w-6 h-6 bg-yellow-400 rounded-full"
              onClick={() => setColor("yellow")}
            />
          </div>
        </div>

        <Button variant="destructive" onClick={handleClear}>
          Obliterate ⚡
        </Button>
      </div>

      {/* Bottom Toolbar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-4 bg-white px-6 py-3 rounded-xl shadow-lg">
        <Button onClick={handleExport}>Export</Button>
        <Button onClick={handleUndo}>Oops! (Undo)</Button>
        <div className="flex items-center space-x-2">
          <span>Marker Size</span>
          <Slider
            defaultValue={[strokeWidth]}
            max={20}
            min={1}
            step={1}
            className="w-32"
            onValueChange={(val) => setStrokeWidth(val[0])}
          />
        </div>
      </div>
    </div>
  );
}
