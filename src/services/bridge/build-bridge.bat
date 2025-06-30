@echo off

echo Building CardEncoder Bridge...

REM Kill any running CardEncoderBridge.exe
for /f "tokens=2 delims==;" %%I in ('tasklist /FI "IMAGENAME eq CardEncoderBridge.exe" /NH /FO CSV ^| findstr /I "CardEncoderBridge.exe"') do taskkill /F /PID %%~I >nul 2>&1

REM Delete old executables before building
if exist CardEncoderBridge.exe del /F /Q CardEncoderBridge.exe
if exist CardEncoderBridge\bin\Release\net9.0\win-x64\CardEncoderBridge.exe del /F /Q CardEncoderBridge\bin\Release\net9.0\win-x64\CardEncoderBridge.exe

REM Check if .NET is available
dotnet --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: .NET SDK not found. Please install .NET SDK.
    exit /b 1
)

REM Create a simple .NET project and compile
echo Creating .NET project...
dotnet new console -n CardEncoderBridge --force
cd CardEncoderBridge

REM Copy our existing CardEncoderBridge.cs file instead of recreating it
copy ..\CardEncoderBridge.cs Program.cs

REM Build the project
dotnet publish -c Release -r win-x64 --self-contained false -o ..

REM Clean up
cd ..
rmdir /s /q CardEncoderBridge

echo Build complete! CardEncoderBridge.exe created in bridge folder. 