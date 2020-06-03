
(function ($) {
    "use strict";


    /*==================================================================
    [ Focus input ]*/
    $('.input100').each(function () {
        $(this).on('blur', function () {
            if ($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        });
    })


    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit', function (e) {
        e.preventDefault();
        var check = true;
        for (var i = 0; i < input.length; i++) {
            if (validate(input[i])?.status == false) {
                showValidate(input[i], validate(input[i]).data_validate);
                check = false;
            }
            else $(input[i]).val($(input[i]).val().trim());
        }
        if (check) {
            let data = {};
            for (var i = 0; i < input.length; i++) {
                if ($(input[i]).attr('name') !== 'confirmpassword') {
                    Object.defineProperty(data, $(input[i]).attr('name'), {
                        value: $(input[i]).val(),
                        writable: true,
                        enumerable: true
                    })
                }
            }
            const request = $.ajax({
                method: 'post',
                url: $(this).attr('action'),
                data: JSON.stringify(data),
                contentType: 'application/json; charset=UTF-8'
            });
            request.done(res => {
                if (res.success === true) {
                    window.location.href = res.url;
                }
                else $('.error-message').text(res.error);
            });
            request.fail((jqXHR, textStatus) => {
                showValidate($('input[name="email"]'), jqXHR.responseText)
            })
        }

    });


    $('.validate-form .input100').each(function () {
        $(this).focus(function () {
            hideValidate(this);
        });
    });

    function validate(input) {
        if ($(input).val() == '') {
            let data = dataValidate($(input).attr('name'));
            return {
                status: false,
                data_validate: data
            }
        } else {
            if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
                if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                    return {
                        status: false,
                        data_validate: 'Email is not valid'
                    }
                }
            }
            else if (($(input).attr('name') == 'confirmpassword' && $(input).val() != $("input[name='password']").val())) {
                return {
                    status: false,
                    data_validate: 'Enter Confirm Password Same as Password'
                }
            }
        }
    }

    function showValidate(input, data) {
        var thisAlert = $(input).parent();
        $(thisAlert).attr('data-validate', data);
        $(thisAlert).addClass('alert-validate');

    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }

    function dataValidate(name) {
        switch (name) {
            case 'password':
                return 'Enter Password';
            case 'confirmpassword':
                return 'Enter Confirm Password'
            case 'fullname':
                return 'Enter Full Name';
            case 'birthday':
                return 'Enter Birthday';
            case 'email':
                return 'Enter Email';
            default:
                return '';
        }
    }


    (function ($) {
        'use strict';
        try {
            $('.js-datepicker').daterangepicker({
                "singleDatePicker": true,
                "showDropdowns": true,
                "autoUpdateInput": false,
                locale: {
                    format: 'YYYY-MM-DD'
                },
            });
            var myCalendar = $('.js-datepicker');
            var isClick = 0;
            $(window).on('click', function () {
                isClick = 0;
            });
            $(myCalendar).on('apply.daterangepicker', function (ev, picker) {
                isClick = 0;
                $(this).val(picker.startDate.format('YYYY-MM-DD'));
            });
            $('.js-btn-calendar').on('click', function (e) {
                e.stopPropagation();
                if (isClick === 1) isClick = 0;
                else if (isClick === 0) isClick = 1;
                if (isClick === 1) {
                    myCalendar.focus();
                }
            });
            $(myCalendar).on('click', function (e) {
                e.stopPropagation();
                isClick = 1;
            });
            $('.daterangepicker').on('click', function (e) {
                e.stopPropagation();
            });
        } catch (er) {
            console.log(er);
        }
        try {
            var selectSimple = $('.js-select-simple');
            selectSimple.each(function () {
                var that = $(this);
                var selectBox = that.find('select');
                var selectDropdown = that.find('.select-dropdown');
                selectBox.select2({
                    dropdownParent: selectDropdown
                });
            });
        } catch (err) {
            console.log(err);
        }
    })(jQuery);

})(jQuery);

