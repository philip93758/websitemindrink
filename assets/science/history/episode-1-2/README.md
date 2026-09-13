# Episode 1.2 image provenance

Approved selection: Atrium `docs/marketing/Content/History series/Ep 1.2/IMAGE_SELECTION.md`, 2026-09-12, with a French-only revision dated 2026-09-13. Seven original JPEGs are preserved byte-for-byte; each language edition uses five of them. English and the six other translations keep the original set. French replaces the Puabi seal and Hammurabi inscription close-up with the straw-drinking seal and the full Hammurabi stele. Checksums and original dimensions are recorded in `scripts/history-episode12-config.js` and verified by the importer. WebP files are proportional resized/compressed web versions, generated at quality 84 without cropping, retouching, added details or upscaling. They carry the same respective image licences/rights basis as the originals. No endorsement is implied.

Every language page preserves its approved translated alt text, caption and linked credit beneath each image. Do not replace them with a generic collective licence. Do not copy the French replacement images into the other seven editions.

| File stem | Credit / rights | Source and important qualification |
|---|---|---|
| `ur-ziggurat-lubinski` | Michael Lubinski; contrast adjusted by Tmtriumph. [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/). | [Commons original](https://commons.wikimedia.org/wiki/File:Ziggarut_of_Ur_-_M.Lubinski.jpg). Ur, around 2100 BC, partly reconstructed; not Umma. |
| `uruk-malt-barley-tablet-met` | The Metropolitan Museum of Art, 1988.433.3; Purchase, Raymond and Beverly Sackler Gift, 1988. Public domain, [CC0](https://creativecommons.org/publicdomain/zero/1.0/), [Met Open Access](https://www.metmuseum.org/hubs/open-access). | [Object record](https://www.metmuseum.org/art/collection/search/327385). Probably Uruk, about 3100–2900 BC. Not Agu’a’s later tablet from Umma. |
| `ur-houses-courtyard-1932` | Library of Congress, Prints & Photographs Division, Matson Collection, LC-DIG-matpc-16105. [No known restrictions on publication or distribution](https://wwws.loc.gov/rr/print/res/258_mats.html). | [Commons original](https://commons.wikimedia.org/wiki/File:Iraq._Ur._%28So_called_of_the_Chaldees%29._Well_preserved_court_yard_and_houses_LOC_matpc.16105.jpg), [LOC](https://hdl.loc.gov/loc.pnp/matpc.16105). 1932 is the photograph date. Keep the complete border. General domestic context, not identified as a brewery, tavern or Tall Bazi. |
| `puabi-inscribed-seal-mcphee` | Nic McPhee; cropped by Johnbod. [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/). | [Commons original](https://commons.wikimedia.org/wiki/File:Flickr_-_Nic%27s_events_-_British_Museum_with_Cory_and_Mary,_6_Sep_2007_-_185.jpg). Another seal from Puabi’s tomb, not the tube-drinking seal described in reference 8. Clay impression is modern. Maximum original width 816 px. |
| `hammurabi-inscription-rama` | Rama. [CC BY-SA 3.0 France](https://creativecommons.org/licenses/by-sa/3.0/fr/). | [Commons original](https://commons.wikimedia.org/wiki/File:Code_of_Hammurabi-Sb_8-IMG_7777.JPG). Eighteenth-century-BC stele, Louvre Sb 8. Visible lines are not identified as provisions 108–109. Used by English and the six non-French translations. |
| `met-324572-straw-seal` | The Metropolitan Museum of Art, 56.157.1; Rogers Fund, 1956. Public domain, [CC0](https://creativecommons.org/publicdomain/zero/1.0/), [Met Open Access](https://www.metmuseum.org/hubs/open-access). | [Object record](https://www.metmuseum.org/art/collection/search/324572). French edition only, in “Que contenait le récipient ?”. Early Dynastic III, about 2600–2350 BC. The Met titles the liquid as unspecified; the impression is modern; no excavation provenance. Not BM 121545 / Puabi’s drinking-tube seal. |
| `hammurabi-stele-mbzt` | Mbzt, 2011. [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/). | [Commons original](https://commons.wikimedia.org/wiki/File:P1050763_Louvre_code_Hammurabi_face_rwk.JPG). French edition only, in the tavern-laws position. Louvre Sb 8, eighteenth century BC. Portrait 1215×2000 with no EXIF orientation tag; some viewers rotate it incorrectly. Do not auto-rotate. |

## Regeneration

The image builder requires an authoring installation of Sharp (not a production dependency):

```sh
npm run science:episode12:images -- "../mindrink-atrium/docs/marketing/Content/History series/Ep 1.2" "/absolute/path/to/sharp"
```

Omit the final argument if `sharp` is locally resolvable. The builder checks all approved original hashes before writing, preserves those originals, and generates bounded responsive WebP variants. If Sharp is unavailable, generate the same bounded widths at quality 84 without cropping, retouching, EXIF auto-rotation or upscaling. A changed original requires editorial/rights review and an explicit checksum update first.
