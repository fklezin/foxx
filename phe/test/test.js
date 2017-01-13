$(document).ready(function () {

    var params = {
        "user": "{'user':'assd','score':232}"
    };

    $.ajax({
        type: "POST",
        url: "http://localhost:8529/_db/pheidippides/phe/insertRecord",
        data: JSON.stringify(params),

        success: function (response) {
            console.log(response);
            console.log(JSON.parse(response.response));
        }
    });

});