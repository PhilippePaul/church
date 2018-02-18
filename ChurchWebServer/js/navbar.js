$(document).ready(function () {

    $("a.topnavitem.selected").removeClass("selected");

    var id;
    switch (window.location.pathname) {
        case "/databasepage.html":
            id = "people";
            break;
        case "/groupes_connexion.html":
            id = "groupes_connexion";
            break;
        case "/petits_groupes.html":
            id = "petits_groupes";
            break;
    }
    $("#" + id).addClass("selected");
});