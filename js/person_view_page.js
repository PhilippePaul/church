$(document).ready(function () {

    $("#personform").load("person_form.html");

    $("#personlist").select2({ dropdownAutoWidth: true, width: 'auto' });
    $("#personlist").change(function () {
        LoadPerson($("#personlist").val());
    });

    $.ajax({
        context: this,
        url: "/getPersonList",
        method: "POST",
    })
    .done(function (data) {
        var personList = JSON.parse(data);
        for (i = 0; i < personList.length; ++i) {
            var person = personList[i];
            var node = document.createElement("option");
            node.append(person.FirstName + " " + person.LastName);
            node.value = person.Id;
            $("#personlist").append(node);
        }

        var personid = GetParameterByName("personid");
        if (personid) {
            $("#personlist").val(personid).trigger("change");
        }
        else {
            LoadPerson($("#personlist").val());
        }
    });
});

function LoadPerson(personid) {
    $.ajax({
        context: this,
        url: "/getPerson?" + personid,
        method: "POST",
    })
    .done(function (data) {
        var person = JSON.parse(data);
        $("#firstname").val(person.FirstName);
        $("#lastname").val(person.LastName);
        $("#gender").val(person.Gender == 0 ? "Homme" : "Femme");

        var date = new Date(person.BirthDate);
        $("#bDate_day").val(new Date(person.BirthDate).getDate());
        $("#bDate_month").val(new Date(person.BirthDate).getMonth());
        $("#bDate_year").val(new Date(person.BirthDate).getFullYear());
        $("#email").val(person.Email);
        $("#address").val(person.Address.StreetAddress);
        $("#city").val(person.Address.City);
        $("#province_state").val(person.Address.ProvinceState);
        $("#country").val(person.Address.Country);
        $("#postalcode").val(person.Address.PostalCode);
        $("#ismember").val(person.IsMember ? "Oui" : "Non");
    });

    $.ajax({
        context: this,
        url: "/getParents?" + personid,
        method: "POST",
    })
    .done(function (data) {
        $("#parentsList").empty();
        var parents = JSON.parse(data);
        for (i = 0; i < parents.length; ++i) {
            var parent = parents[i];
            var node = document.createElement("a");
            node.append(parent.FirstName + " " + parent.LastName);
            node.href = "person_view_page.html?personid=" + parent.Id;
            node.classList.add("person_link");
            $("#parentsList").append(node);
        }
    });

    $.ajax({
        context: this,
        url: "/getChildren?" + personid,
        method: "POST",
    })
    .done(function (data) {
        $("#childrenList").empty();
        var children = JSON.parse(data);
        for (i = 0; i < children.length; ++i) {
            var parent = children[i];
            var node = document.createElement("a");
            node.append(parent.FirstName + " " + parent.LastName);
            node.href = "person_view_page.html?personid=" + parent.Id;
            node.classList.add("person_link");
            $("#childrenList").append(node);
        }
    });
}

function PadWithZeroes(number, length) {
    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }
    return my_string;
}

function GetParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}