@echo off
chcp 65001 >nul
echo.
echo  ╔══════════════════════════════════════════════╗
echo  ║     تطبيق حِلْيَة — Live Reload Dev Server    ║
echo  ╚══════════════════════════════════════════════╝
echo.
echo  جاري تشغيل الخادم...
echo  (يُرجى الانتظار قليلاً)
echo.
python dev_server.py
