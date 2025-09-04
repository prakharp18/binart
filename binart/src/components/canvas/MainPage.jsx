import React, { useRef, useState, useEffect, useCallback } from "react";
import { Rect } from "react-konva";
import Toolbar from './Toolbar';
import Canvas from './Canvas';
import TextInput from './TextInput';
import ProgressModal from './ProgressModal';
import "../../index.css";
import "./dropdown.css";

const CANVAS_W = 6000;
const CANVAS_H = 6000;

// Util functions
function wigglePoints(basePoints, t, amp = 1.6, freq = 0.018) {
  const pts = new Array(basePoints.length);
  for (let i = 0; i < basePoints.length; i++) {
    const phase = i * 0.37;
    pts[i] = basePoints[i] + Math.sin(t * freq + phase) * amp;
  }
  return pts;
}

function rleCompress(str) {
  if (!str) return "";
  let out = "";
  let prev = str[0];
  let count = 1;
  for (let i = 1; i < str.length; i++) {
    if (str[i] === prev) count++;
    else {
      out += prev + count + "|";
      prev = str[i];
      count = 1;
    }
  }
  out += prev + count;
  return out;
}

function rleDecompress(rle) {
  if (!rle) return "";
  const pieces = rle.split("|");
  let out = "";
  for (const tok of pieces) {
    if (tok.length < 2) continue;
    const char = tok[0];
    const count = Number(tok.slice(1));
    out += char.repeat(count);
  }
  return out;
}

export default function MainPage() {
  // Refs
  const stageRef = useRef(null);
  const layerRef = useRef(null);
  const wrapperRef = useRef(null);
  const rafRef = useRef(null);
  const tRef = useRef(0);

  // State
  const [tool, setTool] = useState("pen");
  const [brushStyle, setBrushStyle] = useState("charcoal");
  const [markerStyle, setMarkerStyle] = useState("highlighter");
  const [shapeType, setShapeType] = useState("circle");
  const [brushOpen, setBrushOpen] = useState(false);
  const [markerOpen, setMarkerOpen] = useState(false);
  const [shapesOpen, setShapesOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [color, setColor] = useState("#111111");
  const [size, setSize] = useState(6);
  const [eraserSize, setEraserSize] = useState(24);
  const [lines, setLines] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [wiggleMode, setWiggleMode] = useState(false);
  const [pointerPos, setPointerPos] = useState({ x: -1000, y: -1000 });
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [isDrawingShape, setIsDrawingShape] = useState(false);
  const [shapeStartPos, setShapeStartPos] = useState({ x: 0, y: 0 });

  // Undo/Redo
  const undo = useCallback(() => {
    setLines((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setRedoStack((r) => [last, ...r]);
      return prev.slice(0, -1);
    });
  }, []);

  const redo = useCallback(() => {
    setRedoStack((r) => {
      if (r.length === 0) return r;
      const [first, ...rest] = r;
      setLines((prev) => [...prev, first]);
      return rest;
    });
  }, []);

  // Style choosers
  const chooseBrushStyle = (style) => {
    setBrushStyle(style);
    setTool("brush");
  };
  
  const chooseMarkerStyle = (style) => {
    setMarkerStyle(style);
    setTool("marker");
  };
  
  const chooseShapeType = (type) => {
    setShapeType(type);
    setTool("shapes");
  };

  const blastAll = () => {
    setLines([]);
    setRedoStack([]);
  };

  // Text handler
  const addTextToCanvas = () => {
    if (!textInput.trim()) return;
    const newText = {
      id: Date.now() + Math.random(),
      tool: 'text',
      text: textInput,
      x: textPosition.x,
      y: textPosition.y,
      color: color,
      fontSize: size * 2
    };
    setLines(prev => [...prev, newText]);
    setTextInput('');
    setShowTextInput(false);
    setRedoStack([]);
  };

  // Binary renderer
  const renderBinaryImage = (line) => {
    const { binaryData, width, x, y } = line;
    const pixelSize = 2;
    const pixels = [];
    for (let i = 0; i < binaryData.length; i++) {
      const bit = binaryData[i];
      const row = Math.floor(i / width);
      const col = i % width;
      if (bit === '1') {
        pixels.push(
          <Rect
            key={`pixel-${line.id}-${i}`}
            x={x + col * pixelSize}
            y={y + row * pixelSize}
            width={pixelSize}
            height={pixelSize}
            fill="#000000"
            listening={false}
          />
        );
      }
    }
    return pixels;
  };

  // Drawing functions
  const startDrawing = () => {
    const stage = stageRef.current;
    if (!stage) return;
    const pos = stage.getPointerPosition();
    if (!pos) return;

    if (tool === 'select') {
      // Handle selection logic
      const clickedElement = lines.find(line => {
        if (line.tool === 'shape') {
          return pos.x >= line.x && pos.x <= line.x + line.width && pos.y >= line.y && pos.y <= line.y + line.height;
        } else if (line.tool === 'text') {
          const textWidth = (line.text?.length || 0) * (line.fontSize || 20) * 0.6;
          const textHeight = line.fontSize || 20;
          return pos.x >= line.x && pos.x <= line.x + textWidth && pos.y >= line.y && pos.y <= line.y + textHeight;
        }
        return false;
      });
      
      if (clickedElement) {
        setSelectedShapeId(clickedElement.id);
        setIsDragging(true);
        setDragStart({ x: pos.x - clickedElement.x, y: pos.y - clickedElement.y });
      } else {
        setSelectedShapeId(null);
      }
      return;
    }

    setSelectedShapeId(null);

    if (tool === 'text') {
      setTextPosition(pos);
      setShowTextInput(true);
      return;
    }

    if (tool === 'shapes') {
      setShapeStartPos(pos);
      setIsDrawingShape(true);
      const newShape = {
        id: Date.now() + Math.random(),
        tool: 'shape',
        shapeType: shapeType,
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        color: color,
        strokeWidth: Math.max(2, size),
      };
      setLines(prev => [...prev, newShape]);
      setRedoStack([]);
      return;
    }

    
    const getSize = () => {
      switch (tool) {
        case "brush": return size * 1.4;
        case "marker": return size * 1.8;
        case "eraser": return eraserSize;
        default: return size;
      }
    };

    const getOpacity = () => {
      switch (tool) {
        case "marker": return markerStyle === "highlighter" ? 0.4 : 0.6;
        case "brush": return brushStyle === "charcoal" ? 0.7 : 0.9;
        default: return 1.0;
      }
    };

    const newLine = {
      id: Date.now() + Math.random(),
      tool,
      color: tool === "eraser" ? "#ffffff" : color,
      size: getSize(),
      opacity: getOpacity(),
      points: [pos.x, pos.y],
      basePoints: [pos.x, pos.y],
      wiggle: !!wiggleMode,
      brushStyle,
      markerStyle
    };
    
    setLines(prev => [...prev, newLine]);
    setIsDrawing(true);
    setPointerPos(pos);
    setRedoStack([]);
  };

  const moveDrawing = () => {
    const stage = stageRef.current;
    if (!stage) return;
    const pos = stage.getPointerPosition();
    if (!pos) return;

    setPointerPos(pos);

    if (tool === 'select' && isDragging && selectedShapeId) {
      setLines(prev => prev.map(line => {
        if (line.id === selectedShapeId && (line.tool === 'shape' || line.tool === 'text')) {
          return {
            ...line,
            x: pos.x - dragStart.x,
            y: pos.y - dragStart.y
          };
        }
        return line;
      }));
      return;
    }

    if (isDrawingShape) {
      setLines(prev => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        if (last.tool !== 'shape') return prev;
        
        const width = pos.x - shapeStartPos.x;
        const height = pos.y - shapeStartPos.y;
        return [...prev.slice(0, -1), { 
          ...last, 
          width: Math.abs(width),
          height: Math.abs(height),
          x: width < 0 ? pos.x : shapeStartPos.x,
          y: height < 0 ? pos.y : shapeStartPos.y,
        }];
      });
      return;
    }

    if (!isDrawing) return;
    
    
    setLines(prev => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      const newPoints = last.points.concat([pos.x, pos.y]);
      const newBase = last.basePoints.concat([pos.x, pos.y]);
      return [...prev.slice(0, -1), { ...last, points: newPoints, basePoints: newBase }];
    });
  };

  const endDrawing = () => {
    setIsDrawing(false);
    setIsDrawingShape(false);
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  // Export functions
  const exportPNG = async () => {
    if (!stageRef.current) return;
    try {
      const stage = stageRef.current;
      const layer = layerRef.current;
      
      const background = new window.Konva.Rect({
        x: 0, y: 0, width: 800, height: 600, fill: 'white'
      });
      
      layer.add(background);
      background.moveToBottom();
      layer.draw();
      
      const uri = stage.toDataURL({ 
        x: 0, y: 0, width: 800, height: 600,
        pixelRatio: 2, mimeType: 'image/png'
      });
      
      background.destroy();
      layer.draw();
      
      const a = document.createElement("a");
      a.href = uri;
      a.download = `drawing-${Date.now()}.png`;
      a.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const exportBinary = async () => {
    try {
      setIsExporting(true);
      setProgress(50);
      const payload = JSON.stringify(lines);
      const compressed = rleCompress(payload);
      const content = "KONVA_RLE_V1\n" + compressed;
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `drawing-rle-${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      setProgress(100);
      setTimeout(() => setIsExporting(false), 200);
    } catch (error) {
      console.error("Export failed", error);
      setIsExporting(false);
    }
  };

  const importRLE = async (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;
    try {
      setIsExporting(true);
      const text = await file.text();
      const [header, ...rest] = text.split("\n");
      let payload = rest.join("\n");
      
      if (header?.trim() === "KONVA_RLE_V1") {
        const decompressed = rleDecompress(payload);
        const parsed = JSON.parse(decompressed);
        if (Array.isArray(parsed)) {
          setLines(parsed);
          setRedoStack([]);
        }
      } else {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          setLines(parsed);
          setRedoStack([]);
        }
      }
      setIsExporting(false);
    } catch (error) {
      console.error("Import failed", error);
      setIsExporting(false);
    }
  };

  // Effects
  useEffect(() => {
    const onKey = (e) => {
      const cmd = e.ctrlKey || e.metaKey;
      if (cmd) {
        if (e.key.toLowerCase() === "z") {
          e.preventDefault();
          if (e.shiftKey) redo(); else undo();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.dropdown')) {
        setBrushOpen(false);
        setMarkerOpen(false);
        setShapesOpen(false);
        setExportOpen(false);
        setImportOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Optimized wiggle animation - only updates when needed
  useEffect(() => {
    const loop = () => {
      tRef.current += 16; // Fixed 16ms increment for consistent animation
      setLines(prev => {
        let changed = false;
        const out = prev.map(line => {
          if (!line.wiggle || !line.basePoints) return line;
          const w = wigglePoints(line.basePoints, tRef.current, 2.0, 0.06);
          changed = true;
          return { ...line, points: w };
        });
        return changed ? out : prev;
      });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="app">
      <Toolbar
        tool={tool}
        setTool={setTool}
        undo={undo}
        redo={redo}
        brushOpen={brushOpen}
        setBrushOpen={setBrushOpen}
        markerOpen={markerOpen}
        setMarkerOpen={setMarkerOpen}
        brushStyle={brushStyle}
        chooseBrushStyle={chooseBrushStyle}
        markerStyle={markerStyle}
        chooseMarkerStyle={chooseMarkerStyle}
        shapesOpen={shapesOpen}
        setShapesOpen={setShapesOpen}
        shapeType={shapeType}
        chooseShapeType={chooseShapeType}
        wiggleMode={wiggleMode}
        setWiggleMode={setWiggleMode}
        blastAll={blastAll}
        color={color}
        setColor={setColor}
        size={size}
        setSize={setSize}
        eraserSize={eraserSize}
        setEraserSize={setEraserSize}
        exportOpen={exportOpen}
        setExportOpen={setExportOpen}
        importOpen={importOpen}
        setImportOpen={setImportOpen}
        exportPNG={exportPNG}
        exportBinary={exportBinary}
        importRLE={importRLE}
      />

      <Canvas
        stageRef={stageRef}
        layerRef={layerRef}
        wrapperRef={wrapperRef}
        CANVAS_W={CANVAS_W}
        CANVAS_H={CANVAS_H}
        startDrawing={startDrawing}
        moveDrawing={moveDrawing}
        endDrawing={endDrawing}
        lines={lines}
        tool={tool}
        pointerPos={pointerPos}
        eraserSize={eraserSize}
        selectedShapeId={selectedShapeId}
        size={size}
        renderBinaryImage={renderBinaryImage}
      />

      <TextInput
        showTextInput={showTextInput}
        textPosition={textPosition}
        textInput={textInput}
        setTextInput={setTextInput}
        addTextToCanvas={addTextToCanvas}
        setShowTextInput={setShowTextInput}
        size={size}
        color={color}
      />

      <ProgressModal 
        visible={isExporting} 
        progress={progress} 
        label={progressLabel || "Working..."} 
      />
    </div>
  );
}
