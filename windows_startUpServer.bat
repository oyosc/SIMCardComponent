@echo off
echo simCardComponent
for /f "tokens=5" %%i in ("netstat -ano  findstr 3013") do taskkill /f /pid %%i
::��������
@supervisor simCardComponent.js > log.txt
pause