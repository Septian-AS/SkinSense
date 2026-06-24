// js/main.js - Application entry point dan event handlers

// ========== INITIALIZATION ==========
async function initApp() {
    console.log('🚀 SkinSense starting...');

    UIModule.showLoadingState();
    showLoadingProgress();

    // Muat ML model dengan progress visual
    const modelResult = await ModelModule.loadModel();
    updateLoadingProgress(2);

    if (!modelResult.success) {
        clearLoadingProgress();
        UIModule.showModelError(modelResult.error);
        return;
    }

    updateLoadingProgress(3);

    // Delay singkat untuk UX
    await new Promise(resolve => setTimeout(resolve, 500));

    clearLoadingProgress();
    UIModule.hideLoadingState();

    // Inisialisasi UI
    UIModule.initTipsCarousel();
    UIModule.updateHistory();
    UIModule.updateAnalytics();

    // Setup semua event listener
    setupEventListeners();

    console.log('✅ SkinSense ready!');
}

// ========== LOADING PROGRESS ==========
let loadingIntervalId = null;

function showLoadingProgress() {
    const loadingText = document.getElementById('loading-text');
    if (!loadingText) return;

    const messages = [
        'Memuat AI Model...',
        'Menginisialisasi Model...',
        'Siap menganalisis kulit Anda!'
    ];

    let step = 0;
    loadingIntervalId = setInterval(() => {
        if (step < messages.length && loadingText) {
            loadingText.textContent = messages[step];
            step++;
        } else {
            clearLoadingProgress();
        }
    }, 1200);
}

function clearLoadingProgress() {
    if (loadingIntervalId !== null) {
        clearInterval(loadingIntervalId);
        loadingIntervalId = null;
    }
}

function updateLoadingProgress(step) {
    const s1 = document.getElementById('loading-step-1');
    const s2 = document.getElementById('loading-step-2');
    const s3 = document.getElementById('loading-step-3');

    if (!s1 || !s2 || !s3) return;

    if (step >= 1) { s1.textContent = '✓'; s1.style.color = '#10B981'; }
    if (step >= 2) { s2.textContent = '⟳'; s2.style.color = '#A855F7'; }
    if (step >= 3) { s3.textContent = '✓'; s3.style.color = '#10B981'; }
}

// ========== EVENT LISTENERS ==========
function setupEventListeners() {
    UIModule.elements.btnWebcam.addEventListener('click', toggleWebcam);
    UIModule.elements.btnCapture.addEventListener('click', captureAndAnalyze);
    
    // UX IMPROVEMENT: Gabungkan Retake dan New Analysis ke dalam 1 seamless loop
    UIModule.elements.btnRetake.addEventListener('click', startNewSession);

    UIModule.elements.btnShare?.addEventListener('click', () => {
        UIModule.showShareModal();
    });

    UIModule.elements.clearHistoryBtn.addEventListener('click', clearHistory);

    // UX IMPROVEMENT: Gabungkan Retake dan New Analysis ke dalam 1 seamless loop
    const btnNewAnalysis = document.getElementById('btn-new-analysis');
    if (btnNewAnalysis) {
        btnNewAnalysis.addEventListener('click', startNewSession);
    }
}

// ========== WEBCAM MANAGEMENT ==========
let isWebcamActive = false;

async function toggleWebcam() {
    if (isWebcamActive) {
        // Matikan kamera
        isWebcamActive = false;
        cancelQualityMonitor();
        WebcamModule.stopWebcam();
        UIModule.resetUIPostCapture();
        UIModule.elements.btnWebcam.disabled = false;
        UIModule.elements.btnWebcam.textContent = '📷 Aktifkan Kamera';
        UIModule.elements.btnCapture.disabled = true;
    } else {
        // Nyalakan kamera
        UIModule.elements.btnWebcam.disabled = true;
        UIModule.elements.btnWebcam.textContent = '⏳ Menyiapkan Kamera...';

        const result = await WebcamModule.startWebcam();

        if (!result.success) {
            UIModule.showNotification(
                '❌ Tidak dapat mengakses webcam. Periksa izin browser.',
                'error'
            );
            UIModule.elements.btnWebcam.disabled = false;
            UIModule.elements.btnWebcam.textContent = '📷 Aktifkan Kamera';
            return;
        }

        isWebcamActive = true;
        UIModule.elements.btnWebcam.disabled = false;
        UIModule.elements.btnWebcam.textContent = '❌ Matikan Kamera';

        // Tampilkan tombol capture
        UIModule.elements.btnCapture.hidden = false;
        UIModule.elements.btnCapture.style.display = 'flex';
        UIModule.elements.btnCapture.classList.remove('hidden');
        UIModule.elements.btnCapture.disabled = true; // Aktif setelah quality check

        // Mulai monitor kualitas
        monitorQuality();

        UIModule.showNotification('✓ Kamera aktif. Posisikan wajah Anda.', 'success');
    }
}

// ========== QUALITY MONITOR ==========
let qualityMonitorId = null;

function cancelQualityMonitor() {
    if (qualityMonitorId !== null) {
        cancelAnimationFrame(qualityMonitorId);
        qualityMonitorId = null;
    }
}

function monitorQuality() {
    const check = () => {
        const canvas = document.querySelector('#webcam-container canvas');
        if (canvas) {
            const metrics = WebcamModule.getQualityMetrics(canvas);
            UIModule.updateFaceIndicator(metrics.faceDetected);
            UIModule.updateBrightnessIndicator(metrics.brightness);

            const isGoodQuality = metrics.faceDetected &&
                metrics.brightness >= 80 &&
                metrics.brightness <= 220;
            UIModule.elements.btnCapture.disabled = !isGoodQuality;
        }

        if (isWebcamActive) {
            qualityMonitorId = requestAnimationFrame(check);
        }
    };

    check();
}

// ========== CAPTURE & ANALYZE ==========
// Flag untuk mencegah double-click saat sedang analisis
let isAnalyzing = false;

async function captureAndAnalyze() {
    // Guard: tolak jika sedang dalam proses analisis
    if (isAnalyzing) return;
    isAnalyzing = true;

    // BUGFIX #1 ROOT CAUSE: Sebelumnya, blok `finally` selalu mengaktifkan kembali
    // btnCapture (disabled=false) bahkan saat analisis berhasil dan tombol harusnya
    // tersembunyi. Solusi: Jangan pernah ubah state visibility di finally.
    // Visibilitas tombol dikelola HANYA oleh resetUIPostCapture dan toggleWebcam.

    UIModule.elements.btnCapture.disabled = true;
    UIModule.elements.btnCapture.textContent = '⏳ Menganalisis...';

    // Hentikan webcam dan quality monitor sebelum capture
    isWebcamActive = false;
    cancelQualityMonitor();

    let analysisSuccess = false;

    try {
        // Ambil frame dari webcam
        const canvas = WebcamModule.captureFrame();
        if (!canvas) throw new Error('Gagal mengambil foto dari kamera');

        // Stop webcam stream
        WebcamModule.stopWebcam();

        // Tampilkan hasil capture, sembunyikan webcam
        UIModule.elements.webcamContainer.classList.add('hidden');
        UIModule.elements.capturedCanvas.classList.remove('hidden');
        UIModule.elements.capturedCanvas.style.display = '';
        UIModule.elements.btnWebcam.textContent = '📷 Aktifkan Kamera';
        UIModule.elements.btnWebcam.disabled = false;
        UIModule.elements.btnCapture.hidden = true;
        UIModule.elements.btnCapture.classList.add('hidden');
        UIModule.elements.btnCapture.style.display = 'none';
        UIModule.elements.btnRetake.hidden = false;
        UIModule.elements.btnRetake.classList.remove('hidden');
        UIModule.elements.btnRetake.style.display = 'flex';
        UIModule.elements.btnRetake.disabled = true; // Nonaktif saat analisis berlangsung

        // Jalankan inferensi model
        const results = await AnalyzerModule.analyzeImage(UIModule.elements.capturedCanvas);
        const topPrediction = results.topPrediction;
        const validation = AnalyzerModule.validateResult(topPrediction);

        if (!validation.valid) {
            UIModule.showNotification(validation.message, 'warning', 4000);
            UIModule.elements.btnRetake.disabled = false;
            isAnalyzing = false;
            return;
        }

        // Simpan hasil ke storage
        const confidence = `${Math.round(topPrediction.probability * 100)}%`;
        StorageModule.saveAnalysis(topPrediction.className, confidence);

        // Tampilkan hasil di UI
        UIModule.displayResult(
            topPrediction.className,
            topPrediction.probability,
            results.allPredictions
        );

        // Update analytics dan history
        UIModule.updateHistory();
        UIModule.updateAnalytics();

        UIModule.showNotification('✓ Analisis selesai!', 'success');
        analysisSuccess = true;

    } catch (error) {
        console.error('Analysis error:', error);
        UIModule.showNotification('❌ Analisis gagal: ' + error.message, 'error', 4000);

        // Kembalikan ke state siap-capture (tampilkan webcam lagi)
        UIModule.resetUIPostCapture();
        UIModule.elements.btnWebcam.disabled = false;
        UIModule.elements.btnWebcam.textContent = '📷 Aktifkan Kamera';

    } finally {
        // BUGFIX #1: Finally HANYA mereset flag dan teks tombol capture.
        // Jika analisis berhasil, btnCapture sudah hidden — jangan ubah visibilitasnya.
        // Jika gagal, resetUIPostCapture sudah handle semua state tombol.
        isAnalyzing = false;

        // Kembalikan teks tombol (walaupun tersembunyi) untuk sesi berikutnya
        UIModule.elements.btnCapture.textContent = '✓ Capture & Analyze';

        // Aktifkan retake jika belum diaktifkan (dari error path)
        if (!analysisSuccess) {
            // Error path sudah di-handle di catch block
        } else {
            UIModule.elements.btnRetake.disabled = false;
        }
    }
}

// ========== SEAMLESS LOOP (NEW ANALYSIS & RETAKE) ==========
// Menyatukan fungsionalitas Retake dan New Analysis menjadi satu aliran yang mulus.
// Aplikasi akan mereset diri, menunggu pelepasan perangkat keras (kamera),
// dan langsung mengaktifkan kamera kembali tanpa perlu klik ekstra.
async function startNewSession() {
    // Jika sedang analisis, tolak
    if (isAnalyzing) return;

    // 1. Matikan komponen kamera
    isWebcamActive = false;
    cancelQualityMonitor();
    WebcamModule.stopWebcam();
    isAnalyzing = false;

    // 2. Reset UI ke kondisi awal (termasuk auto-scroll ke atas di ui.js)
    UIModule.resetUIPostCapture();
    UIModule.elements.btnWebcam.disabled = true; // Disabled sementara
    UIModule.elements.btnWebcam.textContent = '⏳ Memulai Ulang Kamera...';

    // 3. Jeda untuk memberikan waktu pada browser agar track media 
    //    benar-benar dilepaskan pada level hardware. (Mencegah "device in use")
    await new Promise(resolve => setTimeout(resolve, 500));

    // 4. Langsung otomatis nyalakan kembali kamera tanpa menunggu klik pengguna
    await toggleWebcam();
}

// ========== CLEAR HISTORY ==========
function clearHistory() {
    if (confirm('Apakah Anda yakin ingin menghapus semua riwayat?')) {
        StorageModule.clearHistory();
        UIModule.updateHistory();
        UIModule.updateAnalytics();
        UIModule.showNotification('✓ Riwayat dihapus', 'success');
    }
}

// ========== RESET UI (Legacy — dipakai oleh tombol matikan kamera) ==========
function resetUI() {
    isWebcamActive = false;
    cancelQualityMonitor();
    WebcamModule.stopWebcam();
    isAnalyzing = false;

    UIModule.resetUIPostCapture();
    UIModule.elements.btnWebcam.disabled = false;
    UIModule.elements.btnWebcam.textContent = '📷 Aktifkan Kamera';
    UIModule.elements.btnCapture.disabled = true;
}

// ========== PAGE LOAD ==========
document.addEventListener('DOMContentLoaded', initApp);

// ========== CLEANUP SAAT HALAMAN DITUTUP ==========
window.addEventListener('beforeunload', () => {
    isWebcamActive = false;
    cancelQualityMonitor();
    clearLoadingProgress();
    WebcamModule.stopWebcam();
});
