# generate-certs.ps1
param(
    [string]$Domain = "foodcourtos.com"
)

$CertDir = "$PSScriptRoot\certs"
if (-not (Test-Path $CertDir)) {
    New-Item -ItemType Directory -Path $CertDir | Out-Null
    Write-Host "Created certs directory: $CertDir"
}

Write-Host "Generating self-signed SSL certificate for $Domain..."

# Check if openssl is available in PATH
$openssl = Get-Command openssl -ErrorAction SilentlyContinue
$opensslPath = ""

if ($openssl) {
    $opensslPath = "openssl"
} else {
    # Check standard Git installations for OpenSSL
    $GitOpenSSL = "C:\Program Files\Git\usr\bin\openssl.exe"
    $GitOpenSSL86 = "C:\Program Files (x86)\Git\usr\bin\openssl.exe"
    
    if (Test-Path $GitOpenSSL) {
        $opensslPath = $GitOpenSSL
    } elseif (Test-Path $GitOpenSSL86) {
        $opensslPath = $GitOpenSSL86
    }
}

if ($opensslPath -ne "") {
    Write-Host "Using OpenSSL at: $opensslPath"
    & $opensslPath req -x509 -nodes -days 365 -newkey rsa:2048 `
        -keyout "$CertDir\foodcourtos.key" `
        -out "$CertDir\foodcourtos.crt" `
        -subj "/CN=$Domain/O=FoodCourtOS/OU=Development" `
        -addext "subjectAltName=DNS:$Domain,DNS:localhost,IP:127.0.0.1"
    
    Write-Host "SSL Certificates generated successfully in: $CertDir"
    Write-Host "  - CRT: foodcourtos.crt"
    Write-Host "  - KEY: foodcourtos.key"
} else {
    Write-Warning "OpenSSL command not found in your PATH or Git installation."
    Write-Host "Please generate self-signed PEM files manually and save them to:"
    Write-Host "  $CertDir\foodcourtos.crt"
    Write-Host "  $CertDir\foodcourtos.key"
}
