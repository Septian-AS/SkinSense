// js/modules/analyzer.js - Analysis logic and inference

const AnalyzerModule = (() => {
    // ===== PREPROCESSING PIPELINE =====
    // Mempersiapkan gambar sebelum inferensi model agar model menerima
    // input yang optimal dan konsisten, bukan bergantung pada center-crop
    // internal library Teachable Machine.
    const preprocessForModel = (sourceCanvas) => {
        console.group('🔧 [SkinSense] Image Preprocessing');

        const targetSize = CONFIG.INPUT_IMAGE_SIZE; // 224
        const processedCanvas = document.createElement('canvas');
        processedCanvas.width = targetSize;
        processedCanvas.height = targetSize;
        const ctx = processedCanvas.getContext('2d');

        // Langkah 1: Resize dengan aspect ratio preservation (letterbox)
        const srcW = sourceCanvas.width;
        const srcH = sourceCanvas.height;
        const scale = Math.min(targetSize / srcW, targetSize / srcH);
        const scaledW = Math.round(srcW * scale);
        const scaledH = Math.round(srcH * scale);
        const offsetX = Math.round((targetSize - scaledW) / 2);
        const offsetY = Math.round((targetSize - scaledH) / 2);

        // Fill background hitam untuk area letterbox
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, targetSize, targetSize);

        // Draw image dengan aspect ratio terjaga — BUKAN center-crop
        ctx.drawImage(sourceCanvas, offsetX, offsetY, scaledW, scaledH);

        console.log(`📐 Resize: ${srcW}×${srcH} → ${targetSize}×${targetSize} (scale=${scale.toFixed(3)}, offset=${offsetX},${offsetY})`);

        // Langkah 2: Contrast normalization (histogram stretch)
        // Menstandardisasi brightness agar pencahayaan berbeda tidak
        // menyebabkan fitur gambar terlihat sama oleh model.
        const imageData = ctx.getImageData(0, 0, targetSize, targetSize);
        const data = imageData.data;

        let min = 255, max = 0;
        for (let i = 0; i < data.length; i += 4) {
            const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
            if (gray < min) min = gray;
            if (gray > max) max = gray;
        }

        const range = max - min || 1;
        if (range < 200) { // Hanya stretch jika kontras rendah
            for (let i = 0; i < data.length; i += 4) {
                data[i]     = Math.round(((data[i] - min) / range) * 255);     // R
                data[i + 1] = Math.round(((data[i + 1] - min) / range) * 255); // G
                data[i + 2] = Math.round(((data[i + 2] - min) / range) * 255); // B
                // Alpha (data[i+3]) tidak diubah
            }
            ctx.putImageData(imageData, 0, 0);
            console.log(`🎨 Contrast stretch: min=${min}, max=${max}, range=${range} → normalized`);
        } else {
            console.log(`🎨 Contrast OK: min=${min}, max=${max}, range=${range} → skip normalization`);
        }

        console.groupEnd();
        return processedCanvas;
    };

    const analyzeImage = async (canvas) => {
        try {
            console.log('🚀 [SkinSense] Analysis pipeline started');
            console.log('📷 Input canvas:', canvas.width, '×', canvas.height);

            // Preprocessing: resize + normalize SEBELUM dikirim ke model
            const preprocessed = preprocessForModel(canvas);

            // Inferensi model dengan gambar yang sudah dipreprocess
            const predictions = await ModelModule.predict(preprocessed);

            const results = processResults(predictions);

            // Log hasil akhir
            console.log('🏆 [SkinSense] Final result:', results.topPrediction.className,
                '(' + (results.topPrediction.probability * 100).toFixed(1) + '%)');

            return results;
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
