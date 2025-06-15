const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload: Script loaded');
console.log('Preload: contextBridge available:', !!contextBridge);
console.log('Preload: ipcRenderer available:', !!ipcRenderer);

try {
  console.log('Preload: Attempting to expose electronAPI');
  
  contextBridge.exposeInMainWorld('electronAPI', {
    isFullscreen: async () => {
      console.log('Preload: isFullscreen called');
      const result = await ipcRenderer.invoke('is-fullscreen');
      console.log('Preload: isFullscreen result =', result);
      return result;
    },
    toggleFullscreen: async () => {
      console.log('Preload: toggleFullscreen called');
      const result = await ipcRenderer.invoke('toggle-fullscreen');
      console.log('Preload: toggleFullscreen result =', result);
      return result;
    },
  });
  
  console.log('Preload: electronAPI exposed successfully');
} catch (error) {
  console.error('Preload: Error exposing electronAPI:', error);
}

// Also try exposing it directly on window for debugging
try {
  console.log('Preload: Attempting to set window.electronAPI directly');
  window.electronAPI = {
    isFullscreen: async () => {
      console.log('Preload: window.electronAPI.isFullscreen called');
      const result = await ipcRenderer.invoke('is-fullscreen');
      console.log('Preload: window.electronAPI.isFullscreen result =', result);
      return result;
    },
    toggleFullscreen: async () => {
      console.log('Preload: window.electronAPI.toggleFullscreen called');
      const result = await ipcRenderer.invoke('toggle-fullscreen');
      console.log('Preload: window.electronAPI.toggleFullscreen result =', result);
      return result;
    },
  };
  console.log('Preload: window.electronAPI set directly');
} catch (error) {
  console.error('Preload: Error setting window.electronAPI directly:', error);
}

// Log when the window finishes loading
window.addEventListener('DOMContentLoaded', () => {
  console.log('Preload: DOMContentLoaded');
  console.log('Preload: electronAPI available =', !!window.electronAPI);
  console.log('Preload: window keys =', Object.keys(window).filter(key => key.includes('electron')));
}); 