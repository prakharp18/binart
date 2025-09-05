# Binart: Digital Drawing Canvas
An intuitive, modern drawing application built with React and Konva.js that brings your creative ideas to life with powerful tools and smooth performance. **Privacy-first** - everything runs in your browser, no data ever leaves your device.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react) ![Konva.js](https://img.shields.io/badge/Konva.js-2D_Canvas-orange?style=flat-square) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Styling-38B2AC?style=flat-square&logo=tailwind-css) ![Vite](https://img.shields.io/badge/Vite-Build_Tool-646CFF?style=flat-square&logo=vite) ![Privacy](https://img.shields.io/badge/Privacy-First-green?style=flat-square&logo=shield)

[🎨 Try Live Demo](https://binart.vercel.app)

---

## Overview

Binart transforms your browser into a powerful digital canvas with a unique focus on **Binary Export (RLE)** and **complete privacy**. Your drawings never leave your device - everything runs locally in your browser with zero data collection or cloud dependencies.

The standout feature is the **RLE (Run-Length Encoding) export system** that compresses your artwork into tiny files while maintaining perfect fidelity. Combined with our privacy-first approach, this makes Binart ideal for sensitive design work, personal sketches, and collaborative projects where data ownership matters.



---

## ✨ Core Features

| Feature | Description |
|---------|-------------|
| **Privacy-First** | Complete offline functionality - no data ever leaves your browser, no tracking, no servers |
| **Drawing Tools** | Pen, brush with charcoal texture, and marker with neon glow effects |
| **Shape Library** | Rectangles, circles, triangles, stars, and diamonds |
| **Text Integration** | Add and customize text with adjustable fonts and colors |
| **Binary Export (RLE)** | Revolutionary compression system that saves entire drawings as tiny text files - the core innovation of Binart |
| **PNG Export** | Traditional image export for sharing and printing |
| **Wiggle Animation** | Dynamic animated strokes that wiggle continuously |
| **Touch Support** | Full mobile and tablet compatibility |

### 🔥 Binary Export (RLE) - The Game Changer

The **Run-Length Encoding (RLE) export** is what makes Binart special. Instead of just saving static images, it captures:

- Every stroke with perfect precision
- All drawing tool settings and styles  
- Text elements with fonts and positioning
- Shape data with exact dimensions
- Animation states and wiggle effects

A complex drawing that would be several MB as a PNG becomes just a few KB as an RLE file, while remaining fully editable when reimported. This makes Binart perfect for iterative design work and collaborative projects.

---

## 🛠️ Tech Stack

**Framework**: Next.js (React 19) with Vite for lightning-fast builds  
**Canvas Engine**: Konva.js & React-Konva for high-performance 2D graphics  
**Styling**: Tailwind CSS for responsive design  
**UI Components**: Radix UI primitives with custom styling  
**Icons**: Lucide React for consistent iconography  
**Animation**: Framer Motion & GSAP for smooth transitions and advanced animations  
**Deployment**: Vercel for seamless hosting

---

## � Getting Started

Get Binart running on your local machine in just a few steps.

### Prerequisites
- Node.js (v14 or higher)
- npm, yarn, or pnpm

### Installation

**1. Clone the Repository**
```bash
git clone https://github.com/prakharp18/binart.git
cd binart/binart
```

**2. Install Dependencies**
```bash
npm install
```

**3. Start Development Server**
```bash
npm run dev
```

**4. Open Your Browser**
Navigate to `http://localhost:5173` and start creating!

### Build for Production
```bash
npm run build
```

---

## 💡 Usage Guide

### Basic Drawing
1. Select your tool from the toolbar (pen, brush, marker, shapes, text)
2. Choose colors and adjust sizes
3. Click and drag on the canvas to create

### Binary Export/Import (RLE)
1. Click the export dropdown → "Export Binary (RLE)"
2. Your drawing is saved as a compressed text file
3. To restore: Use import dropdown → "Import RLE" and select your file
4. Your entire drawing session is perfectly recreated

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ for digital artists and creators**

[⭐ Star this repo](https://github.com/prakharp18/binart) • [💡 Request a feature](https://github.com/prakharp18/binart/issues)

</div>

