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

        // 🔍 DIAGNOSTIC LOG: Input ke model
        console.group('🧠 [SkinSense] Model Inference');
        console.log('📐 Input dimensions:', imageElement.width, '×', imageElement.height);

        // Log sample pixel & hash untuk verifikasi gambar unik antar capture
        if (imageElement.getContext) {
            const ctx = imageElement.getContext('2d');
            const centerX = Math.floor(imageElement.width / 2);
            const centerY = Math.floor(imageElement.height / 2);
            const sample = ctx.getImageData(centerX, centerY, 1, 1).data;
            console.log('🎨 Center pixel RGBA:', Array.from(sample));

            // Hash sederhana untuk membuktikan gambar berbeda
            const imgData = ctx.getImageData(0, 0, imageElement.width, imageElement.height).data;
            let hash = 0;
            for (let i = 0; i < imgData.length; i += 997) {
                hash = ((hash << 5) - hash + imgData[i]) | 0;
            }
            console.log('🔑 Image hash (unik per gambar):', hash);
        }

        const predictions = await model.predict(imageElement);

        // 🔍 DIAGNOSTIC LOG: Raw prediction output
        console.log('📊 Raw predictions:');
        predictions.forEach(p => {
            const bar = '█'.repeat(Math.round(p.probability * 30));
            console.log(`   ${p.className.padEnd(10)}: ${(p.probability * 100).toFixed(4)}% ${bar}`);
        });
        console.groupEnd();

        return predictions;
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
