import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');

test('English policy accurately distinguishes app records, analytics and technical reports', () => {
    const html = read('privacy.html');
    for (const text of [
        'drink records, dry days, reflections, and goals',
        'These events do not include the drink type, amount, alcohol strength, drinking records',
        'Usage events can show when a drink entry is added or a dry day is marked',
        'an app-generated identifier that can persist between sessions',
        'On Android, an App Set ID may also be sent if available',
        'On Android, the analytics SDK may also report country from your mobile network',
        'On iOS, analytics may also include recordings of screen interactions; standard text and input fields are masked',
        'The replay can still show screen layouts and interactions',
        "Sentry's default collection of personal information is disabled",
        'They are collected separately and are not disabled by the app analytics switch',
        'Sentry may also receive technical timing information about app startup and navigation',
        'Performance data is retained according to Sentry’s retention settings',
        'Disabling analytics stops tracking new events; it does not delete data already sent',
        'App analytics uses a randomly generated identifier',
        'Technical reports are collected separately and are not linked to your name or email',
        'Because analytics and technical reports are not linked to your name or email, we cannot identify which reports are yours or delete them when you contact us',
    ]) assert.ok(html.includes(text), `Missing policy disclosure: ${text}`);
    assert.doesNotMatch(html, /not tied to an account or persistent visitor identifier/);
});

test('English privacy summary distinguishes local deletion from reports already sent', () => {
    const html = read('about.html');
    for (const text of [
        'Usage analytics are on by default and can be turned off in Data Management',
        'Analytics events do not include drink details or personal reflections',
        'standard text and input fields masked',
        'Technical error reports are collected separately and are not disabled by this setting',
        'Analytics and technical reports already sent are handled as described in the Privacy Policy',
    ]) assert.ok(html.includes(text), `Missing privacy summary: ${text}`);
    assert.doesNotMatch(html, /always anonymous, never personal|Uninstalling the app also erases all your data/);
});

test('French policy explains random identifiers and deletion limits', () => {
    const html = read('fr/privacy.html');
    for (const text of [
        'identifiant généré aléatoirement',
        'les rapports techniques ne sont pas associés à votre nom ni à votre adresse e-mail',
        'nous ne pouvons pas déterminer quelles données d’analyse ou quels rapports techniques vous concernent',
        'La collecte par défaut d’informations personnelles par Sentry est désactivée',
        'les champs TextInput sont masqués',
    ]) assert.ok(html.includes(text), `Missing French disclosure: ${text}`);
    assert.doesNotMatch(html, /aucun compte ni identifiant persistant/);
});

test('German policy explains random identifiers and deletion limits', () => {
    const html = read('de/privacy.html');
    for (const text of [
        'zufällig erzeugte Kennung',
        'über mehrere Sitzungen hinweg bestehen bleiben kann',
        'Analysedaten und technische Berichte nicht mit deinem Namen oder deiner E-Mail-Adresse verknüpft',
        'weder feststellen, welche Analysedaten oder technischen Berichte zu dir gehören',
        'standardmäßige Erfassung personenbezogener Daten durch Sentry ist deaktiviert',
        'Standard-Textkomponenten und Eingabefelder werden dabei unkenntlich gemacht',
    ]) assert.ok(html.includes(text), `Missing German disclosure: ${text}`);
    assert.doesNotMatch(html, /weder Getränkeart, Menge oder Alkoholstärke noch/);
});

test('Spanish policy explains random identifiers and deletion limits', () => {
    const html = read('es/privacy.html');
    for (const text of [
        'identificador generado aleatoriamente',
        'los datos de análisis y los informes técnicos no están vinculados a tu nombre ni a tu correo electrónico',
        'no podemos identificar cuáles son tuyos ni eliminarlos cuando te pones en contacto con nosotros',
        'La recopilación predeterminada de información personal de Sentry está desactivada',
        'los componentes estándar que muestran texto y los campos de entrada se enmascaran',
    ]) assert.ok(html.includes(text), `Missing Spanish disclosure: ${text}`);
    assert.doesNotMatch(html, /ninguna cuenta ni identificador persistente/);
});

test('Portuguese policy explains random identifiers and deletion limits', () => {
    const html = read('pt/privacy.html');
    for (const text of [
        'identificador gerado aleatoriamente',
        'os dados de análise e os relatórios técnicos não são vinculados ao seu nome ou e-mail',
        'não conseguimos identificar quais dados de análise ou relatórios técnicos são seus',
        'A coleta padrão de informações pessoais pela Sentry está desativada',
        'os textos exibidos pelos componentes padrão e os campos de entrada são mascarados',
        'a classe do dispositivo, o fabricante e o modelo',
        'informações técnicas sobre os tempos de inicialização e de navegação no aplicativo',
    ]) assert.ok(html.includes(text), `Missing Portuguese disclosure: ${text}`);
});

test('Indonesian policy explains random identifiers and deletion limits', () => {
    const html = read('id/privacy.html');
    for (const text of [
        'pengenal yang dibuat secara acak',
        'data analitik dan laporan teknis tidak ditautkan ke nama atau email kamu',
        'kami tidak dapat mengidentifikasi data atau laporan mana yang merupakan milik kamu maupun menghapusnya',
        'Pengumpulan informasi pribadi oleh Sentry dinonaktifkan secara default',
        'komponen teks standar dan kolom input disamarkan',
        'jejak tumpukan',
    ]) assert.ok(html.includes(text), `Missing Indonesian disclosure: ${text}`);
});

test('Italian policy explains random identifiers and deletion limits', () => {
    const html = read('it/privacy.html');
    for (const text of [
        'identificatore generato casualmente',
        'i dati di analisi e i rapporti tecnici non sono collegati al tuo nome o indirizzo email',
        'non possiamo identificare quali dati e rapporti ti appartengano né eliminarli',
        'La raccolta predefinita di informazioni personali da parte di Sentry è disabilitata',
        'i componenti di testo standard e i campi di immissione vengono mascherati',
    ]) assert.ok(html.includes(text), `Missing Italian disclosure: ${text}`);
});

test('Japanese policy explains random identifiers and deletion limits', () => {
    const html = read('ja/privacy.html');
    for (const text of [
        'ランダムに生成された識別子',
        '分析データと技術レポートはお客様の氏名やメールアドレスに関連付けられていないため',
        'どの分析データや技術レポートがお客様のものかを特定したり、それらを削除したりすることはできません',
        'Sentryによる個人情報のデフォルトの収集は無効になっています',
        '飲酒の記録を追加したこと',
        '端末の種類',
        '端末の地域設定から判定された国',
        'お客様が選択したガイドラインの適用区分',
        'React Native標準の文字表示機能で表示される文字と入力欄の内容は隠されます',
        '標準以外の表示機能で表示される文字は自動では隠れないことがあり',
    ]) assert.ok(html.includes(text), `Missing Japanese disclosure: ${text}`);
});
