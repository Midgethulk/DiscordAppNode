$(document).ready(function () {
    $('#errorBox').hide();
    $('#messageBox').hide();


    //Load data in form when clicking on edit button
    $('form').on("submit", function () {
        event.preventDefault();
        if ($(this).hasClass(".formsItem")) {
            clearAlerts();

            //Get pressed button value
            var $btn = $(document.activeElement);
            var btnValue = "";
            if (
                /* there is an activeElement at all */
            $btn.length &&

                /* it's a child of the form */
            $(this).has($btn) &&

                /* it's really a submit element */
            $btn.is('button[type="submit"], input[type="submit"], input[type="image"]') &&

                /* it has a "name" attribute */
            $btn.is('[name]')
            ) {
                /* access $btn.attr("name") and $btn.val() for data */
                btnValue = $btn.val();
                //console.log(btnValue)

            }
            if (btnValue === "edit") {
                var formData = $(this).serializeArray();
                var idRule = formData[0].value

                $.ajax({
                    url: '/rule/byid/' + idRule,

                    success: function (data) {
                        //console.log(data);
                        clearAlerts();
                        if (data.error) {
                            updateAlerts(data);
                        }
                        else {
                            $('#idRule').val(data.rule._id);
                            $('#command').val(data.rule.command);
                            var reply = data.rule.reply;
                            if (reply) {
                                $('#replyRadios1').prop('checked', 'checked');
                            }
                            else {
                                $('#replyRadios2').prop('checked', 'checked');
                            }
                            $('#response').val(data.rule.response);

                        }
                    }
                });
            }
            if (btnValue === "delete") {
                var formData = $(this).serializeArray();
                var idRule = formData[0].value

                $.confirm({
                    text: "Are you sure you want to delete this rule?",
                    confirm: function () {
                        $.ajax({
                            url: '/rule/delete/' + idRule,

                            success: function (data) {
                                //console.log(data);
                                clearAlerts();
                                updateAlerts(data);
                            }
                        });
                    },
                    cancel: function () {
                        // nothing to do
                    }
                });
            }
        }
    });

    //Edit Rule
    $('#btnEdit').on("click", function () {
        //console.log("hello");
        clearAlerts();
        $.ajax({
            type: "POST",
            url: "/rule/edit",
            data: $("#formEdit").serialize(),
            success: function (data) {
                updateAlerts(data);
            }
        });
    });

    //Add Rule
    $('#btnAdd').on("click", function () {
        clearAlerts();
        console.log("hello");
        $.ajax({
            type: "POST",
            url: "/rule/add",
            data: $("#formEdit").serialize(),
            success: function (data) {
                updateAlerts(data);
            }
        });
    });


    //Clear Form
    $('#btnClear').on('click', function () {
        $('#formEdit').trigger("reset");
        clearAlerts();
    });

    function updateAlerts(data) {
        var error = data.error;
        var message = data.message;
        if (error) {
            $("#errorBox").text(error);
            $("#errorBox").show();
        }
        if (message) {
            $("#messageBox").text(message);
            $("#messageBox").show();
        }
    }

    function clearAlerts() {
        $('#errorBox').text("");
        $('#messageBox').text("");
        $('#errorBox').hide();
        $('#messageBox').hide();
    }

    $('#formEdit').submit(function () {
        //console.log("hi");
        event.preventDefault();
    });

});