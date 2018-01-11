$(document).ready(function () {

    $.ajax({
        context: this,
        url: "/getParents?1",
        method: "POST",
        success: function (data) {
            var names = data.split(";");
            for (i = 0; i < names.length; i++) {
                var node = document.createElement("div");
                node.append(names[i]);
                $("#parentsList").append(node);
            }
        },
    });

    $.ajax({
        context: this,
        url: "/getChildren?5",
        method: "POST",
        success: function (data) {
            var names = data.split(";");
            for (i = 0; i < names.length; i++) {
                var node = document.createElement("div");
                node.append(names[i]);
                $("#childrenList").append(node);
            }
        },
    });

});