document.addEventListener('DOMContentLoaded', () => {
    let isMiddleMouseDown = false;
    let lastX, lastY;
    let scale = 1; // Current zoom level
    let translateX = 0, translateY = 0; // Track translation for smooth zooming

    // Disable default scrolling
    document.body.style.overflow = 'hidden';

    document.addEventListener('mousedown', (e) => {
        if (e.button === 1) { // Middle mouse button
            isMiddleMouseDown = true;
            lastX = e.clientX;
            lastY = e.clientY;
            document.body.style.cursor = 'grabbing'; // Change cursor to grabbing hand
            e.preventDefault(); // Prevent default middle mouse button behavior
        }
    });

    document.addEventListener('mouseup', (e) => {
        if (e.button === 1) { // Middle mouse button
            isMiddleMouseDown = false;
            document.body.style.cursor = 'default'; // Reset cursor
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isMiddleMouseDown) {
            // Inverted Panning functionality with speed increase based on zoom level
            let dx = -(e.clientX - lastX); // Invert X movement
            let dy = -(e.clientY - lastY); // Invert Y movement
            
            // Increase panning speed as zoom level increases
            let speedFactor = 1 + (scale - 1) * 2; // Example: speed doubles when fully zoomed in
            translateX -= (dx * speedFactor) / scale;
            translateY -= (dy * speedFactor) / scale;
            
            updateTransform();
            lastX = e.clientX;
            lastY = e.clientY;
        }
    });

    document.addEventListener('wheel', (e) => {
        e.preventDefault(); // Prevent default scroll behavior

        let zoomFactor = e.deltaY > 0 ? 0.95 : 1.05; // Zoom in or out

        // Use cursor position for zooming
        let cursorX = e.clientX;
        let cursorY = e.clientY;

        // Calculate how much the cursor position will shift due to zoom
        let dx = cursorX - translateX;
        let dy = cursorY - translateY;

        // Adjust translation to keep the cursor position fixed during zoom
        translateX += dx * (1 - zoomFactor);
        translateY += dy * (1 - zoomFactor);

        // Zooming logic, maintaining aspect ratio
        scale *= zoomFactor;
        scale = Math.max(0.1, Math.min(30, scale)); // Expanded zoom range

        updateTransform();
    }, { passive: false });

    function updateTransform() {
        // Apply scale uniformly in both directions, centered at cursor
        document.body.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        // Here, we don't set transformOrigin because it's now based on cursor position dynamically
    }

    // Function to update the center after window resize
    window.addEventListener('resize', () => {
        updateTransform();
    });

    // Initial setup for transform origin
    updateTransform();
});