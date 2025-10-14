# 🏌️ How to Play - Escape the Jungle Mini Golf

Welcome to **Escape the Jungle Mini Golf**! This guide will help you get the game running and teach you how to play.

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Starting the Game](#starting-the-game)
3. [Game Controls](#game-controls)
4. [How to Play](#how-to-play)
5. [Scoring Guide](#scoring-guide)
6. [Tips & Tricks](#tips--tricks)
7. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

Before you can play, make sure you have:

1. **Node.js installed** on your computer
   - Download from: https://nodejs.org/
   - Version 12 or higher is recommended
   - To check if installed, open Command Prompt/Terminal and type: `node --version`

2. **A modern web browser**
   - Google Chrome (recommended)
   - Firefox
   - Microsoft Edge
   - Safari

---

## 🚀 Starting the Game

### Step 1: Extract the Game Folder

If you received a zip file, extract it to a location on your computer (e.g., Desktop or Documents).

### Step 2: Install Dependencies

**Only needed the first time:**

1. Open the game folder in **File Explorer**
2. In the address bar at the top, type `cmd` and press **Enter**
   - This opens Command Prompt in the game folder
3. Type this command and press **Enter**:
   ```bash
   npm install
   ```
4. Wait for it to finish (takes 30-60 seconds)

### Step 3: Start the Server

**Every time you want to play:**

#### **Option A: Using Command Prompt (Windows)**

1. Open the game folder in **File Explorer**
2. In the address bar, type `cmd` and press **Enter**
3. Type this command:
   ```bash
   node_modules\.bin\http-server public -p 8080
   ```
4. Press **Enter**
5. You should see:
   ```
   Starting up http-server, serving public
   Available on:
     http://127.0.0.1:8080
   Hit CTRL-C to stop the server
   ```

#### **Option B: Using PowerShell (Windows)**

1. Open the game folder in **File Explorer**
2. Hold **Shift** and **right-click** in an empty space
3. Select "Open PowerShell window here"
4. Type:
   ```powershell
   .\node_modules\.bin\http-server public -p 8080
   ```
5. Press **Enter**

#### **Option C: Using VS Code (If Available)**

1. Open the game folder in **VS Code**
2. Open the **Terminal** (View → Terminal or Ctrl+`)
3. Type:
   ```bash
   .\node_modules\.bin\http-server public -p 8080
   ```
4. Press **Enter**

### Step 4: Open the Game in Your Browser

1. **Open your web browser** (Chrome recommended)
2. In the address bar, type:
   ```
   http://localhost:8080
   ```
   **OR**
   ```
   http://127.0.0.1:8080
   ```
3. Press **Enter**
4. **The game should load!** 🎉

### Step 5: Play!

You're ready to play! See the controls section below.

---

## 🎮 Game Controls

### Keyboard Controls

| Key | Action |
|-----|--------|
| **SPACE** | Hit the ball / Advance to next hole |
| **R** | Reset ball to starting position / Restart game |
| **↑ (Arrow Up)** | Increase shot power (+1) |
| **↓ (Arrow Down)** | Decrease shot power (-1) |

### Mouse Controls

| Action | What It Does |
|--------|--------------|
| **Move Mouse** | Aim your shot - you'll see a colored line showing where the ball will go |

### On-Screen Display

The game shows you:
- **Hole Number and Par** - Top left (e.g., "Hole 1 of 3 (Par 3)")
- **Strokes** - How many times you've hit the ball
- **Power Level** - Current shot power (1-15)
- **Controls Help** - Reminder of what keys do what

---

## 🏌️ How to Play

### Objective

Complete all **3 holes** by getting the golf ball into the black circular hole at the end of each course. Try to do it in as few strokes (hits) as possible!

### The Course

The game has **3 holes** with increasing difficulty:

1. **Hole 1: Welcome to the Jungle** (Par 3)
   - A gentle introduction
   - Few obstacles to navigate around

2. **Hole 2: Rocky Path** (Par 4)
   - More challenging
   - More obstacles blocking your path

3. **Hole 3: The Gauntlet** (Par 5)
   - The ultimate challenge!
   - Many obstacles requiring strategic shots

### Playing a Hole

1. **Aim Your Shot**
   - Move your mouse around
   - You'll see a colored line from the ball showing your aim direction
   - The line color shows power: Green (low) → Yellow → Red (high)

2. **Adjust Power**
   - Press **Arrow Up** to increase power (max 15)
   - Press **Arrow Down** to decrease power (min 1)
   - Higher power = ball travels farther

3. **Hit the Ball**
   - Press **SPACE** to take your shot
   - Watch the ball roll!

4. **Wait for Ball to Stop**
   - The ball will roll, bounce off obstacles, and eventually stop
   - You can't hit again until it stops moving

5. **Get Ball in Hole**
   - Aim for the black circular hole on the ground
   - When the ball goes in, you complete the hole!
   - Press **SPACE** to go to the next hole

6. **Repeat for All 3 Holes**
   - Complete all three holes to finish the game
   - See your final score at the end!

### Obstacles

Watch out for:
- **🌳 Tree Stumps** - Brown cylinders that block your path
- **🪨 Rocks** - Gray dodecahedrons to bounce around
- **🪵 Logs** - Horizontal brown cylinders lying on the ground

The ball will bounce off all obstacles!

### Resetting

If you get stuck or want to try again:
- Press **R** to reset the ball to the starting position
- Your stroke count stays the same (no penalty-free resets!)

---

## 📊 Scoring Guide

Each hole has a "par" - the number of strokes an expert would take.

### Score Names

Your performance compared to par:

| Score | Name | Description |
|-------|------|-------------|
| **1 stroke** | 🎉 **Hole in One (Ace)** | Amazing! You got it in one shot! |
| **-2 under par** | 🦅 **Eagle** | Exceptional performance! |
| **-1 under par** | 🐦 **Birdie** | Great job! |
| **Equal to par** | 👍 **Par** | Solid performance! |
| **+1 over par** | 😐 **Bogey** | Not bad, keep trying! |
| **+2 over par** | 😕 **Double Bogey** | Room for improvement! |
| **+3 or more** | 💪 **Keep Practicing!** | You'll get better! |

### Final Score

After completing all 3 holes, you'll see:
- **Total Strokes** - How many shots you took in total
- **Course Par** - The target score (Par 3 + Par 4 + Par 5 = 12)
- **Your Score** - How many strokes above or below par you were
- **Performance Rating** - From "Amazing Champion!" to "Keep Practicing!"

### Example

If you complete:
- Hole 1 in 3 strokes (Par) ✓
- Hole 2 in 5 strokes (+1) 
- Hole 3 in 4 strokes (-1) 

Total: **12 strokes** = **Par for the course!** 👍

---

## 💡 Tips & Tricks

### For Beginners

1. **Start with Low Power**
   - Begin at power level 3-5
   - Easier to control than full power

2. **Aim Carefully**
   - Take your time lining up shots
   - The aim line helps you see where the ball will go

3. **Watch the Ball**
   - See how it bounces off obstacles
   - Learn the physics for better shots

4. **Use Obstacles**
   - Sometimes bouncing off an obstacle helps!
   - Bank shots can be strategic

5. **Don't Give Up**
   - Par is just a suggestion
   - Getting the ball in the hole is what matters!

### Advanced Strategies

1. **Plan Your Route**
   - Look at all obstacles before shooting
   - Find the clearest path to the hole

2. **Use Angles**
   - Bouncing at angles can help navigate tight spaces
   - Side approaches often work better than direct shots

3. **Power Control**
   - Low power for precision near the hole
   - High power to clear long distances

4. **Master the Bounce**
   - Learn how the ball bounces off different obstacles
   - Tree stumps bounce differently than rocks

5. **Aim for Consistency**
   - Try to shoot par or better on each hole
   - Consistency beats one lucky shot!

---

## 🔧 Troubleshooting

### Problem: "npm: command not found" or similar error

**Solution:** Node.js is not installed or not in PATH
- Download and install Node.js from https://nodejs.org/
- Restart your terminal/command prompt after installing
- Try again

### Problem: Server won't start / Port already in use

**Solution:** Something else is using port 8080
- Try a different port:
  ```bash
  node_modules\.bin\http-server public -p 3000
  ```
- Then open: `http://localhost:3000`

### Problem: Browser shows "Cannot GET /" or blank page

**Solution:** Wrong folder or files missing
- Make sure you're in the correct game folder
- Check that the `public` folder exists
- Try running `npm install` again

### Problem: Game loads but shows errors

**Solution:** JavaScript errors
- Press **F12** in your browser to open Developer Tools
- Look at the **Console** tab for error messages
- Make sure Three.js loaded (check Network tab)
- Try refreshing the page (**Ctrl+R** or **F5**)

### Problem: Ball doesn't move or controls don't work

**Solution:** 
- Make sure you clicked on the game window first
- Try refreshing the page
- Check that JavaScript is enabled in your browser
- Try a different browser (Chrome recommended)

### Problem: Aim line doesn't show

**Solution:**
- Move your mouse around the game area
- Make sure the ball isn't currently moving
- The line only shows when ready to shoot

### Problem: Can't get ball in hole

**Solution:** It takes practice!
- Try approaching from different angles
- Use lower power when close to the hole
- Be patient - the hole is small!
- Press **R** to reset if completely stuck

---

## 🛑 Stopping the Server

When you're done playing:

1. Go back to your Command Prompt/Terminal window
2. Press **Ctrl+C**
3. The server will stop
4. Close the browser tab

---

## 🎓 Quick Reference Card

**Starting:**
```bash
npm install                              # First time only
node_modules\.bin\http-server public -p 8080   # Every time
```

**Browser:**
```
http://localhost:8080
```

**Controls:**
- Mouse = Aim
- Arrow Up/Down = Power
- SPACE = Shoot/Next
- R = Reset

**Goal:**
Get ball in black hole in fewest strokes!

---

## 🎉 Have Fun!

That's everything you need to know! 

**Challenge your friends** to see who can:
- Get the lowest score
- Complete all holes fastest
- Get a hole-in-one
- Finish under par

**Good luck and enjoy the game!** 🏌️⛳

---

## 📞 Need Help?

If you have questions or find bugs:
1. Check the troubleshooting section above
2. Try reading the full documentation in `README-COMPLETE.md`
3. Ask the game creator for help

---

**Version 1.0**  
*Created with Three.js and TypeScript*  
*October 2025*