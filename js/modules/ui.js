// js/modules/ui.js - UI rendering and interactions

const UIModule = (() => {
    // DOM Elements - di-cache saat IIFE dijalankan (setelah DOM siap karena script di akhir body)
    const elements = {
        loadingModel: document.getElementById('loading-model'),
        btnWebcam: document.getElementById('btn-webcam'),
        btnCapture: document.getElementById('btn-capture'),
        btnRetake: document.getElementById('btn-retake'),
        webcamContainer: document.getElementById('webcam-container'),
        capturedCanvas: document.getElementById('captured-canvas'),
        emptyState: document.getElementById('empty-state'),
        resultState: document.getElementById('result-state'),
        skinTitle: document.getElementById('skin-condition-title'),
        skinDesc: document.getElementById('skin-condition-desc'),
        confidenceValue: document.getElementById('confidence-value'),
        predictionBars: document.getElementById('prediction-bars'),
        accuracySection: document.getElementById('accuracy-section'),
        recommendationsList: document.getElementById('recommendations-list'),
        historyList: document.getElementById('history-list'),
        clearHistoryBtn: document.getElementById('clear-history'),
        btnShare: document.getElementById('btn-share'),
        faceIndicator: document.getElementById('face-indicator'),
        brightnessIndicator: document.getElementById('brightness-indicator'),
        trendChart: document.getElementById('trend-chart'),
        totalScans: document.getElementById('total-scans'),
        mostCommon: document.getElementById('most-common'),
        todayScans: document.getElementById('today-scans'),
        shareModal: document.getElementById('share-modal'),
        toast: document.getElementById('notification-toast'),
        carouselTrack: document.querySelector('.carousel-track'),
        confidenceRingProgress: document.getElementById('confidence-ring-progress')
    };

    let trendChartInstance = null;
    let currentSkinType = null;
    // Untuk mencegah notification timer saling tumpuk
    let toastTimerId = null;

    // ===== MODEL LOADING =====
    const showLoadingState = () => {
        elements.loadingModel.classList.remove('hidden');
        elements.btnWebcam.disabled = true;
        elements.btnWebcam.textContent = '📱 Memuat Model...';
    };

    const hideLoadingState = () => {
        elements.loadingModel.classList.add('hidden');
        elements.btnWebcam.disabled = false;
        elements.btnWebcam.textContent = '📷 Aktifkan Kamera';
    };

    const showModelError = (error) => {
        // SECURITY FIX: Gunakan textContent agar tidak ada risiko XSS
        const container = elements.loadingModel;
        container.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'text-align: center; color: #EF4444;';

        const icon = document.createElement('div');
        icon.style.cssText = 'font-size: 2rem; margin-bottom: 0.5rem;';
        icon.textContent = '❌';

        const title = document.createElement('p');
        title.style.cssText = 'font-weight: 700; margin-bottom: 0.5rem;';
        title.textContent = 'Model gagal dimuat!';

        const detail = document.createElement('p');
        detail.style.cssText = 'font-size: 0.9rem; margin: 0;';
        detail.textContent = error;

        wrapper.appendChild(icon);
        wrapper.appendChild(title);
        wrapper.appendChild(detail);
        container.appendChild(wrapper);
    };

    // ===== WEBCAM UI =====
    const updateFaceIndicator = (detected) => {
        const indicator = elements.faceIndicator;
        if (!indicator) return;
        const dot = indicator.querySelector('.indicator-dot');
        const text = indicator.querySelector('.indicator-text');

        // Bersihkan semua state class terlebih dahulu
        dot.classList.remove('success', 'error');

        if (detected) {
            indicator.style.backgroundColor = 'rgba(16, 185, 129, 0.8)';
            dot.classList.add('success');
            text.textContent = '✓ Wajah terdeteksi';
        } else {
            indicator.style.backgroundColor = 'rgba(239, 68, 68, 0.8)';
            dot.classList.add('error');
            text.textContent = '✗ Posisikan wajah ke tengah';
        }
    };

    const updateBrightnessIndicator = (brightness) => {
        const indicator = elements.brightnessIndicator;
        if (!indicator) return;
        const dot = indicator.querySelector('.indicator-dot');
        const text = indicator.querySelector('.indicator-text');

        // Selalu bersihkan semua state class sebelum menambahkan yang baru
        dot.classList.remove('success', 'error');

        if (brightness < 80) {
            indicator.style.backgroundColor = 'rgba(245, 158, 11, 0.8)';
            dot.classList.add('error');
            text.textContent = '⚠️ Terlalu gelap - naikkan cahaya';
        } else if (brightness > 220) {
            indicator.style.backgroundColor = 'rgba(245, 158, 11, 0.8)';
            dot.classList.add('error');
            text.textContent = '⚠️ Terlalu terang - kurangi cahaya';
        } else {
            indicator.style.backgroundColor = 'rgba(16, 185, 129, 0.8)';
            dot.classList.add('success');
            text.textContent = '✓ Pencahayaan optimal';
        }
    };

    // ===== RESULTS DISPLAY =====
    const displayResult = (skinType, confidence, predictions) => {
        currentSkinType = skinType;

        elements.emptyState.hidden = true;
        elements.resultState.hidden = false;

        // Update title dan description
        const rule = SKINCARE_RULES[skinType];
        if (rule) {
            elements.skinTitle.textContent = `${AnalyzerModule.getSkinTypeEmoji(skinType)} ${skinType}`;
            elements.skinDesc.textContent = rule.description;
        }

        // Update confidence circle
        updateConfidenceRing(confidence);

        // Update prediction bars
        updatePredictionBars(predictions);

        // Tampilkan rekomendasi
        elements.recommendationsList.innerHTML = RecommendationsModule.renderRecommendations(skinType);

        // UX IMPROVEMENT: Sembunyikan Photography Tips karena sudah tidak relevan
        // setelah gambar diambil dan dianalisis
        const tipsSection = document.querySelector('.tips-section');
        if (tipsSection) {
            tipsSection.hidden = true;
            tipsSection.style.display = 'none';
        }

        // Scroll ke hasil
        setTimeout(() => {
            elements.resultState.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const updateConfidenceRing = (confidence) => {
        const percent = Math.min(100, confidence * 100);
        elements.confidenceValue.textContent = Math.round(percent) + '%';

        if (elements.confidenceRingProgress) {
            const circumference = 282.7;
            const offset = circumference - (percent / 100) * circumference;
            elements.confidenceRingProgress.style.strokeDashoffset = offset;
        }
    };

    const updatePredictionBars = (predictions) => {
        elements.predictionBars.innerHTML = '';

        predictions.forEach(pred => {
            const percentage = Math.round(pred.probability * 100);
            const html = `
                <div class="prediction-bar">
                    <div class="prediction-bar-label">
                        <span>Kulit ${pred.className}</span>
                        <span>${percentage}%</span>
                    </div>
                    <div class="prediction-bar-track">
                        <div class="prediction-bar-fill" style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
            elements.predictionBars.insertAdjacentHTML('beforeend', html);
        });

        // Tampilkan accuracy section
        if (elements.accuracySection) {
            elements.accuracySection.hidden = false;
        }
    };

    // ===== HISTORY =====
    const updateHistory = () => {
        const history = StorageModule.getHistory();

        if (history.length === 0) {
            elements.historyList.innerHTML = '<p class="history-empty">Belum ada riwayat analisis</p>';
            return;
        }

        let html = '';
        history.forEach(item => {
            html += `
                <div class="history-item">
                    <div class="history-item-info">
                        <div class="history-item-type">${AnalyzerModule.getSkinTypeEmoji(item.result)} ${item.result}</div>
                        <div class="history-item-date">${item.date}</div>
                    </div>
                    <div class="history-item-confidence">🎯 ${item.confidence}</div>
                </div>
            `;
        });

        elements.historyList.innerHTML = html;
    };

    // ===== ANALYTICS =====
    const updateAnalytics = () => {
        const stats = StorageModule.getHistoryStats();

        elements.totalScans.textContent = stats.total;
        elements.mostCommon.textContent = stats.mostCommon;
        elements.todayScans.textContent = stats.today;

        updateTrendChart(stats.last7Days);
    };

    const updateTrendChart = (data) => {
        const ctx = elements.trendChart.getContext('2d');

        // Group by day
        const byDate = {};
        const now = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString('id-ID');
            byDate[dateStr] = 0;
        }

        data.forEach(item => {
            const dateStr = new Date(item.timestamp).toLocaleDateString('id-ID');
            if (byDate[dateStr] !== undefined) {
                byDate[dateStr]++;
            }
        });

        const labels = Object.keys(byDate);
        const values = Object.values(byDate);

        // UX & PERFORMANCE IMPROVEMENT: Jangan hancurkan chart jika sudah ada,
        // cukup update datanya agar transisi animasi mulus.
        if (trendChartInstance) {
            trendChartInstance.data.labels = labels;
            trendChartInstance.data.datasets[0].data = values;
            trendChartInstance.options.scales.y.max = Math.max(...values, 5);
            trendChartInstance.update();
            return;
        }

        trendChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Analisis',
                    data: values,
                    borderColor: '#A855F7',
                    backgroundColor: 'rgba(168, 85, 247, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#A855F7',
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0 // Hanya tampilkan bilangan bulat
                        },
                        max: Math.max(...values, 5)
                    }
                }
            }
        });
    };

    // ===== NOTIFICATIONS =====
    const showNotification = (message, type = 'success', duration = 3000) => {
        // Batalkan timer sebelumnya agar notifikasi tidak saling tumpuk
        if (toastTimerId !== null) {
            clearTimeout(toastTimerId);
            toastTimerId = null;
        }

        elements.toast.textContent = message;
        elements.toast.className = `toast ${type}`;
        elements.toast.hidden = false;

        toastTimerId = setTimeout(() => {
            elements.toast.hidden = true;
            toastTimerId = null;
        }, duration);
    };

    // ===== TIPS CAROUSEL =====
    const initTipsCarousel = () => {
        let currentIndex = 0;
        const totalTips = PHOTOGRAPHY_TIPS.length;

        const track = elements.carouselTrack;
        if (!track) {
            console.error('SkinSense: .carousel-track element tidak ditemukan');
            return;
        }

        // Bersihkan dan bangun carousel items
        track.innerHTML = '';
        // Hapus inline styling karena akan dikelola via CSS Scroll Snap
        track.style = '';

        PHOTOGRAPHY_TIPS.forEach((tip, idx) => {
            const item = document.createElement('div');
            item.className = 'carousel-item';
            item.dataset.index = idx;

            const h4 = document.createElement('h4');
            h4.textContent = tip.title;

            const p = document.createElement('p');
            p.textContent = tip.description;

            item.appendChild(h4);
            item.appendChild(p);
            track.appendChild(item);
        });

        // Set total indicator
        const totalEl = document.getElementById('carousel-total');
        if (totalEl) totalEl.textContent = totalTips;

        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');

        const updateIndicator = () => {
            const scrollLeft = track.scrollLeft;
            const itemWidth = track.clientWidth;
            // Deteksi item yang paling dominan di viewport
            currentIndex = Math.round(scrollLeft / itemWidth);
            
            const currentEl = document.getElementById('carousel-current');
            if (currentEl) currentEl.textContent = currentIndex + 1;
        };

        // Scroll Snap Listener: otomatis update indikator saat user geser layar
        track.addEventListener('scroll', () => {
            // Gunakan debounce ringan via rAF untuk performa
            requestAnimationFrame(updateIndicator);
        }, { passive: true });

        // Navigasi Tombol Desktop
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' });
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                track.scrollBy({ left: track.clientWidth, behavior: 'smooth' });
            });
        }
    };

    // ===== MODAL =====
    const showShareModal = () => {
        elements.shareModal.hidden = false;

        const overlay = elements.shareModal.querySelector('.modal-overlay');
        const closeBtn = elements.shareModal.querySelector('.modal-close');

        // MEMORY LEAK FIX: { once: true } — listener otomatis dihapus setelah dipanggil
        overlay.addEventListener('click', () => {
            elements.shareModal.hidden = true;
        }, { once: true });

        closeBtn.addEventListener('click', () => {
            elements.shareModal.hidden = true;
        }, { once: true });

        const shareBtns = elements.shareModal.querySelectorAll('.share-btn');
        shareBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.share;
                handleShare(type);
                elements.shareModal.hidden = true;
            }, { once: true });
        });
    };

    const handleShare = (type) => {
        const text = `Hasil analisis SkinSense: Tipe kulit saya adalah ${currentSkinType}. Coba sekarang juga! 🌟`;

        if (type === 'copy') {
            navigator.clipboard.writeText(text).then(() => {
                showNotification('✓ Hasil disalin ke clipboard!', 'success');
            }).catch(() => {
                showNotification('❌ Gagal menyalin ke clipboard', 'error');
            });
        } else if (type === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
        } else if (type === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
        }
    };

    // ===== RESET UI =====
    // Dipanggil setelah capture/analysis selesai ATAU saat New Analysis/Retake
    const resetUIPostCapture = () => {
        // Reset skin type state
        currentSkinType = null;

        // --- Tampilan kamera ---
        // Tampilkan webcam container, sembunyikan canvas
        elements.webcamContainer.classList.remove('hidden');
        elements.webcamContainer.style.display = '';
        elements.capturedCanvas.classList.add('hidden');
        elements.capturedCanvas.style.display = 'none';

        // Bersihkan canvas (hapus gambar yang ditangkap sebelumnya)
        const ctx = elements.capturedCanvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, elements.capturedCanvas.width, elements.capturedCanvas.height);
        }

        // --- Tampilan hasil ---
        // Tampilkan empty state, sembunyikan result state
        elements.emptyState.hidden = false;
        elements.emptyState.style.display = 'flex';
        elements.resultState.hidden = true;
        elements.resultState.style.display = '';

        // BUGFIX #3: Reset accuracy section yang tidak di-reset sebelumnya
        // Menyebabkan prediction bars dari analisis lama masih visible
        if (elements.accuracySection) {
            elements.accuracySection.hidden = true;
        }
        if (elements.predictionBars) {
            elements.predictionBars.innerHTML = '';
        }

        // BUGFIX #3: Reset confidence ring ke posisi awal
        elements.confidenceValue.textContent = '0%';
        if (elements.confidenceRingProgress) {
            elements.confidenceRingProgress.style.strokeDashoffset = '282.7';
        }

        // Reset title dan description
        elements.skinTitle.textContent = '-';
        elements.skinDesc.textContent = '-';

        // Bersihkan rekomendasi
        if (elements.recommendationsList) {
            elements.recommendationsList.innerHTML = '';
        }

        // UX IMPROVEMENT: Tampilkan kembali Photography Tips saat reset
        const tipsSection = document.querySelector('.tips-section');
        if (tipsSection) {
            tipsSection.hidden = false;
            tipsSection.style.display = '';
        }

        // UX IMPROVEMENT: Auto-scroll ke atas (kamera) dengan smooth behavior
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // --- Tombol ---
        // BUGFIX #1: Sembunyikan btnCapture dengan benar (semua atribut)
        elements.btnCapture.hidden = true;
        elements.btnCapture.classList.add('hidden');
        elements.btnCapture.style.display = 'none';
        elements.btnCapture.disabled = true;

        // Sembunyikan btnRetake
        elements.btnRetake.hidden = true;
        elements.btnRetake.classList.add('hidden');
        elements.btnRetake.style.display = 'none';
        elements.btnRetake.disabled = false;
    };

    return {
        showLoadingState,
        hideLoadingState,
        showModelError,
        updateFaceIndicator,
        updateBrightnessIndicator,
        displayResult,
        updateHistory,
        updateAnalytics,
        showNotification,
        initTipsCarousel,
        showShareModal,
        resetUIPostCapture,
        elements
    };
})();
