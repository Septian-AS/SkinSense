// ==========================================
// 1. DATA REKOMENDASI (Rule-Based System)
// ==========================================
const SKINCARE_RULES = {

  'Normal': {
    description:
      'Kulit Anda memiliki keseimbangan yang baik antara kandungan minyak dan air, tidak terlalu berminyak dan tidak terlalu kering.',

    morningRoutine: [
      {
        step: 'Pembersih',
        product: 'Gentle Facial Wash (pH seimbang)',
        activeIngredient: '-',
        tips: 'Membersihkan kotoran tanpa membuat kulit kering.'
      },
      {
        step: 'Pelembap',
        product: 'Moisturizer Ringan / Gel',
        activeIngredient: 'Ceramide',
        tips: 'Mempertahankan hidrasi kulit sehari-hari.'
      },
      {
        step: 'Proteksi',
        product: 'Sunscreen SPF 30/50 PA+++',
        activeIngredient: 'Zinc Oxide',
        tips: 'Melindungi kulit dari paparan sinar UV.'
      }
    ],

    nightRoutine: [
      {
        step: 'Pembersih',
        product: 'Gentle Facial Wash (pH seimbang)',
        activeIngredient: '-',
        tips: 'Membersihkan wajah setelah aktivitas seharian.'
      },
      {
        step: 'Toner',
        product: 'Hydrating Toner',
        activeIngredient: 'Hyaluronic Acid',
        tips: 'Menjaga kelembapan alami kulit.'
      },
      {
        step: 'Pelembap',
        product: 'Moisturizer Ringan / Gel',
        activeIngredient: 'Ceramide',
        tips: 'Membantu regenerasi skin barrier saat tidur.'
      }
    ],

    dos: [
      'Gunakan sunscreen setiap pagi.',
      'Cuci wajah maksimal dua kali sehari.',
      'Minum air putih yang cukup.'
    ],

    donts: [
      'Jangan menggosok wajah terlalu keras.',
      'Hindari penggunaan sabun yang terlalu kuat.'
    ],

    warning:
      'Rekomendasi ini bersifat umum dan bukan pengganti konsultasi dokter kulit.'
  },

  'Berminyak': {
    description:
      'Kulit Anda memproduksi sebum berlebih, terutama di area T-zone (dahi, hidung, dan dagu), sehingga wajah cenderung tampak mengilap.',

    morningRoutine: [
      {
        step: 'Pembersih',
        product: 'Oil-Control Cleanser',
        activeIngredient: 'Salicylic Acid',
        tips: 'Membantu mengangkat minyak berlebih.'
      },
      {
        step: 'Pelembap',
        product: 'Oil-Free Gel Moisturizer',
        activeIngredient: 'Niacinamide',
        tips: 'Menjaga kelembapan tanpa membuat wajah semakin berminyak.'
      },
      {
        step: 'Proteksi',
        product: 'Sunscreen Matte Finish',
        activeIngredient: 'Zinc Oxide',
        tips: 'Melindungi kulit dari sinar UV tanpa efek greasy.'
      }
    ],

    nightRoutine: [
      {
        step: 'Pembersih',
        product: 'Oil-Control Cleanser',
        activeIngredient: 'Salicylic Acid',
        tips: 'Membersihkan minyak dan kotoran setelah beraktivitas.'
      },
      {
        step: 'Toner',
        product: 'Exfoliating Toner (BHA)',
        activeIngredient: 'Salicylic Acid',
        tips: 'Membantu mengontrol sebum dan mencegah komedo.'
      },
      {
        step: 'Pelembap',
        product: 'Oil-Free Gel Moisturizer',
        activeIngredient: 'Niacinamide',
        tips: 'Menjaga kesehatan skin barrier.'
      }
    ],

    dos: [
      'Gunakan produk non-comedogenic.',
      'Gunakan pelembap berbasis gel.',
      'Gunakan sunscreen setiap pagi.'
    ],

    donts: [
      'Jangan mencuci wajah terlalu sering.',
      'Hindari produk yang terlalu berminyak.',
      'Jangan memencet jerawat.'
    ],

    warning:
      'Jika produksi minyak sangat berlebih dan disertai jerawat parah, pertimbangkan untuk berkonsultasi dengan dokter kulit.'
  },

  'Kering': {
    description:
      'Kulit Anda kekurangan minyak alami sehingga terasa kencang, kasar, atau bahkan tampak bersisik.',

    morningRoutine: [
      {
        step: 'Pembersih',
        product: 'Cream-based / Milk Cleanser',
        activeIngredient: 'Ceramide',
        tips: 'Membersihkan kulit tanpa menghilangkan kelembapan alami.'
      },
      {
        step: 'Pelembap',
        product: 'Thick Cream Moisturizer',
        activeIngredient: 'Ceramide',
        tips: 'Mengunci kelembapan kulit.'
      },
      {
        step: 'Proteksi',
        product: 'Moisturizing Sunscreen',
        activeIngredient: 'Hyaluronic Acid',
        tips: 'Melindungi kulit sekaligus memberikan hidrasi.'
      }
    ],

    nightRoutine: [
      {
        step: 'Pembersih',
        product: 'Cream-based / Milk Cleanser',
        activeIngredient: 'Ceramide',
        tips: 'Membersihkan dengan lembut.'
      },
      {
        step: 'Toner',
        product: 'Rich Hydrating Toner',
        activeIngredient: 'Hyaluronic Acid',
        tips: 'Memberikan hidrasi mendalam.'
      },
      {
        step: 'Pelembap',
        product: 'Thick Cream Moisturizer',
        activeIngredient: 'Ceramide',
        tips: 'Membantu memperbaiki skin barrier saat tidur.'
      }
    ],

    dos: [
      'Gunakan pelembap secara rutin.',
      'Minum air putih yang cukup.',
      'Gunakan humidifier bila perlu.'
    ],

    donts: [
      'Hindari mencuci wajah dengan air terlalu panas.',
      'Jangan menggunakan produk yang mengandung alkohol tinggi.'
    ],

    warning:
      'Jika kulit sangat kering atau mengelupas secara berlebihan, disarankan berkonsultasi dengan dokter kulit.'
  },

  'Jerawat Ringan': {
    description:
      'Kulit Anda mengalami beberapa inflamasi atau bruntusan ringan yang umumnya dipicu oleh pori-pori tersumbat atau minyak berlebih.',

    morningRoutine: [
      {
        step: 'Pembersih',
        product: 'Acne Cleanser',
        activeIngredient: 'Salicylic Acid',
        tips: 'Membantu membersihkan pori dan bakteri penyebab jerawat.'
      },
      {
        step: 'Pelembap',
        product: 'Lightweight Soothing Gel',
        activeIngredient: 'Centella Asiatica',
        tips: 'Menenangkan kulit dan menjaga hidrasi.'
      },
      {
        step: 'Proteksi',
        product: 'Non-Comedogenic Sunscreen',
        activeIngredient: 'Zinc Oxide',
        tips: 'Melindungi kulit berjerawat dari sinar UV.'
      }
    ],

    nightRoutine: [
      {
        step: 'Pembersih',
        product: 'Acne Cleanser',
        activeIngredient: 'Salicylic Acid',
        tips: 'Membersihkan kotoran dan minyak setelah aktivitas sehari-hari.'
      },
      {
        step: 'Toner',
        product: 'Calming Toner',
        activeIngredient: 'Centella Asiatica',
        tips: 'Meredakan kemerahan dan iritasi.'
      },
      {
        step: 'Pelembap',
        product: 'Lightweight Soothing Gel',
        activeIngredient: 'Niacinamide',
        tips: 'Menjaga skin barrier tanpa menyumbat pori.'
      }
    ],

    dos: [
      'Gunakan produk non-comedogenic.',
      'Gunakan sunscreen setiap pagi.',
      'Jaga kebersihan wajah dan sarung bantal.'
    ],

    donts: [
      'Jangan memencet jerawat.',
      'Hindari menyentuh wajah dengan tangan kotor.',
      'Jangan menggunakan terlalu banyak produk sekaligus.'
    ],

    warning:
      'Apabila jerawat semakin parah atau menimbulkan bekas yang dalam, disarankan berkonsultasi dengan dokter kulit.'
  }

};

// MENGARAH KE FOLDER LOKAL MODEL
const LOCAL_MODEL_URL = "./model/"; 

let model = null;
let webcam = null;
let isWebcamActive = false;
let animationFrameId = null;

// DOM Elements
const loadingModelEl = document.getElementById('loading-model');
const webcamPlaceholderEl = document.getElementById('webcam-placeholder');
const webcamContainerEl = document.getElementById('webcam-container');
const btnWebcamEl = document.getElementById('btn-webcam');
const btnCaptureEl = document.getElementById('btn-capture');
const btnRetakeEl = document.getElementById('btn-retake');
const capturedCanvasEl = document.getElementById('captured-canvas');

const accuracyCardEl = document.getElementById('accuracy-card');
const predictionBarsEl = document.getElementById('prediction-bars');
const emptyStateEl = document.getElementById('empty-state');
const resultStateEl = document.getElementById('result-state');
const skinConditionTitleEl = document.getElementById('skin-condition-title');
const skinConditionDescEl = document.getElementById('skin-condition-desc');
const recommendationsListEl = document.getElementById('recommendations-list');
const historyListEl =document.getElementById('history-list');
const clearHistoryBtn =document.getElementById('clear-history');

// ==========================================
// 2. LOAD LOCAL MODEL
// ==========================================

async function initApp() {
    try {
        const modelURL = LOCAL_MODEL_URL + "model.json";
        const metadataURL = LOCAL_MODEL_URL + "metadata.json";
        
        // Memuat model dari folder lokal sistem
        model = await tmImage.load(modelURL, metadataURL);
        
        loadingModelEl.classList.add('hidden');
        webcamPlaceholderEl.classList.remove('hidden');
        
        btnWebcamEl.innerText = "Aktifkan Kamera Wajah";
        btnWebcamEl.disabled = false;
        btnWebcamEl.className = "w-full py-3 px-6 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-800 cursor-pointer";
    } catch (error) {
        console.error("Gagal memuat model lokal:", error);
        loadingModelEl.innerHTML = `
            <div class="text-red-500 text-xs p-2">
                <p class="font-bold">Gagal memuat model lokal!</p>
                <p class="mt-1">Pastikan folder bernama 'model' berisi file model.json, metadata.json, dan weights.bin diletakkan sejajar dengan file app.js.</p>
            </div>`;
    }
}

// ==========================================
// 3. WEBCAM MANAGEMENT
// ==========================================
async function toggleWebcam() {
    if (isWebcamActive) {
        stopWebcamStreams();
        resetUIPostCapture();
        
        btnWebcamEl.innerText = "Aktifkan Kamera Wajah";
        btnWebcamEl.className = "w-full py-3 px-6 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-800 cursor-pointer";
        btnCaptureEl.classList.add('hidden');
        btnRetakeEl.classList.add('hidden');
    } else {
        btnWebcamEl.innerText = "Menyiapkan Kamera...";
        btnWebcamEl.disabled = true;
        
        try {
            const size = 640; 
            webcam = new tmImage.Webcam(size, size, true);
            
            await webcam.setup();
            await webcam.play();
            
            webcamContainerEl.innerHTML = "";
            webcamContainerEl.appendChild(webcam.canvas);
            
            webcamPlaceholderEl.classList.add('hidden');
            webcamContainerEl.classList.remove('hidden');
            capturedCanvasEl.classList.add('hidden');
            
            isWebcamActive = true;
            btnWebcamEl.disabled = false;
            btnWebcamEl.innerText = "Matikan Kamera";
            btnWebcamEl.className = "w-full py-3 px-6 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 cursor-pointer";
            
            btnCaptureEl.classList.remove('hidden');
            btnRetakeEl.classList.add('hidden');
            
            animationFrameId = requestAnimationFrame(loopWebcamPreview);
        } catch (err) {
            alert("Gagal mengakses webcam. Mohon pastikan browser Anda mengizinkan akses kamera.");
            btnWebcamEl.disabled = false;
            btnWebcamEl.innerText = "Aktifkan Kamera Wajah";
            btnWebcamEl.className = "w-full py-3 px-6 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-800 cursor-pointer";
        }
    }
}

function stopWebcamStreams() {
     if (webcam) {
        webcam.stop();
    }

    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }

    isWebcamActive = false;
}


function loopWebcamPreview() {
    if (isWebcamActive && webcam && webcam.canvas) {
        webcam.update();
        animationFrameId = requestAnimationFrame(loopWebcamPreview);
    }
}

// ==========================================
// 4. LOGIKA CAPTURE FOTO & ANALISIS AI
// ==========================================
async function captureAndAnalyze() {

    if (!model || !webcam || !webcam.canvas) return;

    const ctx = capturedCanvasEl.getContext('2d');

    capturedCanvasEl.width =
        webcam.canvas.width;

    capturedCanvasEl.height =
        webcam.canvas.height;

    ctx.drawImage(
        webcam.canvas,
        0,
        0
    );

    const faceDetected =

    webcamContainerEl.classList.add('hidden');
    capturedCanvasEl.classList.remove('hidden');

    stopWebcamStreams();

    btnCaptureEl.classList.add('hidden');
    btnRetakeEl.classList.remove('hidden');

    btnWebcamEl.innerText =
        "Matikan Kamera & Reset";

    const predictions =
        await model.predict(
            capturedCanvasEl
        );

    const sortedPredictions =
    [...predictions].sort(
        (a, b) => b.probability - a.probability
    );

    if (sortedPredictions[0].probability < 0.60) {

        alert(
            "Foto tidak cukup jelas untuk dianalisis. Silakan ambil foto ulang."
        );

        return;
    }
    accuracyCardEl.classList.remove('hidden');

    renderAccuracyBars(
        predictions,
        sortedPredictions[0].className
    );

    if (
        sortedPredictions[0] &&
        sortedPredictions[0].probability > 0.1
    ) {

        const topClass =
            sortedPredictions[0].className;

        const confidence =
    (
        sortedPredictions[0]
            .probability * 100
        ).toFixed(0) + "%";

    saveHistory(
        topClass,
        confidence
    );

    displaySkincareRecommendations(
        topClass
    );

renderHistory();
        
    }
}
function saveHistory(
    skinType,
    confidence
) {

    let history =
        JSON.parse(
            localStorage.getItem(
                "skinsense_history"
            )
        ) || [];

    history.unshift({
        date:
            new Date().toLocaleString(
                "id-ID"
            ),
        result:
            skinType,
        confidence:
            confidence
    });

    history = history.slice(0, 20);

    localStorage.setItem(
        "skinsense_history",
        JSON.stringify(history)
    );
}   

function renderHistory() {

    const history =
        JSON.parse(
            localStorage.getItem(
                "skinsense_history"
            )
        ) || [];

    historyListEl.innerHTML = "";

    if (
        history.length === 0
    ) {

        historyListEl.innerHTML = `
            <p class="text-sm text-slate-500">
                Belum ada riwayat analisis.
            </p>
        `;

        return;
    }

    history.forEach(item => {

        historyListEl.innerHTML += `
            <div class="border rounded-xl p-3">
                <div class="font-semibold text-slate-800">
                    ${item.result}
                </div>

                <div class="text-xs text-slate-500">
                    ${item.date}
                </div>

                <div class="text-sm text-emerald-600 mt-1">
                    Akurasi:
                    ${item.confidence}
                </div>
            </div>
        `;
    });
}
function retakePhoto() {
    resetUIPostCapture();
    isWebcamActive = false;
    toggleWebcam();
}

function resetUIPostCapture() {
    webcamContainerEl.classList.add('hidden');
    capturedCanvasEl.classList.add('hidden');
    webcamPlaceholderEl.classList.remove('hidden');
    accuracyCardEl.classList.add('hidden');
    resultStateEl.classList.add('hidden');
    emptyStateEl.classList.remove('hidden');
}

// ==========================================
// 5. RENDER UI HASIL & BAR
// ==========================================
function renderAccuracyBars(predictions, topClassName) {
    predictionBarsEl.innerHTML = "";
    predictions.forEach(item => {
        const percentage = (item.probability * 100).toFixed(0);
        const isTop = item.className === topClassName;
        const barColor = isTop ? 'bg-emerald-500' : 'bg-slate-300';
        
        const barHtml = `
            <div>
                <div class="flex justify-between text-xs font-medium text-slate-600 mb-1">
                    <span>Kulit ${item.className}</span>
                    <span>${percentage}%</span>
                </div>
                <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-300 ${barColor}" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
        predictionBarsEl.insertAdjacentHTML('beforeend', barHtml);
    });
}

function displaySkincareRecommendations(className) {

    const dataRule = SKINCARE_RULES[className];

    if (!dataRule) return;

    emptyStateEl.classList.add('hidden');
    resultStateEl.classList.remove('hidden');

    skinConditionTitleEl.innerText =
        `Kondisi Kulit: ${className}`;

    skinConditionDescEl.innerText =
        dataRule.description;

    recommendationsListEl.innerHTML = "";

    // ==================
    // Rutinitas Pagi
    // ==================
    recommendationsListEl.insertAdjacentHTML(
        'beforeend',
        `
        <h3 class="font-bold text-slate-800 mt-4 mb-3">
            🌞 Rutinitas Pagi
        </h3>
        `
    );

    dataRule.morningRoutine.forEach(item => {

        recommendationsListEl.insertAdjacentHTML(
            'beforeend',
            `
            <div class="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 mb-3">

                <div class="bg-slate-200 text-slate-700 text-xs font-bold px-2 py-1 rounded min-w-[85px] text-center uppercase">
                    ${item.step}
                </div>

                <div class="flex-1">

                    <h4 class="font-semibold text-sm">
                        ${item.product}
                    </h4>

                    <p class="text-xs text-emerald-600 mt-1">
                        Bahan aktif:
                        ${item.activeIngredient}
                    </p>

                    <p class="text-xs text-slate-500 mt-1">
                        ${item.tips}
                    </p>

                </div>

            </div>
            `
        );
    });

    // ==================
    // Rutinitas Malam
    // ==================
    recommendationsListEl.insertAdjacentHTML(
        'beforeend',
        `
        <h3 class="font-bold text-slate-800 mt-6 mb-3">
            🌙 Rutinitas Malam
        </h3>
        `
    );

    dataRule.nightRoutine.forEach(item => {

        recommendationsListEl.insertAdjacentHTML(
            'beforeend',
            `
            <div class="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 mb-3">

                <div class="bg-slate-200 text-slate-700 text-xs font-bold px-2 py-1 rounded min-w-[85px] text-center uppercase">
                    ${item.step}
                </div>

                <div class="flex-1">

                    <h4 class="font-semibold text-sm">
                        ${item.product}
                    </h4>

                    <p class="text-xs text-emerald-600 mt-1">
                        Bahan aktif:
                        ${item.activeIngredient}
                    </p>

                    <p class="text-xs text-slate-500 mt-1">
                        ${item.tips}
                    </p>

                </div>

            </div>
            `
        );
    });

    // ==================
    // Do
    // ==================
    recommendationsListEl.insertAdjacentHTML(
        'beforeend',
        `
        <div class="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200">

            <h3 class="font-bold text-emerald-700 mb-2">
                ✅ Yang Dianjurkan
            </h3>

            <ul class="text-sm text-slate-700 list-disc pl-5">
                ${dataRule.dos.map(item => `<li>${item}</li>`).join('')}
            </ul>

        </div>
        `
    );

    // ==================
    // Don't
    // ==================
    recommendationsListEl.insertAdjacentHTML(
        'beforeend',
        `
        <div class="mt-4 p-4 rounded-xl bg-red-50 border border-red-200">

            <h3 class="font-bold text-red-700 mb-2">
                ❌ Yang Sebaiknya Dihindari
            </h3>

            <ul class="text-sm text-slate-700 list-disc pl-5">
                ${dataRule.donts.map(item => `<li>${item}</li>`).join('')}
            </ul>

        </div>
        `
    );

    // ==================
    // Warning
    // ==================
    recommendationsListEl.insertAdjacentHTML(
        'beforeend',
        `
        <div class="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200">

            <h3 class="font-bold text-amber-700 mb-2">
                ⚠️ Perhatian
            </h3>

            <p class="text-sm text-slate-700">
                ${dataRule.warning}
            </p>

        </div>
        `
    );

}


// Event Listeners
btnWebcamEl.addEventListener('click', toggleWebcam);
btnCaptureEl.addEventListener('click', captureAndAnalyze);
btnRetakeEl.addEventListener('click', retakePhoto);
document.addEventListener(
    'DOMContentLoaded',
    () => {

        initApp();

        renderHistory();
    }
);
clearHistoryBtn.addEventListener(
    'click',
    () => {

        localStorage.removeItem(
            "skinsense_history"
        );

        renderHistory();
    }
);