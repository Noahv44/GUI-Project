CSCI-310 Development Notebook
Name:
Noah Vachon

Project/Assignment:
CSCI 310 Project 2: 3D Game - Escape the Jungle Mini Golf

Problem/Task:
Create a 3D mini golf game using Three.js with realistic physics, multiple holes, golf mechanics, and an engaging jungle environment. The game should be playable in a web browser with mouse and keyboard controls.

---

Development Log

Iteration 1: Initial Setup & Basic Scene

What do you do?
Set up the project structure with TypeScript and Three.js. Created basic scene with ground, lighting, and a simple golf ball. Implemented initial camera positioning and basic controls.

Response/Result:
- Successfully initialized Three.js scene with renderer, camera, and lighting
- Created ground plane using PlaneGeometry with green material
- Added sphere geometry for golf ball with basic physics (gravity)
- Implemented basic camera controls and scene rendering loop
- Game loads in browser at localhost:8080

Your Evaluation:
Good foundation established. The basic 3D scene renders correctly and the ball responds to gravity. However, the game lacks golf mechanics - no way to actually "hit" the ball yet. Need to implement user input controls and ball striking mechanism. Camera is static and doesn't follow the ball well.

---

Iteration 2: Golf Mechanics & Power System

What do you do?
Implemented golf club system with Driver, Iron, Wedge, and Putter. Each club has different max distance and trajectory. Added hold-to-charge power system where player holds SPACE to charge power (0-100%) then releases to hit. Created visual power meter UI.

Response/Result:
- Created CLUBS object with 4 club types, each with unique properties (maxDistance, maxHeight, color, backspin)
- Implemented power charging mechanic with 2.5 second charge time
- Added visual power meter that fills and changes color (green → yellow → red)
- Ball now launches with calculated velocity based on power percentage and club properties
- Number keys 1-4 select different clubs
- Realistic arc trajectories with varying heights based on club type

Your Evaluation:
Major improvement! The golf mechanics feel realistic and responsive. Power charging adds strategy - need to time your hits. Different clubs create noticeably different shots. However, the ball sometimes goes through obstacles at high speed. Need better collision detection. Also, having just a floating ball isn't very immersive - would be better with a visible golfer character.

---

Iteration 3: 3D Golfer Character & Animation

What do you do?
Created a 3D golfer character using basic geometric shapes (cylinder body, sphere head, arms). Positioned golfer next to the ball (perpendicular to shot direction). Implemented pendulum-style swing animation with three phases: backswing, downswing through impact, and follow-through.

Response/Result:
- Built Golfer class with body (blue cylinder), head (sphere), arms, and club
- Golfer positioned 0.6 units to the side of ball, facing shot direction
- Swing animation rotates club through realistic arc (π/3 backswing → 0 impact → π/4 follow-through)
- Animation timing: 0.3s backswing, 0.2s downswing, 0.3s follow-through
- updateGolferPosition() method rotates golfer to face aim direction
- Visual feedback helps player see what club they're using

Your Evaluation:
Excellent addition! Having a visible golfer makes the game much more engaging and helps with aiming. The pendulum swing looks natural and gives good visual feedback when hitting. The golfer properly rotates to face where you're aiming. One issue: golfer appears at new holes even after finishing previous hole. Need cleanup between holes. Also, collision detection still needs work - ball phases through obstacles at high speeds.

---

Iteration 4: Collision Detection & Physics Improvements

What do you do?
Implemented dual-position collision detection system that checks both current position AND predicted next position to prevent tunneling through obstacles at high speed. Added stronger pushback force (1.5 units) when collision detected. Implemented velocity reflection for realistic bouncing. Added 40% energy retention on collisions.

Response/Result:
- Dual-check system: checks distance to obstacle from both current ball position and predicted next position
- If collision detected, ball is pushed back 1.5 units from obstacle
- Velocity is reflected and scaled by 0.4 (60% energy loss on impact)
- Ball can no longer phase through obstacles even at maximum power
- Penetration resolution prevents ball from getting stuck inside obstacles
- Added boundary walls with 60% bounce energy retention

Your Evaluation:
Much better! The collision system is now robust. High-power driver shots no longer tunnel through trees or rocks. The ball bounces realistically off obstacles with appropriate energy loss. The dual-check system was key to preventing tunneling. However, duplicate golfers were appearing when loading new holes. Need to explicitly remove old golfer when loading new hole.

---

Iteration 5: Scene Management & Golfer Cleanup

What do you do?
Added proper cleanup in loadHole() function to remove old golfer before creating new Golf instance. Updated clearScene() method in Jungle class to properly remove all scene objects including obstacles, water hazards, hole, rim, and hole indicator.

Response/Result:
- loadHole() now calls golf.golfer.remove() before creating new Golf instance
- clearScene() removes all obstacles from scene array
- Water hazard meshes properly removed
- Hole and rim meshes removed
- Hole indicator (floating arrow) removed to prevent duplicates
- Scene is properly cleaned between holes

Your Evaluation:
Perfect! No more duplicate golfers cluttering the scene. Scene transitions are clean now. However, the camera system needs improvement. Having the camera far away (15 units) makes it hard to aim precisely. Would like a closer, more immersive view for aiming, and automatic tracking when the ball is in flight.

---

Iteration 6: Dynamic Camera System

What do you do?
Implemented three camera modes: Player View (close behind ball at eye level), Hole View (facing target), and Follow Mode (dynamic tracking). Camera automatically switches to Follow mode when ball is hit, then returns to Player view when ball stops. Added dynamic zoom based on ball height and speed. Press V to manually toggle modes.

Response/Result:
- Player View: 2 units behind ball, 1.2 units high (eye level) - perfect for aiming
- Hole View: Camera positioned to look from hole toward ball
- Follow Mode: Smoothly tracks ball with dynamic zoom
- When ball is in air (height > 1.0): camera zooms in (6-8 units) and follows ball height
- When ball is rolling: zoom adjusts based on speed
- Auto-switches: Player mode → Follow mode (on hit) → Player mode (when stopped)
- Smooth interpolation (lerp) prevents jarring camera movements
- Camera view indicator shows current mode in UI

Your Evaluation:
Fantastic improvement! The close Player view makes aiming much more precise and immersive - feels like you're standing behind the ball. The auto-follow during shots is cinematic and lets you watch your ball flight. Dynamic zoom when ball is in air is especially nice for wedge shots. The automatic mode switching works perfectly - no manual toggling needed. Camera smoothly returns to aiming position when ball stops. However, need a better way to see where the hole is from far away.

---

Iteration 7: Hole Indicator & Flag Enhancement

What do you do?
Created a floating hole indicator with bright yellow downward-pointing arrow and glowing ring. Positioned 6 units above hole with animated bobbing motion and continuous rotation. Made flag taller (3.5 units) and larger (50% bigger) for better visibility. Added animation to hole indicator in Jungle.update().

Response/Result:
- Floating arrow: Yellow cone geometry pointing down, 0.3 radius, 0.8 height
- Glowing ring: Yellow torus (0.4 radius) around arrow for extra visibility  
- Positioned 6 units above hole - visible from anywhere on course
- Bobs up and down (0.3 unit amplitude) using sine wave animation
- Rotates continuously (2 rad/s) to catch player's attention
- Flag pole increased from 2 → 3.5 units tall
- Flag size increased from 0.8x0.6 → 1.2x0.8 units
- Both indicator and flag cast shadows

Your Evaluation:
Perfect solution! The bright yellow floating arrow is impossible to miss. The bobbing and rotation make it stand out even more. Combined with the taller flag, players always know exactly where they're aiming. The indicator properly removes when loading new holes (cleanup works correctly). Game now has all essential features working smoothly.

---

Iteration 8: Story & Environment Enhancement

What do you do?
Created a 3-hole story-driven course "Escape the Jungle". Added dense forest background with 100 trees in rings around play area. Implemented fog for atmospheric depth. Created story text for each hole. Added multiple obstacle types (stumps, rocks, temples, logs, bushes) with varied placements across three holes of increasing difficulty.

Response/Result:
- Hole 1: "The Jungle Entrance" - Par 3, introductory difficulty with 7 obstacles
- Hole 2: "The Ancient Temple Path" - Par 4, medium difficulty with 10 obstacles, temple ruins
- Hole 3: "The Final Escape" - Par 5, challenging with 17 obstacles, very dense
- Forest background: 60 outer trees + 40 inner trees in circular pattern
- Fog system: Deep forest green color, starts at 20 units, full at 60 units
- Story display shows narrative for each hole
- Water hazards placed strategically (2-3 per hole)
- Jungle theme with green lighting and color palette

Your Evaluation:
Excellent atmosphere! The dense forest background and fog create great depth and immersion. The story elements give purpose to the gameplay. Hole difficulty progression works well - Hole 3 feels genuinely challenging with narrow paths through obstacles. The variety of obstacle types (stumps, rocks, temples) makes each hole visually distinct. The jungle theme is cohesive throughout.

---

Iteration 9: UI Polish & Pause Menu

What do you do?
Added comprehensive UI with hole info, story display, stroke counter, club display, power meter, and camera view indicator. Created pause menu (ESC key) with scoring breakdown, hole navigation, and resume/restart options. Added instructions panel with all controls clearly listed.

Response/Result:
- Top-left UI shows: hole name, par, strokes, current club, power level, camera mode
- Story text displays in styled box with background
- Power meter with color transitions (green/yellow/red based on charge)
- Pause menu shows: current hole scores, hole navigation buttons, total score
- Can jump to any hole from pause menu
- Instructions list all controls (mouse aim, SPACE hold, 1-4 clubs, V camera, R reset, ESC pause)
- Hole completion message shows performance (Birdie, Par, Bogey, etc.)
- Final score screen after completing all 3 holes

Your Evaluation:
Professional-looking UI that provides all necessary information without cluttering the screen. Pause menu is very useful for checking scores and jumping between holes for testing. Instructions are clear and comprehensive. The hole completion messages with performance ratings add good feedback. Camera view indicator helps players understand which mode they're in. Everything works smoothly together.

---

Iteration 10: Final Testing & Bug Fixes

What do you do?
Tested all features end-to-end. Fixed flag cleanup issue where floating arrow wasn't being removed between holes. Verified collision detection works at all power levels. Tested all three camera modes. Ensured golfer cleanup works properly. Validated scoring system across all holes.

Response/Result:
- Fixed: clearScene() now removes holeIndicator properly
- Verified: No tunneling through obstacles at any club/power combination
- Verified: Camera modes switch correctly and smoothly
- Verified: Golfer only appears once per hole
- Verified: Water hazards reset ball to last position with stroke penalty
- Verified: Boundary walls bounce ball back (invisible walls work)
- Verified: Scoring tracks correctly, final score calculates properly
- Verified: All 3 holes completable
- Game runs smoothly at 60 FPS

Your Evaluation:
Game is complete and polished! All major features work as intended:
✅ Realistic golf physics with 4 clubs
✅ 3D golfer with swing animation  
✅ Dynamic camera system with 3 modes
✅ 3-hole story-driven course
✅ Robust collision detection
✅ Professional UI and pause menu
✅ Atmospheric jungle environment
✅ Smooth performance

The game successfully meets all project requirements and provides an engaging, playable experience. Ready for submission!

---

Final Summary:

The development process evolved from a basic 3D scene to a fully-featured mini golf game through iterative improvements. Key milestones included:

1. Basic scene setup with physics
2. Golf mechanics with power system
3. 3D golfer character with animations
4. Robust collision detection
5. Scene management and cleanup
6. Dynamic camera system
7. Visual indicators and enhancements
8. Story-driven course design
9. Professional UI implementation
10. Final polish and bug fixes

The iterative approach allowed for testing and refinement at each stage, resulting in a polished final product. Each iteration addressed specific issues from the previous version, demonstrating problem-solving skills and attention to detail.

Technologies Used:
- Three.js (3D rendering)
- TypeScript (type-safe development)
- HTML5/CSS (UI and structure)
- Custom physics engine (gravity, velocity, collision)

Final Game Features:
- 3 holes with story progression
- 4 realistic golf clubs
- 3D golfer character
- Dynamic camera (3 modes)
- Realistic ball physics
- Multiple obstacle types
- Water hazards
- Pause menu & scoring
- Professional UI
- Atmospheric environment
