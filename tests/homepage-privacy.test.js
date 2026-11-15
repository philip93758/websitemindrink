import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const languages = {
    en: ['Your drinking records stay on your device.', 'limited usage data using a random ID, not your name', 'separate crash reports', 'turn usage analytics off in Settings'],
    fr: ['restent sur votre appareil', 'identifiant aléatoire, et non à votre nom', 'rapports sur les arrêts inattendus de l’application', 'désactiver l’analyse des données d’utilisation'],
    de: ['Trinkprotokolle bleiben auf deinem Gerät', 'zufällige ID statt über deinen Namen', 'davon getrennte Absturzberichte', 'Nutzungsanalyse in den Einstellungen deaktivieren'],
    es: ['se guardan en tu dispositivo', 'identificador aleatorio, no a tu nombre', 'informes de fallos recopilados por separado', 'desactivar el análisis de uso en Ajustes'],
    pt: ['ficam no seu dispositivo', 'ID aleatório, não ao seu nome', 'relatórios de falhas coletados separadamente', 'desativar a análise de uso nos Ajustes'],
    id: ['tetap tersimpan di perangkatmu', 'ID acak, bukan namamu', 'aplikasi berhenti secara mendadak', 'secara terpisah dari data penggunaan', 'menonaktifkan analitik penggunaan di Pengaturan'],
    it: ['restano sul tuo dispositivo', 'ID casuale, non al tuo nome', 'separatamente segnalazioni di arresti anomali', 'disattivare l’analisi dei dati di utilizzo'],
    ja: ['飲酒記録はお使いの端末内に保存', 'お名前ではなくランダムなID', 'それとは別にクラッシュレポート', '利用状況の分析は設定でオフ'],
};

for (const [language, statements] of Object.entries(languages)) {
    test(`${language}: homepage privacy answer explains local records and analytics`, () => {
        const path = language === 'en' ? '../index.html' : `../${language}/index.html`;
        const html = readFileSync(new URL(path, import.meta.url), 'utf8');
        const questions = html.match(/<dl class="home-questions">([\s\S]*?)<\/dl>/)?.[1];
        assert.ok(questions);
        const answers = [...questions.matchAll(/<dd>([\s\S]*?)<\/dd>/g)].map(match => match[1]);
        assert.equal(answers.length, 4);
        for (const statement of statements) assert.ok(answers[3].includes(statement), `${language}: missing ${statement}`);
        const privacyPath = language === 'en' ? '/privacy.html' : `/${language}/privacy.html`;
        assert.ok(answers[3].includes(`href="${privacyPath}"`));
    });
}
