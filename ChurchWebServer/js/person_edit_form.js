$(document).ready(function () {

    $("#savePerson").click(function () {
        if (!Validate()) {
            return;
        }
        
        var personId = $("#personlist").val();
        if(personId) {

        }

        var person = {
            Person: {
                Id: personId,
                FirstName: $("#firstname").val(),
                LastName: $("#lastname").val(),
                Gender: $("#genderMale").prop("checked") ? 0 : 1,
                BirthDate: $("#birthdate").datepicker("getDate"),
                Email: $("#email").val(),
                Address: {
                    StreetAddress: $("#address").val(),
                    City: $("#city").val(),
                    ProvinceState: $("province_state").val(),
                    Country: $("#country").val(),
                    PostalCode: $("#postalcode").val()
                },
                IsMember: $("#ismember").prop("checked")
            },
            Parents: parents_edit_list,
            Children: children_edit_list,
        };
        $.ajax({
            context: this,
            url: "updatePerson",
            data: JSON.stringify(person),
            contentType: "application/json",
            method: "POST",
        })
        .done(function (data) {
            alert("Le profil a été modifié.");
        })
        .fail(function (error, b, c) {
            alert("Une erreur est survenue lors de l'enregistrement:\n" + error.responseText);
        });
    });

    $("#deleteBtn").click(function () {
        var personId = $("#personlist").val();
        if (personId) {
            if (confirm("Êtes-vous sûr de vouloir supprimer ce profil?")) {
                var index = $("#personlist").selectedIndex;
                $.ajax({
                    context: this,
                    url: "/deletePerson?" + personId,
                    dataType: "html",
                    method: "POST",
                })
                .done(function (data) {
                    alert("Le profil a été supprimé.");

                    LoadPersonList(function () {
                        LoadPerson($("#personlist").val());
                    });
                })
                .fail(function (error, b, c) {
                    alert("Une erreur est survenue: " + error.responseText);
                });
            }
        } else {
            alert("Aucun profil sélectionné.");
        }
    });

    $("#personform").load("person_form.html");

    $("#personlist").select2({ dropdownAutoWidth: true, width: 'auto' });
    $("#personlist").change(function () {
        LoadPerson($("#personlist").val());
    });

    LoadPersonList(function () {
        var personid = GetParameterByName("personid");
        if (personid) {
            $("#personlist").val(personid).trigger("change");
        }
        else {
            LoadPerson($("#personlist").val());
        }
    });
});

function LoadPersonList(postLoadFunction) {
    $.ajax({
        context: this,
        url: "/getPersonList",
        method: "POST",
    })
    .done(function (data) {
        $("#personlist").empty();
        var personList = JSON.parse(data);
        for (i = 0; i < personList.length; ++i) {
            var person = personList[i];
            var node = document.createElement("option");
            node.append(person.FirstName + " " + person.LastName);
            node.value = person.Id;
            $("#personlist").append(node);
        }
        postLoadFunction();
    });
}

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
        $("#birthdate").datepicker("setDate", new Date(person.BirthDate));
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
            node.href = "person_edit_form.html?personid=" + parent.Id;
            node.classList.add("person_link");
            $("#parentsList").append(node);
            parents_edit_list.push(parent.Id);
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
            var child = children[i];
            var node = document.createElement("a");
            node.append(child.FirstName + " " + child.LastName);
            node.href = "person_edit_form.html?personid=" + child.Id;
            node.classList.add("person_link");
            $("#childrenList").append(node);
            children_edit_list.push(child.Id);
        }
    });
}

function GetParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}