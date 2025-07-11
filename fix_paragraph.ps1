$content = Get-Content -Path 'c:\src\BaitulJannahIslamicSchool\views\partials\body.ejs'
$newContent = @()
foreach ($line in $content) {
    if ($line -match "Baitul Jannah Islamic School memiliki program pengembangan karakter yang komprehensif untuk membentuk siswa berakhlak mulia dan berprestasi. Kami menanamkan nilai-nilai Islam dalam setiap aspek pendidikan.'s competitive job market, a professional certification") {
        $newLine = $line -replace "Baitul Jannah Islamic School memiliki program pengembangan karakter yang komprehensif untuk membentuk siswa berakhlak mulia dan berprestasi. Kami menanamkan nilai-nilai Islam dalam setiap aspek pendidikan.'s competitive job market, a professional certification", "Baitul Jannah Islamic School memiliki program pengembangan karakter yang komprehensif untuk membentuk siswa berakhlak mulia dan berprestasi. Kami menanamkan nilai-nilai Islam dalam setiap aspek pendidikan."
        $newContent += $newLine
    } else {
        $newContent += $line
    }
}
$newContent | Set-Content -Path 'c:\src\BaitulJannahIslamicSchool\views\partials\body.ejs'