import React from 'react';
import {
  Pencil,
  Brush as BrushIcon,
  Highlighter,
  Eraser as EraserIcon,
  Sparkles,
  Trash2,
  CornerUpLeft,
  CornerUpRight,
  ChevronDown,
  Type,
  Circle as CircleIcon,
  Square,
  Triangle,
  Star,
  Diamond,
  MousePointer,
  Download,
  Upload,
  FileImage,
  Binary
} from "lucide-react";

const Toolbar = ({
  tool,
  setTool,
  brushStyle,
  setBrushStyle,
  markerStyle,
  setMarkerStyle,
  shapeType,
  setShapeType,
  brushOpen,
  setBrushOpen,
  markerOpen,
  setMarkerOpen,
  shapesOpen,
  setShapesOpen,
  exportOpen,
  setExportOpen,
  importOpen,
  setImportOpen,
  wiggleMode,
  setWiggleMode,
  color,
  setColor,
  size,
  setSize,
  eraserSize,
  setEraserSize,
  undo,
  redo,
  blastAll,
  chooseBrushStyle,
  chooseMarkerStyle,
  chooseShapeType,
  exportPNG,
  exportBinary,
  importRLE,
  exportDropdown,
  importDropdown
}) => {
  return (
    <div className="toolbar">
      {/* Undo */}
      <button className="tool-btn" title="Undo (Ctrl/Cmd+Z)" onClick={undo}>
        <CornerUpLeft size={18} />
      </button>
      {/* Redo */}
      <button className="tool-btn" title="Redo (Ctrl/Cmd+Shift+Z)" onClick={redo}>
        <CornerUpRight size={18} />
      </button>

      {/* Selection Tool */}
      <button
        className={`tool-btn ${tool === "select" ? "active" : ""}`}
        onClick={() => setTool("select")}
        title="Select Shapes & Text"
      >
        <MousePointer size={18} />
      </button>

      {/* Pen */}
      <button
        className={`tool-btn ${tool === "pen" ? "active" : ""}`}
        onClick={() => setTool("pen")}
        title="Pen"
      >
        <Pencil size={18} />
      </button>

      {/* Brush - Charcoal Default */}
      <button
        className={`tool-btn ${tool === "brush" ? "active" : ""}`}
        onClick={() => chooseBrushStyle("charcoal")}
        title="Charcoal Brush"
      >
        <BrushIcon size={18} />
      </button>

      {/* Marker dropdown */}
      <div className={`dropdown ${markerOpen ? 'open' : ''}`}>
        <button
          className={`tool-btn dropdown-btn ${tool === "marker" ? "active" : ""}`}
          title="Marker"
          onClick={() => {
            setMarkerOpen((s) => !s);
            setBrushOpen(false);
          }}
        >
          <Highlighter size={16} />
          <ChevronDown size={12} />
        </button>
        {markerOpen && (
          <div className="dropdown-menu">
            <div
              className={`dropdown-option ${markerStyle === "highlighter" ? "selected" : ""}`}
              onClick={() => {
                chooseMarkerStyle("highlighter");
                setMarkerOpen(false);
              }}
            >
              <Highlighter size={16} />
              <span>Highlighter</span>
            </div>
            <div
              className={`dropdown-option ${markerStyle === "thick" ? "selected" : ""}`}
              onClick={() => {
                chooseMarkerStyle("thick");
                setMarkerOpen(false);
              }}
            >
              <Highlighter size={16} />
              <span>Thick Marker</span>
            </div>
            <div
              className={`dropdown-option ${markerStyle === "neon" ? "selected" : ""}`}
              onClick={() => {
                chooseMarkerStyle("neon");
                setMarkerOpen(false);
              }}
            >
              <Highlighter size={16} />
              <span>Neon Glow</span>
            </div>
          </div>
        )}
      </div>

      {/* Text tool */}
      <button
        className={`tool-btn ${tool === "text" ? "active" : ""}`}
        onClick={() => setTool("text")}
        title="Text Tool"
      >
        <Type size={18} />
      </button>

      {/* Shapes dropdown */}
      <div className={`dropdown ${shapesOpen ? 'open' : ''}`}>
        <button
          className={`tool-btn dropdown-btn ${tool === "shapes" ? "active" : ""}`}
          title="Shapes"
          onClick={() => {
            setShapesOpen((s) => !s);
            setBrushOpen(false);
            setMarkerOpen(false);
          }}
        >
          <Square size={16} />
          <ChevronDown size={12} />
        </button>
        {shapesOpen && (
          <div className="dropdown-menu">
            <div
              className={`dropdown-option ${shapeType === "square" ? "selected" : ""}`}
              onClick={() => {
                chooseShapeType("square");
                setShapesOpen(false);
              }}
            >
              <Square size={16} />
              <span>Rectangle</span>
            </div>
            <div
              className={`dropdown-option ${shapeType === "circle" ? "selected" : ""}`}
              onClick={() => {
                chooseShapeType("circle");
                setShapesOpen(false);
              }}
            >
              <CircleIcon size={16} />
              <span>Circle</span>
            </div>
            <div
              className={`dropdown-option ${shapeType === "triangle" ? "selected" : ""}`}
              onClick={() => {
                chooseShapeType("triangle");
                setShapesOpen(false);
              }}
            >
              <Triangle size={16} />
              <span>Triangle</span>
            </div>
            <div
              className={`dropdown-option ${shapeType === "star" ? "selected" : ""}`}
              onClick={() => {
                chooseShapeType("star");
                setShapesOpen(false);
              }}
            >
              <Star size={16} />
              <span>Star</span>
            </div>
            <div
              className={`dropdown-option ${shapeType === "diamond" ? "selected" : ""}`}
              onClick={() => {
                chooseShapeType("diamond");
                setShapesOpen(false);
              }}
            >
              <Diamond size={16} />
              <span>Diamond</span>
            </div>
          </div>
        )}
      </div>

      {/* Eraser */}
      <button
        className={`tool-btn ${tool === "eraser" ? "active" : ""}`}
        onClick={() => setTool("eraser")}
        title="Eraser"
      >
        <EraserIcon size={18} />
      </button>

      {/* Wiggle toggle */}
      <button
        className={`tool-btn ${wiggleMode ? "active" : ""}`}
        onClick={() => setWiggleMode((s) => !s)}
        title="Wiggle mode (new strokes will wiggle forever)"
      >
        <Sparkles size={18} />
      </button>

      {/* Blast */}
      <button className="tool-btn" onClick={blastAll} title="Blast / Clear all">
        <Trash2 size={18} />
      </button>

      {/* Color swatches */}
      <div className="color-swatches">
        <button className="swatch cyan" onClick={() => setColor("#06b6d4")} />
        <button className="swatch pink" onClick={() => setColor("#ec4899")} />
        <button className="swatch yellow" onClick={() => setColor("#facc15")} />
      </div>

      {/* color picker */}
      <input
        aria-label="Pick color"
        className="color-input"
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />

      {/* size slider */}
      {(tool === "pen" || tool === "brush" || tool === "marker" || tool === "text" || tool === "shapes") && (
        <input
          className="size-slider"
          type="range"
          min="2"
          max="80"
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          title="Pen / Brush / Marker / Text / Shape size"
        />
      )}
      {tool === "eraser" && (
        <input
          className="size-slider"
          type="range"
          min="6"
          max="200"
          value={eraserSize}
          onChange={(e) => setEraserSize(Number(e.target.value))}
          title="Eraser size"
        />
      )}

      {/* Export Dropdown */}
      <div className={`dropdown ${exportOpen ? 'open' : ''}`}>
        <button
          className="tool-btn dropdown-btn"
          title="Export"
          onClick={() => {
            setExportOpen((s) => !s);
            setImportOpen(false);
          }}
        >
          <Download size={16} />
          <ChevronDown size={12} />
        </button>
        {exportOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-option" onClick={() => { exportPNG(); setExportOpen(false); }}>
              <FileImage size={16} />
              <span>Export PNG</span>
            </div>
            <div className="dropdown-option" onClick={() => { exportBinary(); setExportOpen(false); }}>
              <Binary size={16} />
              <span>Export Binary (RLE)</span>
            </div>
          </div>
        )}
      </div>

      {/* Import Dropdown */}
      <div className={`dropdown ${importOpen ? 'open' : ''}`}>
        <button
          className="tool-btn dropdown-btn"
          title="Import"
          onClick={() => {
            setImportOpen((s) => !s);
            setExportOpen(false);
          }}
        >
          <Upload size={16} />
          <ChevronDown size={12} />
        </button>
        {importOpen && (
          <div className="dropdown-menu">
            <label className="dropdown-option" style={{ cursor: 'pointer' }}>
              <Binary size={16} />
              <span>Import RLE (strokes)</span>
              <input
                type="file"
                accept=".txt"
                onChange={(e) => { importRLE(e); setImportOpen(false); }}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
