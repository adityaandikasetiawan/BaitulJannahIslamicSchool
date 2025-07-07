(function($) {
    "use strict";
    
    // Mobile Menu Toggle
    $('.menu-toggle').on('click', function() {
        $('body').toggleClass('menu-opened');
    });
    
    // Dropdown Toggle
    $('.main-nav li.has-submenu > a').on('click', function(e) {
        e.preventDefault();
        $(this).parent().toggleClass('active');
        $(this).next('.submenu').slideToggle();
    });
    
    // Sticky Header
    $(window).on('scroll', function() {
        if ($(window).scrollTop() > 100) {
            $('.header').addClass('sticky');
        } else {
            $('.header').removeClass('sticky');
        }
    });
    
    // Sticky Sidebar
    if ($('.theiaStickySidebar').length > 0) {
        $('.theiaStickySidebar').theiaStickySidebar({
            additionalMarginTop: 80
        });
    }
    
    // Datepicker
    if ($('.datepicker').length > 0) {
        $('.datepicker').datepicker({
            format: 'dd-mm-yyyy',
            autoclose: true,
            todayHighlight: true
        });
    }
    
    // Daterangepicker
    if ($('.daterange').length > 0) {
        $('.daterange').daterangepicker({
            opens: 'left',
            locale: {
                format: 'DD-MM-YYYY'
            }
        });
    }
    
    // Select2
    if ($('.select2').length > 0) {
        $('.select2').select2({
            width: '100%'
        });
    }
    
    // Owl Carousel
    if ($('.owl-carousel').length > 0) {
        $('.owl-carousel').owlCarousel({
            loop: true,
            margin: 30,
            nav: true,
            dots: false,
            navText: [
                '<i class="fas fa-chevron-left"></i>',
                '<i class="fas fa-chevron-right"></i>'
            ],
            responsive: {
                0: {
                    items: 1
                },
                768: {
                    items: 2
                },
                992: {
                    items: 3
                }
            }
        });
    }
    
    // Slick Slider
    if ($('.slick-slider').length > 0) {
        $('.slick-slider').slick({
            dots: false,
            arrows: true,
            infinite: true,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 1,
            responsive: [
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1
                    }
                }
            ]
        });
    }
    
    // ApexChart - Earnings by Year
    if ($('#earningsChart').length > 0) {
        var options = {
            series: [{
                name: 'Earnings',
                data: [31, 40, 28, 51, 42, 82, 56]
            }],
            chart: {
                height: 350,
                type: 'area',
                toolbar: {
                    show: false
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth'
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
            },
            colors: ['#7B68EE']
        };
        
        var chart = new ApexCharts(document.querySelector('#earningsChart'), options);
        chart.render();
    }
    
    // File Upload
    $('.custom-file-input').on('change', function() {
        var fileName = $(this).val().split('\\').pop();
        $(this).next('.custom-file-label').addClass('selected').html(fileName);
    });
    
    // Form Validation
    if ($('.needs-validation').length > 0) {
        window.addEventListener('load', function() {
            var forms = document.getElementsByClassName('needs-validation');
            var validation = Array.prototype.filter.call(forms, function(form) {
                form.addEventListener('submit', function(event) {
                    if (form.checkValidity() === false) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    form.classList.add('was-validated');
                }, false);
            });
        }, false);
    }
    
    // Tooltip
    $('[data-toggle="tooltip"]').tooltip();
    
    // Popover
    $('[data-toggle="popover"]').popover();
    
    // Feather Icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
})(jQuery);