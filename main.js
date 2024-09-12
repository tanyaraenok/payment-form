import {
    el,
    setChildren,
    mount
} from 'redom';

// const Inputmask = require('inputmask');
import Inputmask from 'inputmask';
import {
    isValid,
    isExpirationDateValid,
    isSecurityCodeValid,
    getCreditCardNameByNumber
} from 'creditcard.js';

import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

(() => {
    //create DOM
    const container = el('.container');

    function createPaymentFormsContainer() {
        const paymentDataContainer = el('.payment-details-container');
        const paymentFormRight = el('form.payment-form payment-form_right');
        const paymentFormLabelCardNumber = el('label.payment-form__label_card-number', 'Card number');
        mount(paymentFormLabelCardNumber, el('input.payment-form__input_card-number#payment-form__input_card-number', { maxlength: '24', placeholder: '0000 0000 0000 0000' }));

        const paymentFormLabelCardholderFullname = el('label.payment-form__label_card-holder', 'Cardholder fullname');
        mount(paymentFormLabelCardholderFullname, el('input.payment-form__input_card-holder#payment-form__input_card-holder'));

        const paymentFormDivСonsolidation = el('.payment-form__div-exdate-email');

        const paymentFormLabelExpirationDate = el('label.payment-form__label_expiration-date', 'Expiration date');
        mount(paymentFormLabelExpirationDate, el('input.payment-form__input_expiration-date#payment-form__input_expiration-date', { placeholder: 'MM/YY', maxlength: '5' }));

        const paymentFormLabelEmail = el('label.payment-form__label_email', 'Email');
        mount(paymentFormLabelEmail, el('input.payment-form__input_email#payment-form__input_email', { type: 'email' }));

        setChildren(paymentFormDivСonsolidation, [paymentFormLabelExpirationDate, paymentFormLabelEmail]);
        setChildren(paymentFormRight, [paymentFormLabelCardNumber, paymentFormLabelCardholderFullname, paymentFormDivСonsolidation]);

        const paymentFormLeft = el('form.payment-form payment-form_left');
        const paymentFormLabelSecurityCode = el('label.payment-form__label_security-code', 'Security code');
        mount(paymentFormLabelSecurityCode, el('input.payment-form__input_security-code#payment-form__input_security-code', { placeholder: 'CVC/CVV', maxlength: '3' }));

        setChildren(paymentFormLeft, [el('.payment-form__left-div'), paymentFormLabelSecurityCode, el('.payment-form__card-type-div#payment-form__card-type-div')]);
        setChildren(paymentDataContainer, [paymentFormRight, paymentFormLeft]);

        return paymentDataContainer;
    }

    function createSavePaymentMethodCheckbox() {
        const savePaymentMethodLabel = el('label.save-payment-method-label');
        setChildren(savePaymentMethodLabel, [el('input.save-payment-method-input', { type: 'checkbox' }), el('span.save-payment-method-span', 'Save your card for future payments')]);

        return savePaymentMethodLabel;
    }

    function createConfirmPaymentButton() {
        return el('button.confirm-payment-button#confirm-payment-button', 'Pay', { disabled: 'true' });
    }

    setChildren(container, [createPaymentFormsContainer(), createSavePaymentMethodCheckbox(), createConfirmPaymentButton()]);
    setChildren(document.body, container);

    const cardNumberInput = document.getElementById('payment-form__input_card-number');
    const expirationDateInput = document.getElementById('payment-form__input_expiration-date');
    const emailInput = document.getElementById('payment-form__input_email');
    const securityCodeInput = document.getElementById('payment-form__input_security-code');
    const fullnameInput = document.getElementById('payment-form__input_card-holder');
    const confirmPaymentButton = document.getElementById('confirm-payment-button');
    const cardTypeDiv = document.getElementById('payment-form__card-type-div');

    const cardTypesMap = new Map([
        ['Visa', 'visa'],
        ['Mastercard', 'mastercard'],
        ['American Express', 'american-express'],
        ['Diners Club', 'diners-club'],
        ['Discover', 'discover'],
        ['JCB', 'jcb'],
        ['UnionPay', 'unionPay'],
        ['Maestro', 'maestro'],
        ['Forbrugsforeningen', 'forbrugsforeningen'],
        ['Dankort', 'dankort'],
        ['Troy', 'troy'],
        ['Elo', 'elo'],
        ['Mir', 'mir'],
        ['UATP', 'uatp'],
    ]);

    //Masks

    function maskForTextInputs(input) {
        input.addEventListener('input', (event) => {
            event.target.value = event.target.value.replaceAll(/ {2,}/g, ' ');
            event.target.value = event.target.value.replaceAll(/@{2,}/g, '@');
        });

        input.addEventListener('paste', (event) => {
            event.target.value = event.target.value.replaceAll(/ {2,}/g, ' ');
            event.target.value = event.target.value.replaceAll(/@{2,}/g, '@');
        });

        input.addEventListener('change', (event) => {
            event.target.value = event.target.value.trim();
        });
    }
    [fullnameInput, emailInput].forEach(input => maskForTextInputs(input));

    Inputmask('9999 9999 9999 9999', { showMaskOnHover: false }).mask(cardNumberInput);
    Inputmask({ regex: "[a-zA-Z- '`~./-]*", casing: "upper" }).mask(fullnameInput);
    Inputmask('99/99', { showMaskOnHover: false }).mask(expirationDateInput);
    Inputmask('999', { showMaskOnHover: false }).mask(securityCodeInput);

    //Validation
    const cardNumberTip = tippy(cardNumberInput, {
        content: 'Indicate correct bank card number',
        animation: 'scale',
        duration: [1000, 100],
        trigger: 'manual',
        hideOnClick: false,
        theme: 'custom',
        placement: 'left-start',
    });

    const fullnameTip = tippy(fullnameInput, {
        content: 'Please, indicate your fullname',
        animation: 'scale',
        duration: [1000, 100],
        trigger: 'manual',
        hideOnClick: false,
        theme: 'custom',
        placement: 'left-start',
    });

    const expirationDateTip = tippy(expirationDateInput, {
        content: 'Indicate correct card expiry date',
        animation: 'scale',
        duration: [1000, 100],
        trigger: 'manual',
        hideOnClick: false,
        theme: 'custom',
        placement: 'left-start',
    });

    const emailTip = tippy(emailInput, {
        content: 'Please, indicate correct email',
        animation: 'scale',
        duration: [1000, 100],
        trigger: 'manual',
        hideOnClick: false,
        theme: 'custom',
        placement: 'right-start',
    });

    const securityCodeTip = tippy(securityCodeInput, {
        content: 'Please, indicate security code',
        animation: 'scale',
        duration: [1000, 100],
        trigger: 'manual',
        hideOnClick: false,
        theme: 'custom',
        placement: 'right-start',
    });

    function isTextInputsValid(textInput) {
        return Boolean(textInput.value.replaceAll(' ', ''));
    }

    function isEmailValid(string) {
        const validEmailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return Boolean(string.toLowerCase().match(validEmailRegex));
    }

    cardNumberInput.addEventListener('blur', () => {
        if (!isValid(cardNumberInput.value.replaceAll(' ', ''))) {
            cardNumberTip.show();
        }
        const cardTypeClass = cardTypesMap.get(getCreditCardNameByNumber(cardNumberInput.value.replaceAll(' ', '')));
        cardTypeDiv.classList.add(cardTypeClass);
    });
    cardNumberInput.addEventListener('input', () => {
        cardNumberTip.hide();
        cardTypeDiv.classList.remove(...[...cardTypeDiv.classList].filter(n => n !== 'payment-form__card-type-div'));
    });

    fullnameInput.addEventListener('blur', () => {
        if (!isTextInputsValid(fullnameInput)) {
            fullnameTip.show();
        }
    });
    fullnameInput.addEventListener('input', () => {
        fullnameTip.hide();
    });

    expirationDateInput.addEventListener('blur', () => {
        if (!isExpirationDateValid(expirationDateInput.value.replaceAll('/', '').substring(0, 2), '20' + expirationDateInput.value.replaceAll('/', '').substring(2, 4))
        ) {
            expirationDateTip.show();
        }
    });
    expirationDateInput.addEventListener('input', () => {
        expirationDateTip.hide();
    });

    emailInput.addEventListener('blur', () => {
        if (!isTextInputsValid(emailInput) || !isEmailValid(emailInput.value)) {
            emailTip.show();
        }
    });

    emailInput.addEventListener('input', () => {
        if (!isNaN(emailInput.value[0])) {
            emailInput.value = '';
        }
        if (emailInput.value[0] === '@') {
            emailInput.value = '';
        }
        emailTip.hide();
    });

    securityCodeInput.addEventListener('blur', () => {
        if (!isSecurityCodeValid(cardNumberInput.value.replaceAll(' ', ''), securityCodeInput.value)) {
            securityCodeTip.show();
        } 
    });
    securityCodeInput.addEventListener('input', () => {
        securityCodeTip.hide();
    });

    function validation() {
        return isValid(cardNumberInput.value.replaceAll(' ', ''))
            && isTextInputsValid(fullnameInput)
            && isExpirationDateValid(expirationDateInput.value.replaceAll('/', '').substring(0, 2), '20' + expirationDateInput.value.replaceAll('/', '').substring(2, 4))
            && isTextInputsValid(emailInput)
            && isEmailValid(emailInput.value)
            && isSecurityCodeValid(cardNumberInput.value.replaceAll(' ', ''), securityCodeInput.value);
    }

    [cardNumberInput, fullnameInput, expirationDateInput, emailInput, securityCodeInput].forEach(input => {
        input.addEventListener('blur', () => {
            confirmPaymentButton.toggleAttribute('disabled', !validation());
            if (isValid(cardNumberInput.value.replaceAll(' ', ''))) {
                cardNumberTip.hide();
            }
            if (isTextInputsValid(fullnameInput)) {
                fullnameTip.hide();
            } 
            if (isExpirationDateValid(expirationDateInput.value.replaceAll('/', '').substring(0, 2), '20' + expirationDateInput.value.replaceAll('/', '').substring(2, 4))) {
                expirationDateTip.hide();
            }
            if (isSecurityCodeValid(cardNumberInput.value.replaceAll(' ', ''), securityCodeInput.value)) {
                securityCodeTip.hide();
            } 
            if (isTextInputsValid(emailInput) && isEmailValid(emailInput.value)) {
                emailTip.hide();
            }
        })
    })

})();