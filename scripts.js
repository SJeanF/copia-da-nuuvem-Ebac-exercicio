$(document).ready(function() {
    
    
    layoutGridChanger()
    $(window).on('resize', function() {
        layoutGridChanger()
    })
})

function layoutGridChanger () {
    const larguraTela = $(window).width()
    if (larguraTela < 576) {
        $('.layout-grande').removeClass('grid');
        $('.item-grande').removeClass('carousel-item');
        $('.item-grande.active').removeClass('active');
        $('.item-pequeno').removeClass('sub-destaque-container-top')
        $('.item-pequeno').removeClass('sub-destaque-container-bottom')
        $('.item-pequeno').addClass('carousel-item');
        $('.item-pequeno.primeiro').addClass('active');
        $('.apagavel').removeClass('d-none')
    } else {
        $('.item-pequeno').removeClass('carousel-item');
        $('.item-grande').addClass('carousel-item');
        $('.layout-grande').addClass('grid');
        $('.item-grande.primeiro').addClass('active');
        $('.item-pequeno.primeiro').removeClass('active')
        $('.item-pequeno.top').addClass('sub-destaque-container-top')
        $('.item-pequeno.bottom').addClass('sub-destaque-container-bottom')
        $('.apagavel').addClass('d-none')
    }
}