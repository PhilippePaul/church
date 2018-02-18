$(document).ready(function () {

    $(".formfield").on("change paste keyup", function () {
        $("span.validation").css("visibility", "hidden");
    });

    $("#birthdate").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: "-200:+0",
        monthNamesShort: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
    });
    $.datepicker.setDefaults($.datepicker.regional[""]);
    $("#birthdate").datepicker($.datepicker.regional["fr"]);
});