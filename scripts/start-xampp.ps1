# Iniciar Apache como servicio
Start-Process -FilePath "C:\xampp\apache\bin\httpd.exe" -ArgumentList "-k runservice" -WindowStyle Hidden

# Iniciar MySQL como servicio
Start-Process -FilePath "C:\xampp\mysql\bin\mysqld.exe" -ArgumentList "--defaults-file=`"C:\xampp\mysql\bin\my.ini`" --standalone" -WindowStyle Hidden