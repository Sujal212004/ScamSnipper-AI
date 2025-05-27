import { io } from 'socket.io-client';
import sharp from 'sharp';

// Initialize socket connection
let socket = null;

export const initializeSocket = (url) => {
  socket = io(url, {
    reconnectionDelay: 1000,
    reconnection: true,
    reconnectionAttempts: 10,
    transports: ['websocket'],
    agent: false,
    upgrade: false,
    rejectUnauthorized: false
  });
  
  return socket;
};

// Process and optimize images
export const optimizeImage = async (imageFile, options = {}) => {
  try {
    const {
      width = 800,
      quality = 80,
      format = 'jpeg'
    } = options;
    
    const buffer = await imageFile.arrayBuffer();
    
    const optimizedImage = await sharp(buffer)
      .resize(width, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
      [format]({
        quality,
        progressive: true
      })
      .toBuffer();
    
    return new Blob([optimizedImage], { type: `image/${format}` });
  } catch (error) {
    console.error('Error optimizing image:', error);
    throw error;
  }
};

// Image enhancement functions
export const enhanceImage = async (imageFile, options = {}) => {
  try {
    const {
      brightness = 1,
      contrast = 1,
      sharpen = true
    } = options;
    
    const buffer = await imageFile.arrayBuffer();
    let imageProcess = sharp(buffer)
      .modulate({
        brightness,
        contrast
      });
    
    if (sharpen) {
      imageProcess = imageProcess.sharpen();
    }
    
    const enhancedImage = await imageProcess
      .toBuffer();
    
    return new Blob([enhancedImage], { type: imageFile.type });
  } catch (error) {
    console.error('Error enhancing image:', error);
    throw error;
  }
};

// Export socket instance
export const getSocket = () => socket;