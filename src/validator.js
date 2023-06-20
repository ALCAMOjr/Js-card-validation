document.addEventListener('DOMContentLoaded', function() {
  var form = document.querySelector('.form');
  var cardNumberInputs = Array.from(document.querySelectorAll('.input-cart-number'));
  var cardNumber = document.querySelector('.number');
  var cardHolder = document.querySelector('.card-holder div');
  var cardExpiration = document.querySelector('.card-expiration-date div');
  var cardCCV = document.querySelector('.ccv div');
  var cardLogoImg = document.querySelector('.card-logo-img');
  var btn = document.querySelector('.btn');

  $('.input-cart-number').on('keyup change', function(){
    $t = $(this);

    if ($t.val().length > 3) {
      $t.next().focus();
    }

    var card_number = '';
    $('.input-cart-number').each(function(){
      card_number += $(this).val() + ' ';
      if ($(this).val().length == 4) {
        $(this).next().focus();
      }
    });

    $('.credit-card-box .number').html(card_number);
  });

  $('#card-holder').on('keyup change', function(){
    $t = $(this);
    $('.credit-card-box .card-holder div').html($t.val());
  });

  $('#card-expiration-month, #card-expiration-year').change(function(){
    var m = $('#card-expiration-month option').index($('#card-expiration-month option:selected'));
    m = (m < 10) ? '0' + m : m;
    var y = $('#card-expiration-year').val().substr(2,2);
    $('.card-expiration-date div').html(m + '/' + y);
  });

  $('#card-ccv').on('focus', function(){
    $('.credit-card-box').addClass('hover');
  }).on('blur', function(){
    $('.credit-card-box').removeClass('hover');
  }).on('keyup change', function(){
    $('.ccv div').html($(this).val());
  });

  // Función para validar la tarjeta de crédito
  function validateCreditCard() {
    var cardNumberValue = cardNumberInputs.map(function(input) {
      return input.value;
    }).join('');

    // Validar si el campo está vacío
    if (cardNumberValue === '') {
      showAlert('Por favor, ingrese un número de tarjeta válido.');
      return;
    }

    if (cardNumberValue.trim() === '') {
      showAlert('Por favor, ingrese el número de tarjeta de crédito.');
      return;
    }

    // Validar la longitud del número de tarjeta de crédito
    if (cardNumberValue.replace(/ /g, '').length !== 16) {
      showAlert('El número de tarjeta de crédito debe tener 16 dígitos.');
      return;
    }

    // Validar el nombre del titular de la tarjeta
    var cardHolderValue = cardHolder.textContent.trim();
    if (cardHolderValue === '') {
      showAlert('Por favor, ingrese el nombre del titular de la tarjeta.');
      return;
    }

    // Validar la fecha de expiración de la tarjeta
    var cardExpirationValue = cardExpiration.textContent.trim();
    if (cardExpirationValue === '') {
      showAlert('Por favor, seleccione la fecha de vencimiento de la tarjeta.');
      return;
    }

    // Validar el código CCV
    var cardCCVValue = cardCCV.textContent.trim();
    if (cardCCVValue === '') {
      showAlert('Por favor, ingrese el código CCV de la tarjeta.');
      return;
    }

    // Validar si solo contiene dígitos numéricos
    if (!/^[0-9]+$/.test(cardNumberValue)) {
      showAlert('Ingrese solo caracteres numéricos.');
      return;
    }

    // Validar el tipo de tarjeta
    var cardType = getCardType(cardNumberValue);
    if (cardType === 'Desconocida') {
      showAlert('Tipo de tarjeta desconocido.');
      return;
    }

    // Validar utilizando el algoritmo de Luhn
    if (!isValidCreditCard(cardNumberValue)) {
      showAlert('El número de tarjeta no es válido.');
      return;
    }

    // Ocultar todos los dígitos excepto los últimos 4
    var hiddenDigits = cardNumberValue.substring(0, cardNumberValue.length - 4).replace(/./g, '*');
    var visibleDigits = cardNumberValue.substring(cardNumberValue.length - 4);
    cardNumber.textContent = hiddenDigits + visibleDigits;

    // Mostrar el logo correspondiente al tipo de tarjeta
    var logoPath;
    if (cardType === 'Visa') {
      logoPath = 'img/visa.png';
    } else if (cardType === 'Mastercard') {
      logoPath = 'img/mastercard.png';
    } else if (cardType === 'American Express') {
      logoPath = 'img/AmericanExpress.png';
    } else {
      logoPath = 'img/default.png'; // Si hay un tipo de tarjeta desconocido, puedes usar una imagen genérica o mostrar un mensaje alternativo
    }

    showAlert('La tarjeta de crédito es válida.', 'success', logoPath);
  }

  // Función para determinar el tipo de tarjeta
  function getCardType(cardNumber) {
    if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(cardNumber)) {
      return 'Visa';
    } else if (/^5[1-5][0-9]{14}$/.test(cardNumber)) {
      return 'Mastercard';
    } else if (/^3[47][0-9]{13}$/.test(cardNumber)) {
      return 'American Express';
    } else {
      return 'Desconocida';
    }
  }

  // Función para validar si es una tarjeta de crédito válida utilizando el algoritmo de Luhn
  function isValidCreditCard(cardNumber) {
    var sum = 0;
    var shouldDouble = false;
    for (var i = cardNumber.length - 1; i >= 0; i--) {
      var digit = parseInt(cardNumber.charAt(i));

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  }

  // Función para mostrar una alerta personalizada utilizando SweetAlert
  function showAlert(message, type = 'error', logoPath = '') {
    Swal.fire({
      title: type === 'success' ? 'Éxito' : 'Error',
      html: `${message} ${logoPath ? '<br><img src="' + logoPath + '" width="50px">' : ''}`,
      icon: type,
      confirmButtonText: 'Aceptar'
    });
  }

  // Agregar evento de clic al botón
  btn.addEventListener('click', function(event) {
    event.preventDefault();
    validateCreditCard();
  });
});
