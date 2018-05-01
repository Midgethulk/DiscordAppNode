$(document).ready(function () {
    $('#errorBox').hide();
    $('#messageBox').hide();

    //Start Bot
    $('#btnStart').on("click", function () {
        clearAlerts();
        var request = $.ajax({
            type: "POST",
            url: "/dashboard/bots/action",
            data: {"command":"start"},
            success: function (data) {
                updateAlerts(data);
            },
            fail: function(jqXHR,textStatus,errorThrown){
                console.log("failure:"+ textStatus+ " " + errorThrown);
            }
        });
    });

    //Start Bot
    $('#btnStop').on("click", function () {
        clearAlerts();
        var request = $.ajax({
            type: "POST",
            url: "/dashboard/bots/action",
            data: {"command":"stop"},
            success: function (data) {
                updateAlerts(data);
            },
            fail: function(jqXHR,textStatus,errorThrown){
                console.log("failure:"+ textStatus+ " " + errorThrown);
            }
        });
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