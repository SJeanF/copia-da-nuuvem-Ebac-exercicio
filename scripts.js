$(document).ready(function() {
    
    
    layoutGridChanger()
    $(window).on('resize', function() {
        layoutGridChanger()
    })

    $('#modal-form').submit(function(e) {
        e.preventDefault()
        entrar()
    })

    $('.toggle-password-view').on('click', function() {
        passwordViewToggler(this)
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

function passwordViewToggler(onde) {
    const elemento = $(onde)
    const input = elemento.parent().find('input')
    const tipo = input.attr('type') === 'password' ? 'text' : 'password'
    
    if (elemento.hasClass('fa-eye')) {
    elemento.removeClass('fa-eye')
    elemento.addClass('fa-eye-slash')
    input.attr('type', tipo)
    } else {
    elemento.removeClass('fa-eye-slash')
    elemento.addClass('fa-eye')
    input.attr('type', tipo)
    }
}

function entrar () {
    let usuariotext = $('#usuario').val()

    usuariotext = usuariotext.length > 6 ? usuariotext.substring(0, 6) + '...' : usuariotext

    let modalElement = document.querySelector('.modal')
    let modal = bootstrap.Modal.getInstance(modalElement)
    modal.hide()

    $('#login').css('display', 'none')
    const perfil = $('.perfil')
    perfil.css('display', 'flex')
    perfil.find('p').text(usuariotext)
}