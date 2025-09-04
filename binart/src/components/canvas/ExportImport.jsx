import React from 'react';
import {
  Download,
  Upload,
  ChevronDown,
  FileImage,
  Binary
} from "lucide-react";

const ExportImport = ({
  exportOpen,
  setExportOpen,
  importOpen,
  setImportOpen,
  exportPNG,
  exportBinary,
  importRLE
}) => {
  return (
    <>
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
    </>
  );
};

export default ExportImport;
