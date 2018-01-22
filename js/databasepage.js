$(document).ready(function () {

    $("#viewframe").attr("src", "person_view_page.html");

    $("a.sidebaritem").click(function (item) {
        $("a.sidebaritem.selected").removeClass("selected");
        item.target.classList.add("selected");
        $("#viewframe").attr("src", item.target.href);
    });
});