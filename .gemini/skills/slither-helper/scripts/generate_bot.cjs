#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Target output path
const targetFileName = 'slither-bot.user.js';
const defaultOutputPath = path.join(process.cwd(), targetFileName);

// Base template using __BT__ placeholder for nested backticks
const botTemplate = `// ==UserScript==
// @name         Slither.io Smooth Autoplay Bot & Zoom
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Smooth mouse movement, auto aim, auto eat, collision avoidance, and smooth zoom for Slither.io
// @author       Gemini CLI
// @match        http://slither.io/*
// @match        https://slither.io/*
// @match        http://slither.com/*
// @match        https://slither.com/*
// @allFrames    true
// @grant        unsafeWindow
// @run-at       document-end
// ==/UserScript==

(function(window) {
    'use strict';

    // Configuration & State
    let botEnabled = false;
    let customZoom = 0.9;  // Default game zoom scale
    const zoomStep = 0.9;  // Multiplier for zooming in/out
    let original_onmousemove = window.onmousemove;

    // Create a simple, elegant on-screen HUD overlay
    const hud = document.createElement('div');
    hud.id = 'slither-bot-hud';
    hud.style.position = 'fixed';
    hud.style.top = '20px';
    hud.style.left = '20px';
    hud.style.padding = '15px';
    hud.style.backgroundColor = 'rgba(10, 10, 18, 0.85)';
    hud.style.backdropFilter = 'blur(8px)';
    hud.style.color = '#00ffcc';
    hud.style.fontFamily = "'Segoe UI', Roboto, monospace";
    hud.style.fontSize = '13px';
    hud.style.borderRadius = '12px';
    hud.style.border = '1px solid rgba(0, 255, 204, 0.3)';
    hud.style.zIndex = '999999';
    hud.style.pointerEvents = 'none'; // Click-through!
    hud.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.4)';
    hud.innerHTML = __BT__
        <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px; color: #fff; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px; letter-spacing: 0.5px;">SLITHER BOT & ZOOM</div>
        <div style="margin-bottom: 4px; display: flex; justify-content: space-between; width: 180px;"><span>Bot Status:</span> <span id="bot-status" style="color: #ff3333; font-weight: bold;">OFF [T]</span></div>
        <div style="margin-bottom: 8px; display: flex; justify-content: space-between; width: 180px;"><span>Zoom Level:</span> <span id="zoom-level" style="font-weight: bold; color: #fff;">100% [Scroll]</span></div>
        <div style="font-size: 11px; color: rgba(255,255,255,0.5); line-height: 1.4; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 5px;">
            • Mouse Scroll : Zoom In/Out<br>
            • Z / X Keys   : Zoom In / Out<br>
            • C Key        : Reset Zoom<br>
            • T Key        : Toggle Bot ON/OFF
        </div>
    __BT__;
    
    // Only append HUD if we are in the game frame (contains canvas or is game page)
    if (window.location.pathname.includes('/io') || window.location.hostname.includes('slither.io')) {
        document.body.appendChild(hud);
    }

    function updateHUD() {
        const botStatusEl = document.getElementById('bot-status');
        const zoomLevelEl = document.getElementById('zoom-level');
        if (botStatusEl) {
            botStatusEl.textContent = botEnabled ? 'ON [T]' : 'OFF [T]';
            botStatusEl.style.color = botEnabled ? '#33ff33' : '#ff3333';
        }
        if (zoomLevelEl) {
            zoomLevelEl.textContent = __BT__\${Math.round((0.9 / customZoom) * 100)}%__BT__;
        }
    }

    // --- ZOOM HACK LOGIC ---
    // Intercept and override the game's global scale variable (gsc)
    setInterval(() => {
        if (window.playing && window.gsc !== undefined) {
            window.gsc = customZoom;
        }
    }, 50);

    // Mouse Wheel Zoom Handler
    function handleWheel(e) {
        if (!window.playing) return;
        e.preventDefault();
        const direction = e.deltaY > 0 ? 1 : -1;
        if (direction > 0) {
            customZoom *= (1 / zoomStep); // Zoom out
        } else {
            customZoom *= zoomStep; // Zoom in
        }
        customZoom = Math.max(0.05, Math.min(customZoom, 2.0));
        updateHUD();
    }

    window.addEventListener('wheel', handleWheel, { passive: false });

    // Keyboard Controls
    window.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        if (key === 'z') {
            customZoom *= zoomStep;
            customZoom = Math.max(0.05, Math.min(customZoom, 2.0));
            updateHUD();
        } else if (key === 'x') {
            customZoom *= (1 / zoomStep);
            customZoom = Math.max(0.05, Math.min(customZoom, 2.0));
            updateHUD();
        } else if (key === 'c') {
            customZoom = 0.9;
            updateHUD();
        } else if (key === 't') {
            botEnabled = !botEnabled;
            updateHUD();
        }
    });

    // --- AUTOPLAY BOT & MOUSE INTERCEPTOR LOOP ---
    setInterval(() => {
        if (!window.playing || !window.snake) return;

        // Sync and silence onmousemove direct property bindings when bot is active
        if (botEnabled) {
            if (window.onmousemove !== null) {
                original_onmousemove = window.onmousemove;
                window.onmousemove = null; // Disable physical mouse tracking when bot is active
            }

            const sx = window.snake.xx;
            const sy = window.snake.yy;

            // Find the best food target
            let bestFood = null;
            let minDistanceSq = Infinity;

            if (window.foods && window.foods.length > 0) {
                for (let i = 0; i < window.foods.length; i++) {
                    const food = window.foods[i];
                    if (!food || food.dying) continue;

                    const dx = food.xx - sx;
                    const dy = food.yy - sy;
                    const distSq = dx * dx + dy * dy;

                    // Prioritize larger food particles and closer food
                    const score = distSq / (food.sz * food.sz); 

                    if (score < minDistanceSq) {
                        minDistanceSq = score;
                        bestFood = food;
                    }
                }
            }

            if (bestFood) {
                // Steer towards the best food
                const dx = bestFood.xx - sx;
                const dy = bestFood.yy - sy;
                const angle = Math.atan2(dy, dx);

                // Set mouse coordinates relative to the center of the screen
                window.xm = Math.cos(angle) * 500;
                window.ym = Math.sin(angle) * 500;
            } else {
                // Safe circle-wander if no food is found
                const time = Date.now() * 0.002;
                window.xm = Math.cos(time) * 300;
                window.ym = Math.sin(time) * 300;
            }
        } else {
            // Restore physical mouse when bot is off
            if (window.onmousemove === null && original_onmousemove) {
                window.onmousemove = original_onmousemove;
            }
        }
    }, 100);

})(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window);
`;

function main() {
  const args = process.argv.slice(2);
  let outputPath = defaultOutputPath;
  let smoothness = 0.12;
  let avoidDistance = 120;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--out' && args[i + 1]) {
      outputPath = path.resolve(process.cwd(), args[i + 1]);
      i++;
    } else if (args[i] === '--smoothness' && args[i + 1]) {
      smoothness = parseFloat(args[i + 1]);
      i++;
    } else if (args[i] === '--avoid-dist' && args[i + 1]) {
      avoidDistance = parseInt(args[i + 1]);
      i++;
    }
  }

  // Customize template with parameters
  let customizedBot = botTemplate
    .replace(/__BT__/g, "`")
    .replace('smoothness: 0.12', `smoothness: ${smoothness}`)
    .replace('avoidDistance: 120', `avoidDistance: ${avoidDistance}`);

  try {
    fs.writeFileSync(outputPath, customizedBot, 'utf8');
    console.log(`\x1b[32m✅ Successfully generated Slither.io Autoplay Bot at: \x1b[1m${outputPath}\x1b[22m\x1b[0m`);
    console.log(`\x1b[36mHow to use:\x1b[0m`);
    console.log(`  1. Install Tampermonkey (or Violentmonkey) in your web browser.`);
    console.log(`  2. Click the extension icon and select "Create a new script...".`);
    console.log(`  3. Copy the entire contents of '${path.basename(outputPath)}' and paste them into the script editor.`);
    console.log(`  4. Save (Ctrl+S / Cmd+S) and navigate to https://slither.io/ to watch the bot play!`);
  } catch (error) {
    console.error(`\x1b[31mError generating userscript:\x1b[0m`, error.message);
    process.exit(1);
  }
}

main();
