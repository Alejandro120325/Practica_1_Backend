$ErrorActionPreference = "Stop"

$possibleVersions = @("8.3", "8.2", "8.1", "8.0", "7.0", "6.0")
$mongodPath = $null

foreach ($version in $possibleVersions) {
    $path = "C:\Program Files\MongoDB\Server\$version\bin\mongod.exe"
    if (Test-Path $path) {
        $mongodPath = $path
        break
    }
}

if (-not $mongodPath) {
    Write-Host "No se encontró mongod.exe en C:\Program Files\MongoDB\Server" -ForegroundColor Red
    Write-Host "Instala MongoDB Community Server o revisa la ruta." -ForegroundColor Yellow
    exit 1
}

$dataRoot = "$env:USERPROFILE\mongodb-data"
$dbPath = "$dataRoot\db"
$logPath = "$dataRoot\mongod.log"

if (-not (Test-Path $dataRoot)) {
    New-Item -ItemType Directory -Path $dataRoot | Out-Null
}

if (-not (Test-Path $dbPath)) {
    New-Item -ItemType Directory -Path $dbPath | Out-Null
}

Write-Host "Iniciando MongoDB desde: $mongodPath" -ForegroundColor Green
Write-Host "Datos: $dbPath" -ForegroundColor Green
Write-Host "Log: $logPath" -ForegroundColor Green

& $mongodPath --dbpath $dbPath --logpath $logPath --logappend --bind_ip 127.0.0.1 --port 27017
