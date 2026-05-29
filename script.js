// Elements
const themeToggle = document.getElementById('themeToggle');
const verText = document.getElementById('verText');
const radarBeam = document.getElementById('radarBeam');
const blipsContainer = document.getElementById('blipsContainer');
const radarScreen = document.getElementById('radarScreen');

// Define targets (blips) in polar coordinates (distance from center, angle in degrees)
// Accurate Army/Navy simulation: targets have fixed locations
const targets = [
    { distance: 70, angle: 40 },   // Top Right
    { distance: 110, angle: 120 }, // Bottom Right
    { distance: 130, angle: 210 }, // Bottom Left
    { distance: 80, angle: 290 },  // Top Left
    { distance: 50, angle: 180 }   // Close Bottom Left
];

// Screen dimensions
const screenRadius = radarScreen.offsetWidth / 2;
const blipSize = 7; // Matching CSS

// Sweep Control (Controlled by JS for precision detection)
let sweepAngle = 0; // Current angle of the beam
const sweepSpeed = 72; // Degrees per second (matches CSS --beam-speed 5s = 360/5)
let lastTime = 0;

// Create blip elements in the DOM
function initBlips() {
    blipsContainer.innerHTML = ''; // Clear old ones

    targets.forEach((target, index) => {
        // Convert polar to Cartesian coordinates (relative to center of screen)
        // angle-90 corrects conic gradient beginning at 12 o'clock, but CSS uses relative positioning.
        // Screen center is screenRadius, screenRadius. Blip center adjustment is blipSize/2.
        const x = screenRadius + target.distance * Math.cos(target.angle * (Math.PI / 180));
        const y = screenRadius + target.distance * Math.sin(target.angle * (Math.PI / 180));

        const blipEl = document.createElement('div');
        blipEl.className = `blip`;
        blipEl.id = `blip-${index}`;
        blipEl.style.left = `${x - blipSize / 2}px`;
        blipEl.style.top = `${y - blipSize / 2}px`;
        blipsContainer.appendChild(blipEl);
    });
}

// Animation Loop: Rotation and Detection
function animateRadar(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const deltaTime = (timestamp - lastTime) / 1000; // Time difference in seconds
    lastTime = timestamp;

    // Update Sweep Angle
    sweepAngle = (sweepAngle + sweepSpeed * deltaTime) % 360;
    
    // Apply Rotation to CSS (using scale(-1, 1) and offset because gradient rotation center is shifted)
    radarBeam.style.transform = `rotate(${sweepAngle}deg) translate(25%, 25%) scale(1, -1)`; // Adjusted for conic fade behavior

    // Accurate Target Detection Logic: Check if the beam is passing over a target's angle
    // Using a tolerance range for detection accuracy
    const detectionTolerance = 10; // Degrees wide the detection edge is

    targets.forEach((target, index) => {
        const blipEl = document.getElementById(`blip-${index}`);
        if (!blipEl) return;

        // Correct for the leading edge of the fade: Conic gradients often fade *behind* the rotation point.
        // We detect *just before* the beam passes the blip's angle.
        
        // Simplified detection check
        // Check if current sweepAngle is close to target angle
        const diff = Math.abs((sweepAngle + 180) % 360 - (target.angle + 180) % 360); // Centered difference
        
        if (diff < detectionTolerance / 2) {
            // "Detect" the target: Trigger fade-out animation
            if (!blipEl.classList.contains('detected')) {
                blipEl.classList.add('detected');

                // Realism: Reset after 3 seconds (animation duration) so it can trigger next sweep
                setTimeout(() => {
                    blipEl.classList.remove('detected');
                }, 3000); // Fades out before next sweep
            }
        }
    });

    requestAnimationFrame(animateRadar);
}

// Initialize
initBlips();
requestAnimationFrame(animateRadar);


// Listen for the theme toggle switch
themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
        // Switch to View 2 (Red/Black Army Style)
        document.body.classList.add('view-2');
        verText.textContent = 'Ver. 2';
    } else {
        // Switch back to View 1 (Blue Cyber)
        document.body.classList.remove('view-2');
        verText.textContent = 'Ver. 1';
    }
});
