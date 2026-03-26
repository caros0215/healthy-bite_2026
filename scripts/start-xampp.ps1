$xamppPath = "C:\xampp"

Write-Host "🚀 Iniciando Apache y MySQL..."

# Apache
Start-Process -FilePath "$xamppPath\apache\bin\httpd.exe"

# MySQL (forma correcta)
Start-Process -FilePath "$xamppPath\mysql_start.bat"

# Esperar hasta que MySQL responda en el puerto 3307
Write-Host "⏳ Esperando que MySQL esté listo..."
$maxintentos = 20
$intento = 0
$listo = $false

while ($intento -lt $maxintentos -and -not $listo) {
  Start-Sleep -Seconds 2
  $intento++
  try {
    $tcp = New-Object System.Net.Sockets.TcpClient
    $tcp.Connect("127.0.0.1", 3307)
    $tcp.Close()
    $listo = $true
    Write-Host "✅ MySQL listo en el intento $intento"
  } catch {
    Write-Host "⏳ Intento $intento/$maxintentos - MySQL aún no responde..."
  }
}

if (-not $listo) {
  Write-Host "❌ MySQL no arrancó después de $maxintentos intentos"
  exit 1
}