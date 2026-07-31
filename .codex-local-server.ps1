param(
  [int] $Port = 5173
)

$root = (Get-Location).Path
$port = $Port
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $port)
$listener.Start()

$types = @{
  ".html" = "text/html; charset=utf-8"
  ".css" = "text/css; charset=utf-8"
  ".js" = "application/javascript; charset=utf-8"
  ".png" = "image/png"
  ".jpg" = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".webp" = "image/webp"
  ".svg" = "image/svg+xml"
  ".ico" = "image/x-icon"
  ".xml" = "application/xml; charset=utf-8"
  ".txt" = "text/plain; charset=utf-8"
}

while ($true) {
  $client = $listener.AcceptTcpClient()
  try {
    $stream = $client.GetStream()
    $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::ASCII, $false, 1024, $true)
    $requestLine = $reader.ReadLine()

    while ($reader.Peek() -gt -1) {
      $line = $reader.ReadLine()
      if ([string]::IsNullOrEmpty($line)) { break }
    }

    if ([string]::IsNullOrWhiteSpace($requestLine)) {
      $client.Close()
      continue
    }

    $parts = $requestLine.Split(" ")
    $urlPath = [Uri]::UnescapeDataString($parts[1].Split("?")[0].TrimStart("/"))
    if ([string]::IsNullOrWhiteSpace($urlPath)) { $urlPath = "index.html" }

    $filePath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($root, $urlPath))
    $status = "200 OK"
    $body = $null
    $contentType = "application/octet-stream"

    if (-not $filePath.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
      $status = "403 Forbidden"
      $body = [System.Text.Encoding]::UTF8.GetBytes("Forbidden")
      $contentType = "text/plain; charset=utf-8"
    } elseif (-not [System.IO.File]::Exists($filePath)) {
      $status = "404 Not Found"
      $body = [System.Text.Encoding]::UTF8.GetBytes("Not found")
      $contentType = "text/plain; charset=utf-8"
    } else {
      $body = [System.IO.File]::ReadAllBytes($filePath)
      $ext = [System.IO.Path]::GetExtension($filePath).ToLowerInvariant()
      if ($types.ContainsKey($ext)) { $contentType = $types[$ext] }
    }

    $header = "HTTP/1.1 $status`r`nContent-Type: $contentType`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
    $stream.Write($headerBytes, 0, $headerBytes.Length)
    $stream.Write($body, 0, $body.Length)
  } finally {
    $client.Close()
  }
}
