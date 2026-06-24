// js/modules/model.js - ML model loading and inference

const ModelModule = (() => {
    let model = null;
    let isLoaded = false;

    const loadModel = async () => {
        try {
            model = await tmImage.load(CONFIG.MODEL_URL, CONFIG.METADATA_URL);
            isLoaded = true;
            console.log('✅ Model loaded successfully');
            return { success: true };
        } catch (error) {
            console.error('❌ Model loading failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    };

    const predict = async (imageElement) => {
        if (!model || !isLoaded) {
            throw new Error('Model not loaded');
        }
        return await model.predict(imageElement);
    };

    const getModelInfo = () => {
        return {
            loaded: isLoaded,
            model: model ? 'Teachable Machine' : null
        };
    };

    const isModelLoaded = () => isLoaded;

    return {
        loadModel,
        predict,
        getModelInfo,
        isModelLoaded
    };
})();
