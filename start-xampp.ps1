$xamppPath = "C:\xampp"

# Inicia Apache y MySQL
& "$xamppPath\apache_start.bat"
& "$xamppPath\mysql_start.bat"

# Verificar si MySQL está corriendo
Start-Sleep -Seconds 5
$mysqlRunning = Get-Process | Where-Object {$_.ProcessName -like "mysqld"}

if ($mysqlRunning) {
    Write-Host "✅ XAMPP Apache y MySQL iniciados correctamente"
} else {
    Write-Host "❌ MySQL no se inició correctamente. Revisa la configuración."
}