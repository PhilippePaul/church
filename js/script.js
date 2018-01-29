$(document).ready(function() {
	$("#navigationbar").load("topnavigationbar.html");
});

function Validate() {
    var isValid = true;
    if ($("#firstname").val() == "") {
        $("#nameError").css("visibility", "visible");
        isValid = false;
    }
    if ($("#lastname").val() == "") {
        $("#nameError").css("visibility", "visible");
        isValid = false;
    }
    //validate date
    //validate email, can be empty..
    if ($("#address").val() == "") {
        $("#addressError").css("visibility", "visible");
        isValid = false;
    }
    if ($("#city").val() == "") {
        $("#cityError").css("visibility", "visible");
        isValid = false;
    }
    if ($("#province_state").val() == "") {
        $("#stateError").css("visibility", "visible");
        isValid = false;
    }
    if ($("#country").val() == "") {
        $("#countryError").css("visibility", "visible");
        isValid = false;
    }
    if ($("#postalcode").val() == "") {
        $("#postalcodeError").css("visibility", "visible");
        isValid = false;
    }

    return isValid;
}