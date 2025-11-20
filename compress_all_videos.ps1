# Compress ALL videos in dericBI project
# This will reduce video size by ~70% while maintaining quality

Write-Host ""
Write-Host "🎬 dericBI Video Compression Tool" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Check if ffmpeg is installed
try {
    $null = Get-Command ffmpeg -ErrorAction Stop
    Write-Host "✅ FFmpeg found" -ForegroundColor Green
} catch {
    Write-Host "❌ FFmpeg not found! Installing..." -ForegroundColor Red
    Write-Host "   Please wait..." -ForegroundColor Yellow
    winget install ffmpeg
    Write-Host ""
    Write-Host "⚠️  Please close and reopen PowerShell, then run this script again." -ForegroundColor Yellow
    exit
}

Write-Host ""

# Create backup folder
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "video_backups_$timestamp"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
Write-Host "💾 Backup folder created: $backupDir" -ForegroundColor Yellow
Write-Host ""

# Find all videos
$videos = Get-ChildItem -Path "assets\projects" -Filter "*.mp4" -Recurse -File

if ($videos.Count -eq 0) {
    Write-Host "❌ No videos found!" -ForegroundColor Red
    exit
}

Write-Host "📊 Found $($videos.Count) videos to compress" -ForegroundColor Cyan
Write-Host ""

# Counters
$total = $videos.Count
$current = 0
$success = 0
$failed = 0
$totalOriginalMB = 0
$totalCompressedMB = 0

# Process each video
foreach ($video in $videos) {
    $current++
    $percent = [math]::Round(($current / $total) * 100)
    
    Write-Host "[$current/$total - $percent%] Processing: $($video.Name)" -ForegroundColor Cyan
    
    # Get original size
    $originalSizeMB = [math]::Round($video.Length / 1MB, 2)
    $totalOriginalMB += $originalSizeMB
    Write-Host "   Original: $originalSizeMB MB" -ForegroundColor Yellow
    
    # Backup original
    $backupPath = Join-Path $backupDir $video.Name
    Copy-Item $video.FullName $backupPath -Force
    
    # Temp output file
    $tempFile = Join-Path $video.DirectoryName "temp_compressed_$($video.Name)"
    
    # Compress video
    $ffmpegArgs = @(
        "-i", $video.FullName,
        "-c:v", "libx264",
        "-crf", "28",
        "-preset", "medium",
        "-c:a", "aac",
        "-b:a", "128k",
        "-movflags", "+faststart",
        "-y",
        "-loglevel", "error",
        "-stats",
        $tempFile
    )
    
    $process = Start-Process -FilePath "ffmpeg" -ArgumentList $ffmpegArgs -NoNewWindow -Wait -PassThru
    
    if ($process.ExitCode -eq 0 -and (Test-Path $tempFile)) {
        # Replace original with compressed
        Move-Item $tempFile $video.FullName -Force
        
        # Get new size
        $newVideo = Get-Item $video.FullName
        $newSizeMB = [math]::Round($newVideo.Length / 1MB, 2)
        $totalCompressedMB += $newSizeMB
        $savedMB = [math]::Round($originalSizeMB - $newSizeMB, 2)
        $percentReduction = [math]::Round((($originalSizeMB - $newSizeMB) / $originalSizeMB) * 100, 1)
        
        Write-Host "   ✅ Compressed: $newSizeMB MB (saved $savedMB MB, $percentReduction% reduction)" -ForegroundColor Green
        $success++
    } else {
        Write-Host "   ❌ FAILED - Original kept" -ForegroundColor Red
        if (Test-Path $tempFile) {
            Remove-Item $tempFile -Force
        }
        $totalCompressedMB += $originalSizeMB
        $failed++
    }
    
    Write-Host ""
}

# Final summary
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "✨ COMPRESSION COMPLETE!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 RESULTS:" -ForegroundColor Cyan
Write-Host "   Total videos processed: $total"
Write-Host "   ✅ Successfully compressed: $success" -ForegroundColor Green
Write-Host "   ❌ Failed: $failed" -ForegroundColor Red
Write-Host ""
Write-Host "💾 SPACE SAVED:" -ForegroundColor Magenta
Write-Host "   Before: $([math]::Round($totalOriginalMB, 2)) MB"
Write-Host "   After:  $([math]::Round($totalCompressedMB, 2)) MB"
Write-Host "   Saved:  $([math]::Round($totalOriginalMB - $totalCompressedMB, 2)) MB"
$overallReduction = [math]::Round((($totalOriginalMB - $totalCompressedMB) / $totalOriginalMB) * 100, 1)
Write-Host "   Reduction: $overallReduction%" -ForegroundColor Green
Write-Host ""
Write-Host "💾 Backups saved in: $backupDir" -ForegroundColor Yellow
Write-Host ""
Write-Host "🚀 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "   1. Test videos on your site (open my-projects.html)"
Write-Host "   2. If quality is good, deploy:"
Write-Host "      git add ."
Write-Host "      git commit -m 'Compress videos for performance'"
Write-Host "      git push"
Write-Host "   3. If all works, delete backup folder:"
Write-Host "      Remove-Item -Recurse $backupDir"
Write-Host ""
