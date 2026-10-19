# Episode 1.3 — selected illustrations

The five illustrations follow the exact identities, captions and credits in the
user-selected English / 19 October 2026 V2 articles. No image was generated,
retouched or newly cropped for the website. All article images are served locally,
with proportional WebP variants and no enlargement; originals remain intact.

## Four Metropolitan Museum illustrations

Downloaded on 19 October 2026 directly from the image URLs embedded in the selected
articles. Their object records identify them as public domain; the selected text
cites the museum's [Open Access / CC0 policy](https://www.metmuseum.org/policies/image-resources).

| Original | Dimensions | Object and credit | SHA-256 |
| --- | --- | --- | --- |
| `nebamun-receiving-wine-met.jpg` | 848 × 1200 | [Nebamun Receiving Wine, 30.4.106](https://www.metmuseum.org/art/collection/search/548520). Nina de Garis Davies, 1916. Rogers Fund, 1930. | `2e8e93ed59b47b3a069b15bdbc3d8e78370cc4855f4261d2e54314c0f92c79bc` |
| `meketre-bakery-brewery-met.jpg` | 958 × 1200 | [Model Bakery and Brewery, 20.3.12](https://www.metmuseum.org/art/collection/search/544258). Rogers Fund and Edward S. Harkness Gift, 1920. | `937e133cb57750e47da8dc8dfa1aaa8fb847a600c960e76adffe4f90a638dea0` |
| `women-at-banquet-met.jpg` | 1200 × 873 | [Women at a Banquet, 30.4.78](https://www.metmuseum.org/art/collection/search/557623). Nina de Garis Davies, 1925. Rogers Fund, 1930. | `2023d0963e6436462bd8b4d7494e750d075af45d5df87e90f61d7aba80ff6db5` |
| `sakhmet-met.jpg` | 900 × 1200 | [Statue of the Goddess Sakhmet, 15.8.2](https://www.metmuseum.org/art/collection/search/544484). Gift of Henry Walters, 1915. | `aae916717ed03ae666b7ec48c403622c9e2a456bab2edad542e9d0e0e4019c74` |

The captions retain the distinctions between ancient paintings and modern
facsimiles, and between the Rekhmire scene and the Deir el-Medina gathering.
Original download URLs and dimensions are pinned in
[`history-episode13-config.js`](../../../../scripts/history-episode13-config.js).

## Historical drawings after Wilkinson

`wilkinson-vomiting-banquet-drawings.png`, 1400 × 1410, copied unchanged from
Atrium's `Ep 1.3/assets/` selection. SHA-256:
`8bc2f59d27deefdde03da95b23140cbb8435da257ab5dbebee65977ad34deae3`.

Two drawings after John Gardner Wilkinson, *Manners and Customs of the Ancient
Egyptians*, vol. II (1837), woodcuts 146–147, reproduced by H. F. Lutz in
*Viticulture and Brewing in the Ancient Orient* (1922), p. 99, figures 22–23.
[Original 1837 edition and public-domain record](https://commons.wikimedia.org/wiki/File:Manners_and_customs_of_the_Ancient_Egyptians_vol.2_(IA_in.gov.ignca.34709).pdf)
and [source scan, printed p. 99 / PDF p. 113](https://upload.wikimedia.org/wikipedia/commons/7/78/Viticulture_and_brewing_in_the_ancient_Orient_%28IA_cu31924032345864%29.pdf#page=113).

Rights are based on the underlying 1837 Wilkinson woodcuts, not a blanket claim
about all of Lutz's later text. The selected crop contains only those drawings;
it is not a Met CC0 file or a verified depiction of the Amenemhat scene discussed
in the article. The exact qualification and separate credit remain in every
localized caption. No additional crop or retouching was performed here.

## Rebuild responsive variants

`npm run science:episode13:images -- <installed-sharp-module-path>` validates all
original hashes and dimensions before writing derivatives. Sharp is an optional
local authoring tool, not a new website/build dependency. This command makes no
network calls. Widths are 480, up to 960 and up to 1440 pixels, capped at each
original's width; all variants use WebP quality 84 without cropping. The importer
requires the credited originals and every expected variant before writing pages.
