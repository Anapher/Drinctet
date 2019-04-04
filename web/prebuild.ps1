$gitInfo = ((git log -1 --pretty=format:"%d at %ai") | Out-String) -replace "`n",""
$gitCommit = ((git log -1 --pretty=format:"%h") | Out-String) -replace "`n","";
"REACT_APP_GIT_INFO=$gitInfo`nREACT_APP_GIT_COMMIT=$gitCommit" | Set-Content -Path ".\.env.local" -NoNewline -Force

Write-Host "Update Git Info: $gitCommit";