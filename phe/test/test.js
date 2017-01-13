$(document).ready(function () {

    var params = {
        "word": "slo"
    };
    var paramsStr = "name=jan&age=10";

    $.ajax({
        type: "POST",
        url: "http://localhost:8529/_db/pheidippides/phe/jan123",
        data: JSON.stringify(params),

        success: function (response) {
            console.log(response);
            console.log(JSON.parse(response.response));
        }
    });

});