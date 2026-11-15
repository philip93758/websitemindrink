import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const languages = {
    en: ['Your drinking records stay on your device.', 'Analytics events do not include the drink type or amount you enter.', 'enabled by default', 'app-generated ID, not your name', 'On iOS, they may include recordings', 'text and input fields masked', 'turn analytics off', 'Technical error reports are collected separately', 'not disabled by that switch'],
    fr: ['restent sur votre appareil', 'événements d’analyse n’incluent ni le type de boisson ni la quantité', 'activées par défaut', 'identifiant généré par l’application, pas votre nom', 'Sur iOS', 'composants textuels standard et le contenu des champs de saisie sont masqués', 'désactiver les analyses', 'rapports d’erreurs techniques sont collectés séparément', 'ne sont pas désactivés par ce réglage'],
    de: ['Trinkdaten bleiben auf deinem Gerät', 'weder die von dir eingegebene Getränkeart noch die Menge', 'standardmäßig aktiviert', 'erzeugte Kennung, nicht deinen Namen', 'Unter iOS', 'Standard-Textkomponenten angezeigt wird, sowie die Inhalte von Eingabefeldern maskiert sind', 'Analysen in den Einstellungen deaktivieren', 'Fehlerberichte werden separat erfasst', 'durch diese Einstellung nicht deaktiviert'],
    es: ['permanecen en tu dispositivo', 'no incluyen el tipo ni la cantidad de bebida', 'activado de forma predeterminada', 'identificador generado por la aplicación, no tu nombre', 'En iOS', 'componentes estándar y los campos de entrada', 'desactivar el análisis', 'errores técnicos se recopilan por separado', 'ese ajuste no los desactiva'],
    pt: ['registros de consumo ficam no seu dispositivo', 'não incluem o tipo nem a quantidade de bebida', 'ativadas por padrão', 'identificador gerado pelo app, não seu nome', 'No iOS', 'textos exibidos pelos componentes padrão e os campos de entrada são mascarados', 'desativar as análises', 'erros técnicos são coletados separadamente', 'não são desativados por essa opção'],
    id: ['tetap berada di perangkatmu', 'tidak mencakup jenis atau jumlah minuman', 'diaktifkan secara default', 'ID yang dibuat oleh aplikasi, bukan namamu', 'Di iOS', 'komponen teks standar dan kolom input disamarkan', 'menonaktifkan analitik', 'kesalahan teknis dikumpulkan secara terpisah', 'tidak dinonaktifkan oleh pengaturan tersebut'],
    it: ['restano sul tuo dispositivo', 'non includono il tipo o la quantità di bevanda', 'attive per impostazione predefinita', "identificativo generato dall'app, non il tuo nome", 'Su iOS', 'componenti di testo standard e il contenuto dei campi di inserimento sono mascherati', 'disattivare le analisi', 'errori tecnici vengono raccolte separatamente', 'non vengono disattivate da questa opzione'],
    ja: ['飲酒記録はお使いの端末に保存', '入力した飲み物の種類や量は含まれません', '利用状況の分析は初期設定で有効', '名前ではなくアプリが生成した識別子', 'iOSでは', 'React Native標準の文字表示機能', '標準以外の表示機能で表示される文字は自動では隠れないことがあり', '分析は設定で無効', 'エラーレポートは別途収集', 'エラーレポートの収集は止まりません'],
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
        const privacyPath = language === 'en' ? '/about.html#privacy' : `/${language}/about.html#privacy`;
        assert.ok(answers[3].includes(`href="${privacyPath}"`));
    });
}
