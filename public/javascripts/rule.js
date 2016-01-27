$(document).ready(function () {
    $('#errorBox').hide();

    $('form').on("submit",function () {
        event.preventDefault();
        if($(this).hasClass(".forms"))
        {
        var formData = $(this).serializeArray();
        var idRule = formData[0].value
        //console.log(idRule);
        //$('#idRule').val(idRule);

        $.ajax({
            url: '/rule/byid/' + idRule,

            success: function (data) {
                //console.log(data);
                $('#errorBox').hide();
                if(data.error)
                {
                    $('#errorBox').text(data.error);
                    $('#errorBox').show();
                }
                else
                {
                    $('#idRule').val(data.rule._id);
                    $('#command').val(data.rule.command);
                    var reply = data.rule.reply;
                    if(reply)
                    {
                        $('#replyRadios1').prop('checked', 'checked');
                    }
                    else
                    {
                        $('#replyRadios2').prop('checked', 'checked');
                    }
                    $('#response').val(data.rule.response);

                }
            }
        });
        }

    });
    $('#formEdit').submit(function(){
        console.log("hi");
        event.preventDefault();
    });

});