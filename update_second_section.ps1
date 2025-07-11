$content = Get-Content -Path 'c:\src\BaitulJannahIslamicSchool\views\partials\body.ejs'
$newContent = @()

$oldSection = @"
                            <h3>Learn anything from anywhere anytime</h3>
                            <p>In today's fast-paced, digital world, the ability to learn anything, from anywhere, and at any time is more accessible than ever. Whether you are looking to expand your knowledge, gain new skills.</p>
                            <ul class="list-unstyled heading-color mb-4">
                                <li class="d-flex mb-3">
                                    <i class="isax isax-tick-circle5 text-success fs-24 me-2"></i>Access to a World of Knowledge
                                </li>
                                <li class="d-flex mb-3">
                                    <i class="isax isax-tick-circle5 text-success fs-24 me-2"></i>Diverse Learning Formats
                                </li>
                                <li class="d-flex mb-3 aos-init">
                                    <i class="isax isax-tick-circle5 text-success fs-24 me-2"></i>Learn at Your Own Pace
                                </li>
                                <li class="d-flex mb-3 aos-init">
                                    <i class="isax isax-tick-circle5 text-success fs-24 me-2"></i>Affordable and Flexible Pricing
                                </li>
                                <li class="d-flex mb-3 aos-init">
                                    <i class="isax isax-tick-circle5 text-success fs-24 me-2"></i>The Most World Class Instructors
                                </li>
                            </ul>
"@

$newSection = @"
                            <h3>Fasilitas Modern & Lingkungan Islami</h3>
                            <p>Baitul Jannah Islamic School menyediakan fasilitas modern dalam lingkungan yang Islami untuk mendukung proses belajar mengajar yang optimal. Kami menciptakan suasana yang nyaman dan kondusif bagi perkembangan siswa.</p>
                            <ul class="list-unstyled heading-color mb-4">
                                <li class="d-flex mb-3">
                                    <i class="isax isax-tick-circle5 text-success fs-24 me-2"></i>Ruang Kelas Multimedia dan Perpustakaan Digital
                                </li>
                                <li class="d-flex mb-3">
                                    <i class="isax isax-tick-circle5 text-success fs-24 me-2"></i>Laboratorium Sains dan Komputer
                                </li>
                                <li class="d-flex mb-3 aos-init">
                                    <i class="isax isax-tick-circle5 text-success fs-24 me-2"></i>Masjid dan Ruang Ibadah yang Nyaman
                                </li>
                                <li class="d-flex mb-3 aos-init">
                                    <i class="isax isax-tick-circle5 text-success fs-24 me-2"></i>Area Olahraga dan Taman Bermain
                                </li>
                                <li class="d-flex mb-3 aos-init">
                                    <i class="isax isax-tick-circle5 text-success fs-24 me-2"></i>Kantin Sehat dengan Menu Halal
                                </li>
                            </ul>
"@

$fileContent = (Get-Content -Path 'c:\src\BaitulJannahIslamicSchool\views\partials\body.ejs' -Raw)
$updatedContent = $fileContent -replace [regex]::Escape($oldSection), $newSection
$updatedContent | Set-Content -Path 'c:\src\BaitulJannahIslamicSchool\views\partials\body.ejs'