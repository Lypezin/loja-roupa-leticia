$excludeDirs = @("node_modules", ".next", ".git", ".venv", "__pycache__", "out", "build")
$fileTypes = @("*.tsx", "*.ts", "*.css", "*.js", "*.jsx")

$results = Get-ChildItem -Recurse -File -Include $fileTypes | Where-Object { 
    $fullName = $_.FullName
    $skip = $false
    foreach ($dir in $excludeDirs) {
        if ($fullName -like "*\$dir\*") {
            $skip = $true
            break
        }
    }
    -not $skip
} | ForEach-Object {
    $lineCount = (Get-Content -LiteralPath $_.FullName).Count
    [PSCustomObject]@{
        File = $_.FullName.Replace("C:\Users\Luiz\Desktop\loja-roupa-leticia\", "")
        Lines = $lineCount
    }
} | Where-Object { $_.Lines -gt 100 } | Sort-Object Lines -Descending

$results | Export-Csv -Path "audit_results.csv" -NoTypeInformation
