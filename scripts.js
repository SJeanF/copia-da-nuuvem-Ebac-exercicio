let subtotal = 0 
let logado = true
$(document).ready(function() {
    
    startTimer(sortearNumero(0, 1), sortearNumero(0, 24), sortearNumero(0, 60), sortearNumero(0, 60))

    layoutGridChanger()
    $(window).on('resize', function() {
        layoutGridChanger()
    })

    $('#modal-form').submit(function(e) {
        e.preventDefault()
        logado = entrar()
    })

    $('.toggle-password-view').on('click', function() {
        passwordViewToggler(this)
    })

    $('.carrinho-container').on('show.bs.collapse hidden.bs.collapse', function(e) {
        sumirComBotaoCarrinho(e)
    })

    $('.adicionar-carrinho').on('click', function () {
        if (logado) {
            if ($(this).hasClass('gift')) {
                transpoteDeImagen($(this))
            } else {
                adicionarAoCarrinho($(this))
            }
            
        } else {
            $('#login').click()
        }
    })

    $('.produtos').on('click', '.remover', function () {
        removerDoCarrinho($(this))
    })

    $('.gift-option-button').on('click', function() {
        mudarCorBotaoGift(this)
    })

    $('#modal-gift').on('show.bs.collapse', function() {
        transpoteDeImagen()
    })

    $('.gift-form').submit(function(e) {
        e.preventDefault()
        adicionarAoCarrinho($(this), true)
        resetaFormGift()
    })
})

function sortearNumero(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startTimer(dias, horas, minutos, segundos) {
    // Converte tudo para segundos
    let totalSeconds = dias * 86400 + horas * 3600 + minutos * 60 + segundos;

    // Função para atualizar o contador
    const interval = setInterval(() => {
        // Calcula dias, horas, minutos e segundos restantes
        let remainingDias = Math.floor(totalSeconds / 86400);
        let remainingHoras = Math.floor((totalSeconds % 86400) / 3600);
        let remainingMinutos = Math.floor((totalSeconds % 3600) / 60);
        let remainingSegundos = totalSeconds % 60;

        // Decrementa o total de segundos
        totalSeconds--;
        
        const dias = $('.dias')
        const horas = $('.horas')
        const minutos = $('.minutos')
        const segundos = $('.segundos')

        dias.text(String(remainingDias))
        horas.text(String(remainingHoras))
        minutos.text(String(remainingMinutos))
        segundos.text(String(remainingSegundos))

        // Se o tempo acabar, para o timer
        if (totalSeconds < 0) {
        clearInterval(interval);
        }
    }, 1000); // Executa a cada 1000 ms (1 segundo)
    }


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

    return true
}

function sumirComBotaoCarrinho (evento) {
    const display = evento.type === 'show' ? 'none' : 'block'
    $('#carrinho-btn').css('display', display)
}

function adicionarAoCarrinho (btnItemAdd, gift=false) {
    const item = btnItemAdd.parent().parent().parent()
    

    const imagem = item.find('img').attr('src')
    const precoItemString = gift ? $('.gift-option-button.gift-active-button span').text() : item.find('.dinheiros span').text()
    console.log(precoItemString)
    const moldeNovoItem = $(`<li class="produto"><img src="${imagem}" alt=""><h6>R$ <span>${precoItemString}</span></h6><button class="remover"><i class="fas fa-trash"></i></button></li>`)
    
    moldeNovoItem.appendTo($('.produtos'))
    atualizaSubTotal(parseFloat(precoItemString.replace(',', '.')))
}

function removerDoCarrinho (btnItemRemov) {
    const produto = btnItemRemov.parent()
    const precoItemString = produto.find('h6 span').text()

    produto.remove()
    atualizaSubTotal(-parseFloat(precoItemString.replace(',', '.')))
}

function atualizaSubTotal (valor) {
    subtotal += valor

    $('#sub-total span').text(subtotal.toFixed(2).replace('.', ','))
}

function transpoteDeImagen(qual) {
    const imgSrc = qual.parent().parent().parent().parent().find('img').attr('src')
    const imgGift = $(`<img src="${imgSrc}" class="d-none">`)
    imgGift.appendTo($('.modal-content.gift'))
}

function mudarCorBotaoGift(qual) {
    const atual = $(qual)
    $('.gift-active-button').removeClass('gift-active-button')
    atual.addClass('gift-active-button')

    let precisaInput = $('#valor-gift').parent().hasClass('gift-active-button') ? true : false

    if (precisaInput)  {
        buttonToInput(true)
    } else {
        buttonToInput(false)
        let valorGiftString = parseFloat($('#valor-gift').val()).toFixed(2).replace('.', ',')
        //TEM QUE MELHORAS ESSE NEGOCIO DE SELECIONAR, TA BUGANDO SE SELECIOANR O BOTAO DE POR VALOR PERSONALIZADO E DEPOIS SELECIOANR OUTRO
        console.log(valorGiftString)
        $('#outro').html(`R$ <span>${valorGiftString}</span>`)
    }
}

function buttonToInput (precisaInput) {
    const qmAbre = precisaInput ? $('#valor-gift') : $('#outro')
    const qmFecha = precisaInput ? $('#outro') : $('#valor-gift')

    qmFecha.css('display', 'none')
    qmAbre.css('display', 'block')
    qmAbre.focus()
}

function resetaFormGift() {
    $('#valor-gift').val('')
    $('#valor-gift').css('display', 'none')
    $('#outro').css('display', 'block')
    $('.gift-active-button').removeClass('gift-active-button')
    $('.primeiro').addClass('gift-active-button')
}
