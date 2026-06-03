# Build the per-language dev-container template images (Windows / PowerShell).
# Tag names here are what you must use as the template "image" value in the app.
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$images = @(
    @{ Tag = "terminus-node";   Dir = "./Node" },
    @{ Tag = "terminus-python"; Dir = "./Python" },
    @{ Tag = "terminus-gcc";    Dir = "./GCC" },
    @{ Tag = "terminus-ubuntu"; Dir = "./Ubutnu" }
)

foreach ($i in $images) {
    Write-Host ">> Building $($i.Tag) from $($i.Dir)"
    docker build -t $i.Tag $i.Dir
    if ($LASTEXITCODE -ne 0) { throw "Build failed for $($i.Tag)" }
}

Write-Host "`nDone. Images:"
docker images --filter=reference="terminus-*" --format "  {{.Repository}}:{{.Tag}}  ({{.Size}})"
