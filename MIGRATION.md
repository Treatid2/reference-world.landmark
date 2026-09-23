# FGPM pre-public cutover

The accepted predecessor is `reference-world.landmark@0.1.0`, root `sha256:d299bbbfd64fe2e4ea5e613cea4cea3885b8e1e04cd9ec9ea998ce3e67641dc5`. It is preserved unchanged.

The successor coordinate is `61d3e4c8-26dd-4d93-aa9b-2118f61031ba/reference-world.landmark@0.1.0`. FGPM `0.11.0-rc.1`, source commit `7100a9e546ed879de261d061af7f6248bc26220c`, performed the finite copy-only migration. Owner completion changed active content-schema, handler, documentation, metadata, and test labels from the pre-public `fpm` family to `fgpm`, without altering geometry, colors, instances, contribution IDs, replacement IDs, dependency ranges, or version.

The retained version is deliberate. The predecessor was pre-public; this successor is the initial public coordinate. FGPM Stage A uses the same rule for behavior-preserving package cutovers. Content roots distinguish immutable objects.

Historical occurrences allowed in this file and structured evidence are limited to the old filename `fpm-package.json`, old format `fpm.package/1`, and statements describing the finite pre-public `fpm` migration boundary. Normal discovery has no legacy entrypoint and rejects the predecessor tree.

The package remains unselected. Full composition assembly awaits the coherent FGRW owner-successor set and is not a package-local activation claim.
