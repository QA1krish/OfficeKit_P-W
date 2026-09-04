#!/usr/bin/env pwsh
# Readable test runner for officekithr.net login suite.
# Usage:
#   .\run-tests.ps1                    -> headed browser, 3000ms pause per step
#   .\run-tests.ps1 -SleepMs 5000      -> headed browser, 5000ms pause per step
#   .\run-tests.ps1 -SleepMs 2000 -Project chromium -Grep "@login @smoke"
param(
  [int]$SleepMs = 3000,
  [string]$Project = "headed",
  [string]$Grep = ""
)

$env:SLEEP_TIME = "$SleepMs"
$mode = if ($Project -eq "headed") { "HEADED - visible window (slowMo 500ms)" } else { "headless" }

Write-Host ""
Write-Host "=================================================================="
Write-Host "  officekithr.net - Login Test Execution (readable flow report)"
Write-Host "=================================================================="
Write-Host ""
Write-Host "  Base URL   : https://betatesting.officekithr.net/login"
Write-Host "  Browser    : Chromium ($mode)"
Write-Host "  Project    : $Project"
Write-Host "  Sleep/step : $SleepMs ms  (each navigate/fill/click pauses so you can watch)"
Write-Host "  Grep       : $(if ($Grep) { $Grep } else { '(all @login tests)' })"
Write-Host ""
Write-Host "------------------------------------------------------------------"
Write-Host "  FLOWS THAT WILL RUN"
Write-Host "------------------------------------------------------------------"
Write-Host "  Flow 1: Login Page UI            [@login @smoke]"
Write-Host "    -> controls, placeholders, required fields, and password show/hide"
Write-Host "  Flow 2: Valid Credentials        [@login @positive]"
Write-Host "    -> Admin reaches HR dashboard; Employee reaches Employee dashboard"
Write-Host "  Flow 3: Negative Tests          [@login @negative]"
Write-Host "    -> wrong password/user/company each shows the exact server error"
Write-Host "  Flow 4: Required Validation     [@login @validation]"
Write-Host "    -> empty company/user/password/all-empty are blocked naturally"
Write-Host ""
Write-Host "------------------------------------------------------------------"
Write-Host "  TEST DATA"
Write-Host "------------------------------------------------------------------"
Write-Host "  Admin    : credentials loaded from environment variables"
Write-Host "  Employee : credentials loaded from environment variables"
Write-Host ""
Write-Host "------------------------------------------------------------------"
Write-Host "  STARTING EXECUTION - watch the browser window"
Write-Host "------------------------------------------------------------------"
Write-Host ""

Set-Location (Split-Path -Parent $MyInvocation.MyCommand.Path)
if ($Grep) {
  npx playwright test --project=$Project --reporter=list --grep="$Grep"
} else {
  npx playwright test --project=$Project --reporter=list
}

Write-Host ""
Write-Host "=================================================================="
Write-Host "  DONE - all listed flows above have finished. See results above."
Write-Host "=================================================================="
