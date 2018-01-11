$(document).ready(function () {

    $("#personlist").change(function () {
        var personid = $("#personlist").val();
        $.ajax({
            context: this,
            url: "/getPerson?" + personid,
            method: "POST",
            success: function (data) {
                var person = JSON.parse(data);
                $("#firstname").val(person.FirstName);
                $("#lastname").val(person.LastName);
                $("#female").prop("checked", person.Gender == 1);
                $("#email").val(person.Email);
                $("#address").val(person.Address.StreetAddress);
                $("#city").val(person.Address.City);
                $("#province_state").val(person.Address.ProvinceState);
                $("#country").val(person.Address.Country);
                $("#postalcode").val(person.Address.PostalCode);
                $("#ismemberyes").prop("checked", person.IsMember);
            },
        });

        $.ajax({
            context: this,
            url: "/getParents?" + personid,
            method: "POST",
            success: function (data) {
                var names = data.split(";");
                $("#parentsList").empty();
                for (i = 0; i < names.length; i++) {
                    var node = document.createElement("div");
                    node.append(names[i]);
                    $("#parentsList").append(node);
                }
            },
        });

        $.ajax({
            context: this,
            url: "/getChildren?" + personid,
            method: "POST",
            success: function (data) {
                var names = data.split(";");
                $("#childrenList").empty();
                for (i = 0; i < names.length; i++) {
                    var node = document.createElement("div");
                    node.append(names[i]);
                    $("#childrenList").append(node);
                }
            },
        });
    });

    $.ajax({
        context: this,
        url: "/getPersonList",
        method: "POST",
        success: function (data) {
            var personList = JSON.parse(data);
            for(i = 0; i < personList.length; ++i) {
                var person = personList[i];
                var node = document.createElement("option");
                node.append(person.FirstName + " " + person.LastName);
                node.value = person.Id;
                $("#personlist").append(node);
            }
        },
    });

});