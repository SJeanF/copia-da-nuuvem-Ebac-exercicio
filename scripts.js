let subtotal = 0 
let logado = false
$(document).ready(function() {
    
    startTimer(sortearNumero(0, 1), sortearNumero(0, 24), sortearNumero(0, 60), sortearNumero(0, 60))

    layoutGridChanger()
    clickAccordions()
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

    $('#modal-gift').on('show.bs.modal', function () {
        $('.gift-option-button').on('click', function() {
            mudarCorBotaoGift(this)
            buttonToInput(false)
            tranfereValInputButton()
        })

        $('.personalizado').on('click', function () {
            buttonToInput(true)
        })

    }) 
    
    $('.gift-form').submit(function(e) {
        e.preventDefault()
        adicionarAoCarrinho($(this))
    })

    $('#modal-gift').on('hidden.bs.modal', function () {
        setTimeout(() => {
            resetaFormGift()
        }, 200);
    })

    $('.produtos').on('click', '.remover', function () {
        removerDoCarrinho($(this))
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

function clickAccordions() {
    $('.accordion-button').click()
    setTimeout(() => {
        $('.accordion-button').click()
    }, 400);
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

function adicionarAoCarrinho (btnItemAdd) {
    const item = btnItemAdd.parent().parent().parent()

    const imagem = item.find('img').attr('src')
    const precoItemString = pegarPreco(item)
    const moldeNovoItem = $(`<li class="produto"><img src="${imagem}" alt=""><h6>R$ <span>${precoItemString}</span></h6><button class="remover"><i class="fas fa-trash"></i></button></li>`)
    moldeNovoItem.appendTo($('.produtos'))
    console.log(precoItemString)
    atualizaSubTotal(parseFloat(precoItemString.replace(',', '.')))
}

function pegarPreco (item) {
    if (item.hasClass('modal-dialog')) {
        if ($('.gift-active-button').hasClass('personalizado')) {
            return parseFloat(item.find('.opcoes .gift-active-button #valor-gift').val().replace(',', '.')).toFixed(2)
        } else {
            
            return item.find('.opcoes .gift-active-button span').text()
        }
    }
    return item.find('.dinheiros span').text()
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
}

function buttonToInput (precisaInput) {
    const qmAbre = precisaInput ? $('#valor-gift') : $('#outro')
    const qmFecha = precisaInput ? $('#outro') : $('#valor-gift')

    qmFecha.css('display', 'none')
    qmAbre.css('display', 'block')
    qmAbre.focus()
}

function tranfereValInputButton() {
    const valorDinheirosString = parseFloat($('#valor-gift').val())
    if (valorDinheirosString) {
        const novoValorElement = $(`<p id="outro" class="no-margin">R$ <span>${valorDinheirosString.toFixed(2).replace('.', ',')}</span></p>`)
        $('#outro').remove()
        novoValorElement.appendTo($('.personalizado'))
    } else {
        $('#outro').html('Outro')
        $('#valor-gift').val('')
    }
}

function resetaFormGift() {
    $('#valor-gift').val('')
    $('#valor-gift').css('display', 'none')
    $('#outro').css('display', 'block')
    $('.gift-active-button').removeClass('gift-active-button')
    $('.primeiro').addClass('gift-active-button')
    $('.modal-content.gift img').remove()
    buttonToInput(false)
}
