import React, { useRef, useState, useEffect } from "react"
import { Stage, Layer, Line } from "react-konva"
import {
  Pencil,
  Brush,
  Highlighter,
  Eraser,
  Sparkles,
  Trash2,
  Download,
} from "lucide-react"
import "../../index.css"

export default function MainPage() {
  const stageRef = useRef(null)
  const [tool, setTool] = useState("pen")
  const [lines, setLines] = useState([])
  const [color, setColor] = useState("#000000")
  const [size, setSize] = useState(4)
  const [isDrawing, setIsDrawing] = useState(false)
  const [wiggle, setWiggle] = useState(false)

  // Handle drawing
  const handleMouseDown = (e) => {
    setIsDrawing(true)
    const pos = e.target.getStage().getPointerPosition()
    setLines([
      ...lines,
      { tool, points: [pos.x, pos.y], color, size, wiggle },
    ])
  }

  const handleMouseMove = (e) => {
    if (!isDrawing) return
    const stage = e.target.getStage()
    const point = stage.getPointerPosition()
    let lastLine = lines[lines.length - 1]
    lastLine.points = lastLine.points.concat([point.x, point.y])
    lines.splice(lines.length - 1, 1, lastLine)
    setLines(lines.concat())
  }

  const handleMouseUp = () => setIsDrawing(false)

  // Wiggle effect
  useEffect(() => {
    if (!wiggle) return
    const interval = setInterval(() => {
      setLines((prev) =>
        prev.map((line) =>
          line.wiggle
            ? {
                ...line,
                points: line.points.map((p, i) =>
                  i % 2 === 0 ? p + (Math.random() - 0.5) * 0.8 : p + (Math.random() - 0.5) * 0.8
                ),
              }
            : line
        )
      )
    }, 100)
    return () => clearInterval(interval)
  }, [wiggle])

  // Export as image
  const exportImage = () => {
    const uri = stageRef.current.toDataURL()
    const link = document.createElement("a")
    link.download = "drawing.png"
    link.href = uri
    link.click()
  }

  // Clear canvas
  const clearCanvas = () => setLines([])

  return (
    <div className="app">
      {/* Toolbar */}
      <div className="toolbar">
        {/* Tools */}
        <button
          className={tool === "pen" ? "active" : ""}
          onClick={() => setTool("pen")}
          title="Pen"
        >
          <Pencil size={20} />
        </button>

        {/* Brush w/ dropdown */}
        <div className="dropdown">
          <button className={tool === "brush" ? "active" : ""}>
            <Brush size={20} />
          </button>
          <div className="dropdown-content">
            <div onClick={() => setTool("brush")}>Smooth Brush</div>
            <div onClick={() => setTool("brush")}>Calligraphy</div>
            <div onClick={() => setTool("brush")}>Charcoal</div>
          </div>
        </div>

        {/* Marker w/ dropdown */}
        <div className="dropdown">
          <button className={tool === "marker" ? "active" : ""}>
            <Highlighter size={20} />
          </button>
          <div className="dropdown-content">
            <div onClick={() => setTool("marker")}>Highlighter</div>
            <div onClick={() => setTool("marker")}>Thick</div>
            <div onClick={() => setTool("marker")}>Neon</div>
          </div>
        </div>

        <button
          className={tool === "eraser" ? "active" : ""}
          onClick={() => setTool("eraser")}
          title="Eraser"
        >
          <Eraser size={20} />
        </button>

        <button
          className={wiggle ? "active" : ""}
          onClick={() => setWiggle(!wiggle)}
          title="Wiggle Mode"
        >
          <Sparkles size={20} />
        </button>

        <button onClick={clearCanvas} title="Clear All">
          <Trash2 size={20} />
        </button>

        {/* Colors */}
        <div className="color-swatches">
          <button
            className="swatch"
            style={{ background: "#06b6d4" }}
            onClick={() => setColor("#06b6d4")}
          />
          <button
            className="swatch"
            style={{ background: "#ec4899" }}
            onClick={() => setColor("#ec4899")}
          />
          <button
            className="swatch"
            style={{ background: "#facc15" }}
            onClick={() => setColor("#facc15")}
          />
        </div>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />

        {/* Size only for brush/marker */}
        {(tool === "brush" || tool === "marker") && (
          <input
            type="range"
            min="2"
            max="40"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          />
        )}

        {/* Export */}
        <button onClick={exportImage} title="Export">
          <Download size={20} />
        </button>
      </div>

      {/* Canvas */}
      <div className="canvas-container">
        <Stage
          width={4000}
          height={4000}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          ref={stageRef}
        >
          <Layer>
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.tool === "eraser" ? "white" : line.color}
                strokeWidth={line.tool === "marker" ? line.size * 2 : line.size}
                tension={0.5}
                lineCap="round"
                globalCompositeOperation={
                  line.tool === "eraser" ? "destination-out" : "source-over"
                }
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  )
}
