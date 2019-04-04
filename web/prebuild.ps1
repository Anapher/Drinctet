$gitInfo = (git log -1 --pretty=format:"%h%d at %ai") | Out-String;

"REACT_APP_GIT_INFO=$gitInfo" | Set-Content -Path ".\.env.local" -NoNewline -Force
Write-Host "Update Git Info: $gitInfo";