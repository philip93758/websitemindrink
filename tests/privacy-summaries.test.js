import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const expectations = {
    en: ['Your drinking records stay local', 'Usage analytics are on by default', 'Analytics events do not include drink details', 'Technical error reports are collected separately', 'Analytics and technical reports already sent'],
    fr: ['Vos données de consommation restent sur votre appareil', 'Les analyses d’utilisation sont activées par défaut', 'Les événements d’analyse n’incluent ni le détail', 'Les rapports d’erreurs techniques sont collectés séparément', 'Les analyses et rapports techniques déjà envoyés'],
    de: ['Deine Trinkdaten bleiben auf deinem Gerät', 'Nutzungsanalysen sind standardmäßig aktiviert', 'Analyseereignisse enthalten weder Angaben zu deinen Getränken', 'Technische Fehlerberichte werden separat erfasst', 'Bereits gesendete Analyseberichte und technische Berichte'],
    es: ['Tus registros de consumo se quedan en tu dispositivo', 'El análisis de uso está activado de forma predeterminada', 'Los eventos de análisis no incluyen detalles sobre tus bebidas', 'Los informes de errores técnicos se recopilan por separado', 'Los datos de análisis y los informes técnicos que ya se hayan enviado'],
    pt: ['Seus registros de consumo ficam no seu dispositivo', 'As análises de uso vêm ativadas por padrão', 'Os eventos de análise não incluem detalhes sobre as bebidas', 'Os relatórios de erros técnicos são coletados separadamente', 'As análises e os relatórios técnicos já enviados'],
    id: ['Catatan minummu tetap lokal', 'Analitik penggunaan diaktifkan secara default', 'Peristiwa analitik tidak mencakup detail minuman', 'Laporan kesalahan teknis dikumpulkan secara terpisah', 'Analitik dan laporan teknis yang sudah dikirim'],
    it: ['I dati su ciò che bevi restano sul dispositivo', "Le analisi sull'utilizzo sono attive per impostazione predefinita", 'Gli eventi di analisi non includono dettagli su ciò che bevi', 'Le segnalazioni degli errori tecnici vengono raccolte separatamente', 'Le analisi e le segnalazioni tecniche già inviate'],
    ja: ['飲酒記録は端末内に保存されます', '利用状況の分析は初期設定で有効', '分析イベントには、飲み物の詳細や個人的な振り返りの内容は含まれません', 'iOSでは', '標準以外の表示機能で表示される文字は自動では隠れないことがあり', '技術的なエラーレポートは別途収集', 'すでに送信された分析データと技術的なレポート'],
};

for (const [language, phrases] of Object.entries(expectations)) {
    test(`${language}: About privacy summary matches the policy`, () => {
        const path = language === 'en' ? '../about.html' : `../${language}/about.html`;
        const html = readFileSync(new URL(path, import.meta.url), 'utf8');
        const privacy = html.match(/<section class="philosophy" id="privacy">([\s\S]*?)<\/section>/)?.[1];
        assert.ok(privacy, `${language}: privacy section missing`);
        for (const phrase of phrases) assert.ok(privacy.includes(phrase), `${language}: missing ${phrase}`);
        const policyPath = language === 'en' ? '/privacy.html' : `/${language}/privacy.html`;
        assert.ok(privacy.includes(`href="${policyPath}"`));
    });
}
