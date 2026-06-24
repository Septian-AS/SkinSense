// js/modules/analyzer.js - Analysis logic and inference

const AnalyzerModule = (() => {
    const analyzeImage = async (canvas) => {
        try {
            const predictions = await ModelModule.predict(canvas);
            return processResults(predictions);
        } catch (error) {
            console.error('Analysis failed:', error);
            throw error;
        }
    };

    const processResults = (predictions) => {
        const sorted = [...predictions].sort((a, b) => b.probability - a.probability);

        return {
            all: predictions,
            sorted: sorted,
            topPrediction: sorted[0],
            allPredictions: sorted.map(p => ({
                className: p.className,
                probability: p.probability,
                percentage: (p.probability * 100).toFixed(1)
            }))
        };
    };

    const validateResult = (prediction) => {
        // NULL GUARD FIX: Cegah crash jika model tidak menghasilkan prediksi
        if (!prediction || typeof prediction.probability !== 'number') {
            return {
                valid: false,
                level: 'invalid',
                message: 'Prediksi tidak tersedia, coba foto ulang'
            };
        }

        const confidence = prediction.probability;

        if (confidence >= CONFIG.CONFIDENCE_THRESHOLD_HIGH) {
            return {
                valid: true,
                level: 'high',
                message: 'Hasil sangat akurat'
            };
        } else if (confidence >= CONFIG.CONFIDENCE_THRESHOLD_MEDIUM) {
            return {
                valid: true,
                level: 'medium',
                message: 'Hasil cukup akurat'
            };
        } else if (confidence >= CONFIG.CONFIDENCE_THRESHOLD_LOW) {
            return {
                valid: false,
                level: 'low',
                message: 'Hasil kurang jelas, coba foto ulang'
            };
        } else {
            return {
                valid: false,
                level: 'invalid',
                message: 'Foto tidak dapat dianalisis'
            };
        }
    };

    const getSkinTypeEmoji = (skinType) => {
        const rule = SKINCARE_RULES[skinType];
        return rule ? rule.emoji : '❓';
    };

    return {
        analyzeImage,
        validateResult,
        getSkinTypeEmoji
    };
})();
