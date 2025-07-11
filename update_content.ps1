$content = Get-Content -Path 'c:\src\BaitulJannahIslamicSchool\views\partials\body.ejs' -Raw
$pattern = '<p>Baitul Jannah Islamic School memiliki program pengembangan karakter yang komprehensif untuk membentuk siswa berakhlak mulia dan berprestasi. Kami menanamkan nilai-nilai Islam dalam setiap aspek pendidikan.\'s competitive job market, a professional certification</p>'
$replacement = '<p>Baitul Jannah Islamic School memiliki program pengembangan karakter yang komprehensif untuk membentuk siswa berakhlak mulia dan berprestasi. Kami menanamkan nilai-nilai Islam dalam setiap aspek pendidikan.</p>'
$content = $content -replace [regex]::Escape($pattern), $replacement
$content | Set-Content -Path 'c:\src\BaitulJannahIslamicSchool\views\partials\body.ejs'