// js/modules/storage.js - LocalStorage management

const StorageModule = (() => {
    const saveAnalysis = (skinType, confidence) => {
        let history = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY_HISTORY) || '[]');

        history.unshift({
            // CODE SMELL FIX: Hapus field 'id' yang redundan dengan 'timestamp'
            // Gunakan timestamp saja sebagai identifier unik
            timestamp: Date.now(),
            date: new Date().toLocaleString('id-ID'),
            result: skinType,
            confidence: confidence
        });

        history = history.slice(0, CONFIG.MAX_HISTORY_ITEMS);
        localStorage.setItem(CONFIG.STORAGE_KEY_HISTORY, JSON.stringify(history));

        return history;
    };

    const getHistory = () => {
        try {
            // CODE SMELL FIX: Guard terhadap data corrupt di localStorage
            const raw = localStorage.getItem(CONFIG.STORAGE_KEY_HISTORY);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            // Validasi bahwa hasil parse adalah array
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            // Jika data corrupt (bukan valid JSON), kembalikan array kosong
            console.warn('SkinSense: History data corrupt, resetting.', e);
            localStorage.removeItem(CONFIG.STORAGE_KEY_HISTORY);
            return [];
        }
    };

    const clearHistory = () => {
        localStorage.removeItem(CONFIG.STORAGE_KEY_HISTORY);
    };

    const getHistoryStats = () => {
        const history = getHistory();
        const today = new Date().toLocaleDateString('id-ID');

        const stats = {
            total: history.length,
            today: history.filter(item => new Date(item.timestamp).toLocaleDateString('id-ID') === today).length,
            byType: {},
            last7Days: history.filter(item => {
                const itemDate = new Date(item.timestamp);
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                return itemDate >= sevenDaysAgo;
            })
        };

        history.forEach(item => {
            stats.byType[item.result] = (stats.byType[item.result] || 0) + 1;
        });

        // CODE SMELL FIX: Guard agar reduce tidak berjalan pada array kosong
        // dan mengembalikan string '-' sebagai initial value tanpa masuk logika reduce
        const mostCommon = stats.total > 0
            ? Object.keys(stats.byType).reduce((a, b) =>
                stats.byType[a] > stats.byType[b] ? a : b
            )
            : '-';

        stats.mostCommon = mostCommon;

        return stats;
    };

    const exportHistory = (format = 'json') => {
        const history = getHistory();
        if (format === 'json') {
            return JSON.stringify(history, null, 2);
        } else if (format === 'csv') {
            const headers = 'Date,Result,Confidence\n';
            const rows = history.map(item => `${item.date},${item.result},${item.confidence}`).join('\n');
            return headers + rows;
        }
    };

    return {
        saveAnalysis,
        getHistory,
        clearHistory,
        getHistoryStats,
        exportHistory
    };
})();
