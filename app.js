require('dotenv').config();

const express = require('express');
const tf = require('@tensorflow/tfjs-node');
const cocoSsd = require('@tensorflow-models/coco-ssd');

const apiKey = process.env.API_KEY;
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json({ limit: '50mb' })); // Increase payload limit for base64 images

const authenticate = (req, res, next) => {
    const requestApiKey = req.header('x-api-key');
    if (!requestApiKey || requestApiKey !== apiKey) {
        return res.status(403).send('Forbidden: Invalid API Key');
    }
    next();
};

// Initialize the COCO-SSD model
let model = null;
async function loadModel() {
    try {
        model = await cocoSsd.load();
        console.log('COCO-SSD model loaded successfully');
    } catch (error) {
        console.error('Error loading COCO-SSD model:', error);
    }
}

// Load the model when the server starts
loadModel();

// Endpoint for object detection
app.post('/detect', authenticate, async (req, res) => {
    try {
        // Check if model is loaded
        if (!model) {
            return res.status(500).json({ error: 'Model not loaded yet' });
        }

        const { image } = req.body;

        // Validate image data
        if (!image) {
            return res.status(400).json({ error: 'No image data provided' });
        }

        try {
            // Convert base64 to buffer
            const imageBuffer = Buffer.from(image, 'base64');
            
            // Convert buffer to tensor
            const tensor = tf.node.decodeImage(imageBuffer);
            
            // Perform object detection
            const predictions = await model.detect(tensor);
            
            // Clean up
            tensor.dispose();
            
            // Return predictions
            res.json({
                success: true,
                predictions: predictions.map(prediction => ({
                    class: prediction.class,
                    score: prediction.score,
                    bbox: prediction.bbox
                }))
            });
        } catch (error) {
            return res.status(400).json({ error: 'Invalid base64 image data' });
        }
        
    } catch (error) {
        console.error('Error during object detection:', error);
        res.status(500).json({ error: 'Error processing image' });
    }
});

// Health check endpoint
app.get('/health', authenticate, (req, res) => {
    res.json({ status: 'ok', modelLoaded: model !== null });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});