$(document).ready(function () {

    $("div.sidebaritem").click(function (item) {
        $("div.sidebaritem.selected").removeClass("selected");
        item.target.classList.add("selected");
        $("#viewframe").attr("src", item.target.getAttribute("value"));
    });
});