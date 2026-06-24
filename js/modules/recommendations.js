// js/modules/recommendations.js - Skincare recommendations

const RecommendationsModule = (() => {
    const getSkinCareRules = (skinType) => {
        return SKINCARE_RULES[skinType] || null;
    };

    const renderRecommendations = (skinType) => {
        const rules = getSkinCareRules(skinType);
        if (!rules) return '';

        let html = '';

        // Morning Routine
        html += '<div class="routine-section"><h4 style="color: #A855F7; margin-bottom: 1rem;">🌞 Rutinitas Pagi</h4>';
        rules.morningRoutine.forEach(item => {
            html += `
                <div class="recommendation-item">
                    <span class="recommendation-item-step">${item.step}</span>
                    <div class="recommendation-product">${item.product}</div>
                    <div class="recommendation-ingredient">💊 Bahan aktif: ${item.activeIngredient}</div>
                    <div class="recommendation-tips">${item.tips}</div>
                </div>
            `;
        });
        html += '</div>';

        // Night Routine
        html += '<div class="routine-section"><h4 style="color: #A855F7; margin-bottom: 1rem;">🌙 Rutinitas Malam</h4>';
        rules.nightRoutine.forEach(item => {
            html += `
                <div class="recommendation-item">
                    <span class="recommendation-item-step">${item.step}</span>
                    <div class="recommendation-product">${item.product}</div>
                    <div class="recommendation-ingredient">💊 Bahan aktif: ${item.activeIngredient}</div>
                    <div class="recommendation-tips">${item.tips}</div>
                </div>
            `;
        });
        html += '</div>';

        // Do's
        html += `
            <div style="background-color: #D1FAE5; border-left: 4px solid #10B981; padding: 1rem; border-radius: 0.75rem; margin-top: 1rem;">
                <h4 style="color: #059669; margin: 0 0 0.5rem 0;">✅ Yang Dianjurkan</h4>
                <ul style="margin: 0; padding-left: 1.25rem;">
                    ${rules.dos.map(d => `<li>${d}</li>`).join('')}
                </ul>
            </div>
        `;

        // Don'ts
        html += `
            <div style="background-color: #FEE2E2; border-left: 4px solid #EF4444; padding: 1rem; border-radius: 0.75rem; margin-top: 1rem;">
                <h4 style="color: #DC2626; margin: 0 0 0.5rem 0;">❌ Yang Sebaiknya Dihindari</h4>
                <ul style="margin: 0; padding-left: 1.25rem;">
                    ${rules.donts.map(d => `<li>${d}</li>`).join('')}
                </ul>
            </div>
        `;

        // Warning
        html += `
            <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 1rem; border-radius: 0.75rem; margin-top: 1rem;">
                <h4 style="color: #B45309; margin: 0 0 0.5rem 0;">⚠️ Perhatian</h4>
                <p style="margin: 0; font-size: 0.9rem;">${rules.warning}</p>
            </div>
        `;

        return html;
    };

    return {
        getSkinCareRules,
        renderRecommendations
    };
})();
