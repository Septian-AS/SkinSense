// js/modules/webcam.js - Webcam management and quality feedback

const WebcamModule = (() => {
    let webcam = null;
    let isActive = false;
    let animationFrameId = null;

    const startWebcam = async () => {
        try {
            webcam = new tmImage.Webcam(CONFIG.WEBCAM_SIZE, CONFIG.WEBCAM_SIZE, true);
            await webcam.setup();
            await webcam.play();

            const container = document.getElementById('webcam-container');
            container.innerHTML = '';
            container.appendChild(webcam.canvas);

            isActive = true;
            animationFrameId = requestAnimationFrame(loopPreview);

            return { success: true };
        } catch (error) {
            console.error('Webcam error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    };

    const loopPreview = () => {
        if (isActive && webcam) {
            webcam.update();
            animationFrameId = requestAnimationFrame(loopPreview);
        }
    };

    const stopWebcam = () => {
        if (webcam) {
            // Stop dari library
            webcam.stop();

            // HARD RELEASE MEDIA TRACKS: Pastikan hardware lock kamera dilepas
            if (webcam.webcam && webcam.webcam.srcObject) {
                const stream = webcam.webcam.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach(track => {
                    track.stop(); // Secara eksplisit hentikan akses hardware
                });
                webcam.webcam.srcObject = null; // Putuskan referensi
            }
        }
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        isActive = false;
    };

    const captureFrame = () => {
        if (!webcam || !webcam.canvas) return null;

        // Force update: pastikan frame terbaru dari hardware webcam
        webcam.update();

        const canvas = document.getElementById('captured-canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = webcam.canvas.width;
        canvas.height = webcam.canvas.height;
        ctx.drawImage(webcam.canvas, 0, 0);

        console.log('📸 [SkinSense] Frame captured:', canvas.width, '×', canvas.height);

        return canvas;
    };

    const measureBrightness = (canvas) => {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let brightness = 0;
        for (let i = 0; i < data.length; i += 4) {
            brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
        }

        return brightness / (canvas.width * canvas.height);
    };

    const detectFacePresence = (canvas) => {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // IMPROVED ALGORITHM: Multiple checks for better accuracy

        // 1. Check for uniform color (blank/empty frame)
        // If image is mostly uniform color = no face
        const uniformColorCheck = () => {
            const sampleSize = 100;
            let colorVariance = 0;

            for (let i = 0; i < Math.min(sampleSize, data.length); i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                // Calculate color variance (simplified)
                colorVariance += Math.abs(r - g) + Math.abs(g - b) + Math.abs(r - b);
            }

            const avgVariance = colorVariance / sampleSize;
            return avgVariance > 50; // If there's significant color variation, likely has content
        };

        // 2. Edge detection (improved - MUCH more sensitive)
        const edgeDetectionCheck = () => {
            let edgeCount = 0;

            for (let i = 4; i < data.length - 4; i += 4) {
                // Horizontal edges (LOWERED threshold from 30 → 12)
                const hDiff = Math.abs(data[i] - data[i - 4]);

                // Vertical edges (new - check pixel above/below)
                const vDiff = Math.abs(data[i] - data[i + 4 * canvas.width]);

                // Count if either horizontal OR vertical edge detected
                if (hDiff > 12 || vDiff > 12) {
                    edgeCount++;
                }
            }

            // MUCH more lenient threshold: 1% instead of 5%
            const threshold = Math.max(1000, data.length * 0.01);
            return edgeCount > threshold;
        };

        // 3. Combined check: Either good color variance OR edges detected
        const hasColorVariance = uniformColorCheck();
        const hasEdges = edgeDetectionCheck();

        // Face detected if: (has color variation AND has some edges) OR (very clear edges)
        return (hasColorVariance && hasEdges) || hasEdges;
    };

    const getQualityMetrics = (canvas) => {
        const brightness = measureBrightness(canvas);
        const faceDetected = detectFacePresence(canvas);

        return {
            brightness,
            faceDetected,
            qualityScore: calculateQualityScore(brightness, faceDetected)
        };
    };

    const calculateQualityScore = (brightness, faceDetected) => {
        let score = 50;

        // Brightness check (ideal: 100-200)
        if (brightness >= 80 && brightness <= 220) {
            score += 25;
        } else if (brightness >= 60 && brightness <= 240) {
            score += 10;
        }

        // Face detection
        if (faceDetected) {
            score += 25;
        }

        return Math.min(100, score);
    };

    const isWebcamActive = () => isActive;

    return {
        startWebcam,
        stopWebcam,
        captureFrame,
        getQualityMetrics,
        isWebcamActive
    };
})();
