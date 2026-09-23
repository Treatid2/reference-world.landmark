# reference-world.landmark 0.1.0

Coordinate: `61d3e4c8-26dd-4d93-aa9b-2118f61031ba/reference-world.landmark`  
Format: `fgpm.package/1`  
Licence: `CC0-1.0`

This independently maintained package supplies the Reference World demonstration worldspace and a three-part beacon. It remains unselected from the maintained 32-package composition. The package-local entrypoint is `fgpm-package.json`; `maintenance.json` records equivalent structured maintenance and exact dependency/provider evidence.

## Preserved behavior

The world places the existing field and block character at `[0, 0, 0]` and the beacon at `[4, 0, 2]`, using the fixed demo camera. The beacon retains base, shaft, and light parts with translations `[0, 0.5, 0]`, `[0, 1.5, 0]`, and `[0, 2.7, 0]`. All parts use the beacon appearance hook. Gold `[255, 192, 48]` remains the default; blue `[45, 105, 220]` remains an alternative.

## Contributions

| ID | Manifest type | File |
| --- | --- | --- |
| pkg:reference-world.landmark/world/demo | fgpm.demo.worldspace/1 | world.json |
| pkg:reference-world.landmark/assembly/beacon | fgpm.demo.visual-assembly/1 | beacon.json |
| pkg:reference-world.landmark/texture/beacon-gold | fgpm.demo.solid-colour/1 | beacon-gold.json |
| pkg:reference-world.landmark/texture/beacon-blue | fgpm.demo.solid-colour/1 | beacon-blue.json |

## Replacement alternatives

| Target | With |
| --- | --- |
| pkg:reference-world.landmark/appearance/beacon | pkg:reference-world.landmark/texture/beacon-gold |
| pkg:reference-world.landmark/appearance/beacon | pkg:reference-world.landmark/texture/beacon-blue |
| pkg:demo.character/appearance/head/base-colour | pkg:reference-world.landmark/texture/beacon-gold |

The two beacon replacements are alternatives; this package makes no selection. The character-head target is external. No replacement precedence or activation is implied.

## Dependencies and handlers

| Package | Range |
| --- | --- |
| demo.worldspace | ^0.1.0 |
| demo.primitives | ^0.1.0 |
| demo.texture-vocabulary | ^0.3.0 |

| Required capability | Range |
| --- | --- |
| fgpm.handler.scene | ^1.0.0 |
| fgpm.handler.texture | ^1.0.0 |

`maintenance.json` records the exact Stage A namespace/version/root evidence for direct dependencies, world references, and known handler providers. Provider selection remains external.

## Validate and test

```text
fgpm.cmd validate-package <package-directory>
fgpm.cmd package identity <package-directory> --json
node tests/check.mjs [package-directory]
```

The focused test parses every JSON file, checks descriptor/file/export correspondence, contribution and replacement relationships, geometry and color preservation, documentation/metadata agreement, active-label completion, ownership, licence bytes, and the unselected status. Its negative cases are in memory. It executes no package code and mutates no store or workspace.

Public validation reports `provisional-v1`. This is truthful: `fgpm.package/2` cannot represent the retained `requires`, `contributions`, and `replacements`. The finite pre-public migrator therefore produced `fgpm.package/1`, preserving their meaning. Version remains `0.1.0`, the initial public version for this pre-public lineage; immutable roots map old and new bytes.

See `MIGRATION.md` for the public cutover and historical-label allowlist, `PROVENANCE.md` for source lineage, `OWNER.json` for sanitized ownership, and `LICENSE.txt` for the complete CC0-1.0 legal code.

No gameplay feature, composition selection, workspace plan, generation, activation, deployment, publication, acceptance, or cycle closure is performed by this package candidate.
