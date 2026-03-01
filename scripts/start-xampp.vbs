Set objShell = CreateObject("WScript.Shell")

' Iniciar Apache en segundo plano
objShell.Run """C:\xampp\apache\bin\httpd.exe"" -k runservice", 0, False

' Iniciar MySQL en segundo plano
objShell.Run """C:\xampp\mysql\bin\mysqld.exe"" --defaults-file=""C:\xampp\mysql\bin\my.ini"" --standalone", 0, False