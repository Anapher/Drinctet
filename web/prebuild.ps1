$gitInfo = (git log -1 --pretty=format:"%h%d at %ai") | Out-String;

$env = Get-Content ".\.env";
$env[1] = "REACT_APP_GIT_INFO=$gitInfo"

$env -join "`n" | Set-Content -Path ".\.env" -NoNewline -Force
Write-Host "Update Git Info: $gitInfo";