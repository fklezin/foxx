$(document).ready(function () {

    var params = {
        "user": "{'user':'assd','score':1235}"
    };

    $.ajax({
        type: "POST",
        url: "http://193.77.150.15:48529/_db/pheidippides/phe/insertRecord",
        data: JSON.stringify(params),

        success: function (response) {
            console.log(response);
            console.log(JSON.parse(response.response));
            console.log(JSON.stringify(params));
        }
    });

});