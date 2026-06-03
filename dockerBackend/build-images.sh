#!/usr/bin/env bash
# Build the per-language dev-container template images.
# The tag names here are what you must use as the template "image" value in the
# app (admin/dev -> Add Template). createContainer() runs `Image: <that value>`.
set -euo pipefail
cd "$(dirname "$0")"

build() {
  local tag="$1" dir="$2"
  echo ">> Building $tag from $dir"
  docker build -t "$tag" "$dir"
}

build terminus-node   ./Node
build terminus-python ./Python
build terminus-gcc    ./GCC
build terminus-ubuntu ./Ubutnu

echo
echo "Done. Images:"
docker images --filter=reference='terminus-*' --format '  {{.Repository}}:{{.Tag}}  ({{.Size}})'
