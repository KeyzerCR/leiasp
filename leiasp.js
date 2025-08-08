(function() {
    // Criar GUI container
    const gui = document.createElement('div');
    gui.className = 'gui-container';
    gui.innerHTML = `
        <div class="gui-header">
            <h2 class="gui-header-title">Leia SP HACK</h2>
            <div>
                <button class="gui-header-btn minimize-btn">-</button>
                <button class="gui-header-btn close-btn">✕</button>
            </div>
        </div>
        <div class="gui-controls">
            <div>
                <label class="gui-label">Tempo por Página</label>
                <input type="number" id="pageTime" value="60" class="gui-input"> s
            </div>
            <div>
                <input type="checkbox" id="autorevive" class="gui-checkbox" checked>
                <label for="autorevive" style="font-size: 14px;">Autorevive</label>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <button class="gui-button iniciar">Iniciar</button>
                <button class="gui-button parar">Parar</button>
            </div>
        </div>
        <div id="status" class="gui-status status-nan">STATUS: NaN</div>
        <div class="gui-footer">By Keyzer</div>
    `;
    const minimizedIcon = document.createElement('div');
    minimizedIcon.className = 'minimized-icon';
    minimizedIcon.style.display = 'none';
    minimizedIcon.innerHTML = '▶';
    minimizedIcon.title = 'Restaurar LEia SP HACK';
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.style.display = 'none';
    loadingScreen.innerHTML = '<div id="loadingText" class="loading-text"></div>';
    document.body.style.background = 'var(--background-dark)';
    document.body.style.color = 'var(--text-color)';
    // CSS extraído do HTML
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --primary-color: #7a5cff;
            --secondary-color: #00ff99;
            --background-dark: #0b0b0b;
            --background-light: #161616;
            --glass-color: rgba(20, 20, 20, 0.65);
            --text-color: #f0f0f0;
            --error-color: #ff4d4d;
            --shadow-color: rgba(122, 92, 255, 0.3);
            --border-radius: 14px;
            --blur: 10px;
        }
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 var(--shadow-color); }
            70% { box-shadow: 0 0 0 12px transparent; }
            100% { box-shadow: 0 0 0 0 transparent; }
        }
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(8px); }
            50% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-8px); }
        }
        body {
            background: var(--background-dark);
            color: var(--text-color);
            font-family: 'Segoe UI', Roboto, sans-serif;
            margin: 0;
        }
        .gui-container {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 260px;
            background: var(--glass-color);
            backdrop-filter: blur(var(--blur));
            border: 1px solid var(--primary-color);
            border-radius: var(--border-radius);
            box-shadow: 0 5px 20px var(--shadow-color);
            z-index: 9998;
            animation: fadeInOut 0.4s ease-out;
        }
        .gui-header {
            padding: 10px 15px;
            background: linear-gradient(45deg, #111, #1a1a1a);
            color: var(--primary-color);
            font-size: 16px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            border-bottom: 1px solid var(--primary-color);
            border-radius: var(--border-radius) var(--border-radius) 0 0;
        }
        .gui-header-btn {
            background: none;
            border: none;
            color: var(--text-color);
            cursor: pointer;
            font-size: 16px;
            transition: transform 0.2s ease;
        }
        .gui-header-btn:hover {
            transform: scale(1.2);
        }
        .gui-controls {
            padding: 15px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .gui-button {
            padding: 10px;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.3s ease;
        }
        .gui-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 10px var(--shadow-color);
        }
        .gui-button.iniciar {
            background: linear-gradient(45deg, var(--secondary-color), #55ffcc);
            color: var(--background-dark);
        }
        .gui-button.parar {
            background: linear-gradient(45deg, var(--error-color), #ff7777);
            color: #fff;
        }
        .gui-input {
            background: var(--background-light);
            border: 1px solid var(--primary-color);
            color: var(--text-color);
            padding: 6px;
            border-radius: 6px;
            width: 60px;
            outline: none;
        }
        .gui-label {
            font-size: 12px;
            font-weight: bold;
            color: var(--primary-color);
        }
        .gui-checkbox {
            accent-color: var(--primary-color);
            transform: scale(1.2);
        }
        .gui-status {
            padding: 8px;
            border-radius: 6px;
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            background: linear-gradient(45deg, #111, #222);
            border: 1px solid var(--primary-color);
        }
        .status-iniciado {
            color: var(--secondary-color);
            animation: pulse 2s infinite;
        }
        .status-parado {
            color: var(--error-color);
        }
        .status-nan {
            color: #aaa;
        }
        .gui-footer {
            text-align: center;
            font-size: 12px;
            color: var(--primary-color);
            padding: 6px;
            opacity: 0.8;
        }
        .minimized-icon {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            background: var(--glass-color);
            backdrop-filter: blur(var(--blur));
            border: 1px solid var(--primary-color);
            border-radius: 50%;
            cursor: pointer;
            z-index: 9998;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary-color);
            font-size: 20px;
            box-shadow: 0 0 10px var(--shadow-color);
            animation: pulse 2s infinite;
        }
        /* Responsive adjustments */
        @media (max-width: 640px) {
            .gui-container {
                width: 90%;
                max-width: 300px;
                left: 50%;
                transform: translateX(-50%);
                right: auto;
            }
            .minimized-icon {
                right: 50%;
                transform: translateX(50%);
            }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(gui);
    document.body.appendChild(minimizedIcon);
    document.body.appendChild(loadingScreen);
    // Sistema de arrastar
    let isDragging = false;
    let currentX = window.innerWidth - gui.offsetWidth - 20;
    let currentY = 20;
    let initialX, initialY;
    gui.addEventListener('mousedown', (e) => {
        if (e.target.closest('.gui-header') && !e.target.closest('.gui-header-btn')) {
            initialX = e.clientX - currentX;
            initialY = e.clientY - currentY;
            isDragging = true;
            gui.style.cursor = 'grabbing';
        }
    });
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            const maxX = window.innerWidth - gui.offsetWidth;
            const maxY = window.innerHeight - gui.offsetHeight;
            currentX = Math.max(0, Math.min(currentX, maxX));
            currentY = Math.max(0, Math.min(currentY, maxY));
            gui.style.left = currentX + 'px';
            gui.style.top = currentY + 'px';
            gui.style.right = 'auto';
        }
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
        gui.style.cursor = 'move';
    });
    gui.style.left = currentX + 'px';
    gui.style.top = currentY + 'px';
    const minimizeBtn = gui.querySelector('.minimize-btn');
    const closeBtn = gui.querySelector('.close-btn');
    const startBtn = gui.querySelector('.iniciar');
    const stopBtn = gui.querySelector('.parar');
    const statusElement = document.getElementById('status');
    minimizeBtn.addEventListener('click', () => {
        gui.style.display = 'none';
        minimizedIcon.style.display = 'flex';
    });
    minimizedIcon.addEventListener('click', () => {
        gui.style.display = 'block';
        minimizedIcon.style.display = 'none';
    });
    closeBtn.addEventListener('click', () => gui.remove());
    let intervalId = null;
    function updateStatus(status) {
        statusElement.textContent = `STATUS: ${status}`;
        statusElement.className = 'gui-status';
        if (status === 'INICIADO') statusElement.classList.add('status-iniciado');
        else if (status === 'PARADO') statusElement.classList.add('status-parado');
        else statusElement.classList.add('status-nan');
    }
    function clickTarget() {
        const target = document.querySelector('span[data-testid="bonsai-icon-caret-right"]');
        if (target) target.click();
    }
    function startScript() {
        const time = parseInt(document.getElementById('pageTime').value) * 1000;
        const autorevive = document.getElementById('autorevive').checked;
        stopScript();
        intervalId = setInterval(() => {
            if (autorevive || !document.hidden) clickTarget();
        }, time);
        updateStatus('INICIADO');
    }
    function stopScript() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
            updateStatus('PARADO');
        }
    }
    startBtn.addEventListener('click', startScript);
    stopBtn.addEventListener('click', stopScript);
    document.addEventListener('visibilitychange', () => {
        if (!document.getElementById('autorevive').checked && intervalId) {
            if (document.hidden) stopScript();
            else startScript();
        }
    });
    updateStatus('NaN');
})();
