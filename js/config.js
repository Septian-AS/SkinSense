// js/config.js - Configuration constants

const CONFIG = {
    // Model settings
    MODEL_PATH: '../model/',
    MODEL_URL: '../model/model.json',
    METADATA_URL: '../model/metadata.json',

    // Inference settings
    CONFIDENCE_THRESHOLD_HIGH: 0.75,
    CONFIDENCE_THRESHOLD_MEDIUM: 0.60,
    CONFIDENCE_THRESHOLD_LOW: 0.50,
    DEFAULT_THRESHOLD: 0.60,

    // Webcam settings
    WEBCAM_SIZE: 640,
    INPUT_IMAGE_SIZE: 224,

    // Storage keys
    STORAGE_KEY_HISTORY: 'skinsense_history',
    MAX_HISTORY_ITEMS: 30,

    // Skin types
    SKIN_TYPES: ['Normal', 'Berminyak', 'Kering', 'Jerawat'],

    // UI animation durations (ms)
    ANIMATION_FAST: 150,
    ANIMATION_NORMAL: 300,
    ANIMATION_SLOW: 500,

    // Chart settings
    CHART_MAX_DAYS: 7,
};

// Skincare recommendations data
const SKINCARE_RULES = {
    'Normal': {
        emoji: '✨',
        description: 'Kulit Anda memiliki keseimbangan yang baik antara kandungan minyak dan air, tidak terlalu berminyak dan tidak terlalu kering.',
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
        dos: ['Gunakan sunscreen setiap pagi.', 'Cuci wajah maksimal dua kali sehari.', 'Minum air putih yang cukup.'],
        donts: ['Jangan menggosok wajah terlalu keras.', 'Hindari penggunaan sabun yang terlalu kuat.'],
        warning: 'Rekomendasi ini bersifat umum dan bukan pengganti konsultasi dokter kulit.'
    },
    'Berminyak': {
        emoji: '💧',
        description: 'Kulit Anda memproduksi sebum berlebih, terutama di area T-zone (dahi, hidung, dan dagu), sehingga wajah cenderung tampak mengilap.',
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
        dos: ['Gunakan produk non-comedogenic.', 'Gunakan pelembap berbasis gel.', 'Gunakan sunscreen setiap pagi.'],
        donts: ['Jangan mencuci wajah terlalu sering.', 'Hindari produk yang terlalu berminyak.', 'Jangan memencet jerawat.'],
        warning: 'Jika produksi minyak sangat berlebih dan disertai jerawat parah, pertimbangkan untuk berkonsultasi dengan dokter kulit.'
    },
    'Kering': {
        emoji: '🏜️',
        description: 'Kulit Anda kekurangan minyak alami sehingga terasa kencang, kasar, atau bahkan tampak bersisik.',
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
        dos: ['Gunakan pelembap secara rutin.', 'Minum air putih yang cukup.', 'Gunakan humidifier bila perlu.'],
        donts: ['Hindari mencuci wajah dengan air terlalu panas.', 'Jangan menggunakan produk yang mengandung alkohol tinggi.'],
        warning: 'Jika kulit sangat kering atau mengelupas secara berlebihan, disarankan berkonsultasi dengan dokter kulit.'
    },
    'Jerawat': {
        emoji: '🌋',
        description: 'Kulit Anda mengalami beberapa inflamasi atau bruntusan ringan yang umumnya dipicu oleh pori-pori tersumbat atau minyak berlebih.',
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
        dos: ['Gunakan produk non-comedogenic.', 'Gunakan sunscreen setiap pagi.', 'Jaga kebersihan wajah dan sarung bantal.'],
        donts: ['Jangan memencet jerawat.', 'Hindari menyentuh wajah dengan tangan kotor.', 'Jangan menggunakan terlalu banyak produk sekaligus.'],
        warning: 'Apabila jerawat semakin parah atau menimbulkan bekas yang dalam, disarankan berkonsultasi dengan dokter kulit.'
    }
};

// Tips for carousel - 15 tips lengkap untuk fotografi terbaik
const PHOTOGRAPHY_TIPS = [
    {
        title: '📸 Posisi Wajah',
        description: 'Pastikan wajah Anda mengisi 60-80% dari frame. Posisikan diri tepat di tengah kotak untuk hasil optimal.'
    },
    {
        title: '💡 Pencahayaan Ideal',
        description: 'Gunakan cahaya alami dari depan. Hindari bayangan yang terlalu gelap atau cahaya backlit yang terang.'
    },
    {
        title: '😐 Ekspresi Netral',
        description: 'Gunakan ekspresi wajah yang alami dan netral. Hindari tersenyum atau frown yang berlebihan.'
    },
    {
        title: '🕶️ Tanpa Aksesori',
        description: 'Lepas kacamata, topi, masker, dan aksesori wajah lainnya untuk analisis yang lebih akurat.'
    },
    {
        title: '⚖️ Kamera Sejajar',
        description: 'Posisikan kamera sejajar dengan wajah Anda. Jangan terlalu melihat ke atas atau ke bawah.'
    },
    {
        title: '☀️ Pencahayaan Natural',
        description: 'Cahaya matahari pagi atau sore hari (jam 9-11 pagi atau 4-6 sore) adalah waktu terbaik untuk foto.'
    },
    {
        title: '🪟 Dekat Jendela',
        description: 'Jika dalam ruangan, berdiri dekat jendela untuk mendapatkan cahaya alami yang merata di wajah.'
    },
    {
        title: '❌ Hindari Kilau',
        description: 'Jangan menggunakan lampu flash atau cahaya yang terlalu terang karena bisa menciptakan kilau berlebihan.'
    },
    {
        title: '📱 Jarak Kamera',
        description: 'Letakkan kamera pada jarak 30-40 cm dari wajah Anda untuk hasil yang tepat fokus.'
    },
    {
        title: '🔄 Posisi Samping Sedikit',
        description: 'Coba posisi head sedikit miring (±15°) untuk tampilan yang lebih natural dibanding full frontal.'
    },
    {
        title: '🧼 Wajah Bersih',
        description: 'Pastikan wajah bersih dan bebas riasan berat agar AI dapat menganalisis jenis kulit dengan akurat.'
    },
    {
        title: '💧 Hindari Kelembaban',
        description: 'Hindari mencuci wajah atau mengeringkan keringat berlebih sebelum foto untuk hasil analisis terbaik.'
    },
    {
        title: '🎯 Background Sederhana',
        description: 'Gunakan background yang tidak ramai (warna solid) agar wajah lebih fokus untuk analisis.'
    },
    {
        title: '⏱️ Ambil Beberapa Foto',
        description: 'Ambil beberapa foto dari berbagai posisi untuk mendapatkan hasil analisis yang paling akurat.'
    },
    {
        title: '✅ Cek Preview',
        description: 'Lihat preview sebelum analisis. Pastikan wajah jelas, pencahayaan bagus, dan tidak blur.'
    }
];
