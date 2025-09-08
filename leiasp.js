// Create a canvas element to draw the image
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Create an image object
const img = new Image();
img.crossOrigin = 'anonymous'; // Attempt to bypass CORS if possible

// Set the source to the image URL
img.src = 'https://i.imgur.com/JSm9JFt.jpeg';

// Variables to track fullscreen state
let isFullscreen = false;
let fullscreenInterval;

// Once image loads, draw it on canvas and append
img.onload = function() {
    // Clear canvas with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate dimensions to fit image proportionally (like object-fit: contain)
    const imgRatio = img.width / img.height;
    const canvasRatio = canvas.width / canvas.height;
    
    let drawWidth, drawHeight, offsetX, offsetY;
    
    if (imgRatio > canvasRatio) {
        // Image wider than canvas, fit width
        drawWidth = canvas.width;
        drawHeight = drawWidth / imgRatio;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2; // Center vertically
    } else {
        // Image taller than canvas, fit height
        drawHeight = canvas.height;
        drawWidth = drawHeight * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2; // Center horizontally
        offsetY = 0;
    }
    
    // Draw the image centered
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    
    // Style the canvas to cover the screen
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '9999';
    
    // Append to body
    document.body.appendChild(canvas);
    
    // Handle window resize to redraw
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Redraw with white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Recalculate dimensions (use original ratios)
        if (imgRatio > canvasRatio) {
            drawWidth = canvas.width;
            drawHeight = drawWidth / imgRatio;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        } else {
            drawHeight = canvas.height;
            drawWidth = drawHeight * imgRatio;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
        }
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    });
    
    // Function to enter fullscreen
    function enterFullscreen() {
        if (!isFullscreen) {
            if (canvas.requestFullscreen) {
                canvas.requestFullscreen();
            } else if (canvas.webkitRequestFullscreen) {
                canvas.webkitRequestFullscreen();
            } else if (canvas.msRequestFullscreen) {
                canvas.msRequestFullscreen();
            }
            isFullscreen = true;
        }
    }
    
    // Function to exit fullscreen
    function exitFullscreen() {
        if (isFullscreen) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            isFullscreen = false;
        }
    }
    
    // Initial enter fullscreen after a short delay
    setTimeout(enterFullscreen, 100);
    
    // Loop to continuously re-enter fullscreen every 2 seconds if not in fullscreen
    fullscreenInterval = setInterval(function() {
        if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
            enterFullscreen();
        }
    }, 2000);
    
    // Add ESC key listener to exit fullscreen (but will re-enter due to loop)
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            exitFullscreen();
            // Optional: You can add a brief pause before re-entering, but it will loop anyway
        }
    });
    
    // Listen for fullscreen change events to update state
    document.addEventListener('fullscreenchange', function() {
        isFullscreen = !!document.fullscreenElement;
    });
    document.addEventListener('webkitfullscreenchange', function() {
        isFullscreen = !!document.webkitFullscreenElement;
    });
    document.addEventListener('msfullscreenchange', function() {
        isFullscreen = !!document.msFullscreenElement;
    });
};

// Handle image load error (e.g., if blocked)
img.onerror = function() {
    console.error('Failed to load image. CSP or network issue.');
};

// Create an audio element to play sound
const audio = new Audio();
audio.src = 'https://memes.casa/audios/gemido-whatsapp.mp3'; // Replace with your actual audio URL (GitHub raw URL recommended)

// Enable looping and attempt autoplay
audio.loop = true; // Audio will loop continuously
audio.autoplay = true;

// Handle audio load and play
audio.onloadstart = function() {
    console.log('Audio loading...');
};

audio.oncanplay = function() {
    audio.play().catch(function(error) {
        console.error('Autoplay prevented:', error);
        // Add a button to play on click
        const playButton = document.createElement('button');
        playButton.textContent = 'Play Audio';
        playButton.style.position = 'fixed';
        playButton.style.bottom = '20px';
        playButton.style.right = '20px';
        playButton.style.zIndex = '10000';
        playButton.onclick = function() {
            audio.play();
            playButton.style.display = 'none';
        };
        document.body.appendChild(playButton);
    });
};

audio.onerror = function() {
    console.error('Failed to load audio. CSP or network issue.');
};

// Optional: Function to stop everything (run this in console to close: stopOverlay())
window.stopOverlay = function() {
    if (fullscreenInterval) {
        clearInterval(fullscreenInterval);
    }
    exitFullscreen();
    if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
    }
    audio.pause();
    audio.src = ''; // Prevent looping
    console.log('Overlay stopped.');
};
