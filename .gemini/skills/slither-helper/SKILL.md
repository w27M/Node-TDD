---
name: slither-helper
description: Generates, optimizes, and configures an advanced Slither.io Autoplay and Smooth Steering userscript. Use when the user wants to play Slither.io with smooth mouse controls, automatic aim, auto-eating, and threat/collision avoidance.
---

# Slither.io Helper Skill

This skill provides an automated generator and guide to run a highly sophisticated autoplay and smooth steering bot for [slither.io](https://slither.io/). 

The generated userscript runs inside your browser using **Tampermonkey** or **Violentmonkey**, guaranteeing zero input lag and direct access to game variables for real-time math-based movement and avoidance.

---

## Core Capabilities

1. **Smooth Mouse LERP:** Prevents sharp, jerky snappings that lead to collision errors. Smoothly interpolates the turn angle towards the mouse or target.
2. **Auto-Aim & Auto-Eat:** Automatically identifies and scores the highest value food pellets nearby based on size and proximity.
3. **Collision Avoidance:** Computes real-time threat avoidance vectors from nearby enemy snake heads/bodies and the map boundary, automatically overriding pathing to prioritize survival.
4. **Smooth Scroll Zoom:** Allows seamless infinite zooming on mousewheel scroll.
5. **Modern Glassmorphic Control Panel:** Draggable, collapsible in-game overlay to toggle autopilot, adjustment sliders, and visual debug lines (showing food/danger vectors).

---

## Usage Guide

To generate the customized Slither.io userscript, use the bundled generation script.

### 1. Standard Generation
By default, the script will generate a file named `slither-bot.user.js` in your current working directory.

```bash
node .gemini/skills/slither-helper/scripts/generate_bot.cjs
```

### 2. Customized Generation
You can pass flags to customize the default parameters of the output script:

* **Change Output Path:** `--out <path>` (e.g., `dist/bot.js`)
* **Modify Mouse Smoothness:** `--smoothness <value>` (default `0.12`. Lower is smoother/wider turns, higher is sharper turns)
* **Modify Safety Threshold:** `--avoid-dist <pixels>` (default `120`. Avoidance distance from threats)

**Example:**
```bash
node .gemini/skills/slither-helper/scripts/generate_bot.cjs --smoothness 0.15 --avoid-dist 140 --out ./my-slither-bot.user.js
```

---

## Installation & Setup Instructions

Once you've generated the userscript file (e.g., `slither-bot.user.js`):

1. **Install a Userscript Manager:**
   Install [Tampermonkey](https://www.tampermonkey.net/) (recommended) or [Violentmonkey] as a browser extension (Chrome, Edge, Firefox, Safari).

2. **Add the Script:**
   - Click your extension icon and select **"Create a new script..."**.
   - Select and delete all existing placeholder code in the editor.
   - Open your generated `slither-bot.user.js` file, copy all of its content, and paste it into the Tampermonkey editor.
   - Save the script (`Ctrl + S` or `Cmd + S`).

3. **Play:**
   - Navigate to [https://slither.io/](https://slither.io/).
   - The Glassmorphic menu will appear in the top-left.
   - Press **Key 'T'** to toggle the Autopilot bot on/off, or adjust settings using the sliders in real-time!
   - Scroll your mousewheel to zoom out for better battlefield awareness.
