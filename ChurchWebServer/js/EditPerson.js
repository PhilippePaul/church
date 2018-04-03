$(document).ready(function () {

    $("#personform").load("person_form.html");
    $("#childSelectList").select2({ dropdownAutoWidth: true, width: 'auto' });
    $("#parentSelectList").select2({ dropdownAutoWidth: true, width: 'auto' });

    var action = GetParameterByName("action");
    if (action == "add") {
        $("#modifyControls").hide();

        $("#saveBtn").click(function () {
            if (!Validate()) {
                return;
            }

            var newPerson = {
                Person: {
                    Id: -1,
                    FirstName: $("#firstname").val(),
                    LastName: $("#lastname").val(),
                    Gender: $("#genderMale").prop("checked") ? 0 : 1,
                    BirthDate: $("#birthdate").datepicker("getDate"),
                    Email: $("#email").val(),
                    Address: {
                        StreetAddress: $("#address").val(),
                        City: $("#city").val(),
                        ProvinceState: $("#province_state").val(),
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
                url: "addPerson",
                data: JSON.stringify(newPerson),
                contentType: "application/json",
                method: "POST",
            })
            .done(function (data) {
                alert("Le profil a été créé.");
                parents_edit_lisit = [];
                children_edit_list = [];
            })
            .fail(function (error, b, c) {
                alert("Une erreur est survenue lors de l'enregistrement:\n" + error.responseText);
            });
        });

        LoadPersonList(function () { });
    } else /*if (action == "modify")*/ {
        $("#modifyControls").show();
        $("#personlist").select2({ dropdownAutoWidth: true, width: 'auto' });
        $("#personlist").change(function () {
            var person = JSON.parse($("#personlist").val());
            LoadPersonById(person.Id);
        });

        $("#saveBtn").click(function () {
            if (!Validate()) {
                return;
            }

            var person = JSON.parse($("#personlist").val());
            var modifiedPerson = {
                Person: {
                    Id: person.Id,
                    FirstName: $("#firstname").val(),
                    LastName: $("#lastname").val(),
                    Gender: $("#genderMale").prop("checked") ? 0 : 1,
                    BirthDate: $("#birthdate").datepicker("getDate"),
                    Email: $("#email").val(),
                    Address: {
                        Id: person.Address.Id,
                        StreetAddress: $("#address").val(),
                        City: $("#city").val(),
                        ProvinceState: $("#province_state").val(),
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
                data: JSON.stringify(modifiedPerson),
                contentType: "application/json",
                method: "POST",
            })
            .done(function (data) {
                alert("Le profil a été modifié.");
                parents_edit_lisit = [];
                children_edit_list = [];
            })
            .fail(function (error, b, c) {
                alert("Une erreur est survenue lors de l'enregistrement:\n" + error.responseText);
            });
        });

        LoadPersonList(function () {
            var personid = GetParameterByName("personid");
            if (personid) {
                $.ajax({
                    context: this,
                    url: "/getPerson?" + personid,
                    method: "POST",
                })
                .done(function (data) {
                    $("#personlist").val(data).trigger("change");
                });
            }
            else {
                var obj = $("#personlist").val();
                var person = JSON.parse($("#personlist").val());
                LoadPersonById(person.Id);
            }
        });
    }

    $("#addChild").click(function () {
        var person = JSON.parse($("#childSelectList").val());
        if (children_edit_list.indexOf(person.Id) != -1 || parents_edit_list.indexOf(person.Id) != -1) {
            alert(person.FirstName + " " + person.LastName + "a déjà ajouté(e).");
        }
        else {
            children_edit_list.push(person.Id);
            var node = document.createElement("div");
            var button = document.createElement("button");
            button.append("-");
            button.onclick = function () {
                var index = children_edit_list.indexOf($(this).parent().val());
                if (index != -1) {
                    children_edit_list.splice(index, 1);
                }
                $(this).parent().remove();
            };
            node.append(button);
            node.append(person.FirstName + " " + person.LastName);
            node.value = person.Id;
            $("#childrenList").append(node);
        }
    });

    $("#addParent").click(function () {
        var person = JSON.parse($("#parentSelectList").val());
        if (parents_edit_list.indexOf(person.Id) != -1 || children_edit_list.indexOf(person.Id) != -1) {
            alert(person.FirstName + " " + person.LastName + " a déjà ajouté(e).");
        }
        else {
            parents_edit_list.push(person.Id);
            var node = document.createElement("div");
            var button = document.createElement("button");
            button.append("-");
            button.onclick = function () {
                var index = parents_edit_list.indexOf($(this).parent().val());
                if (index != -1) {
                    parents_edit_list.splice(index, 1);
                }
                $(this).parent().remove();
            };
            node.append(button);
            node.append(person.FirstName + " " + person.LastName);
            node.value = person.Id;
            $("#parentsList").append(node);
        }
    });

    $("#deleteBtn").click(function () {
        var person = JSON.parse($("#personlist").val());
        if (person) {
            if (confirm("Êtes-vous sûr de vouloir supprimer le profil de " + person.FirstName + " " + person.LastName + "?")) {
                $.ajax({
                    context: this,
                    url: "/deletePerson?" + person.Id,
                    dataType: "html",
                    method: "POST",
                })
                .done(function (data) {
                    alert("Le profil a été supprimé.");

                    LoadPersonList(function () {
                        var person = JSON.parse($("#personlist").val());
                        LoadPersonById(person.Id);
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
            node.value = JSON.stringify(person);
            $("#personlist").append(node);
            $("#parentSelectList").append(node.cloneNode(true));
            $("#childSelectList").append(node.cloneNode(true));
        }
        postLoadFunction();
    });
}

function LoadPersonById(personId) {
    $.ajax({
        context: this,
        url: "/getPerson?" + personId,
        method: "POST",
    })
    .done(function (data) {
        person = JSON.parse(data);
        $("#firstname").val(person.FirstName);
        $("#lastname").val(person.LastName);
        if (person.Gender == 0) {
            $("#genderMale").prop("checked", true);
        } else {
            $("#genderFemale").prop("checked", true);
        }
        $("#birthdate").datepicker("setDate", new Date(person.BirthDate));
        $("#email").val(person.Email);
        $("#address").val(person.Address.StreetAddress);
        $("#city").val(person.Address.City);
        $("#province_state").val(person.Address.ProvinceState);
        $("#country").val(person.Address.Country);
        $("#postalcode").val(person.Address.PostalCode);
        $("#ismember").prop("checked", person.IsMember);
    });

    $.ajax({
        context: this,
        url: "/getParents?" + personId,
        method: "POST",
    })
    .done(function (data) {
        $("#parentsList").empty();
        var parents = JSON.parse(data);
        for (i = 0; i < parents.length; ++i) {
            var parent = parents[i];
            var node = document.createElement("div");
            var button = document.createElement("button");
            button.append("-");
            button.onclick = function () {
                var index = parents_edit_list.indexOf($(this).parent().val());
                if (index != -1) {
                    parents_edit_list.splice(index, 1);
                }
                $(this).parent().remove();
            };
            node.append(button);
            node.append(parent.FirstName + " " + parent.LastName);
            $("#parentsList").append(node);
            parents_edit_list.push(parent.Id);
        }
    });

    $.ajax({
        context: this,
        url: "/getChildren?" + personId,
        method: "POST",
    })
    .done(function (data) {
        $("#childrenList").empty();
        var children = JSON.parse(data);
        for (i = 0; i < children.length; ++i) {
            var child = children[i];
            var node = document.createElement("div");
            var button = document.createElement("button");
            button.append("-");
            button.onclick = function () {
                var index = children_edit_list.indexOf($(this).parent().val());
                if (index != -1) {
                    children_edit_list.splice(index, 1);
                }
                $(this).parent().remove();
            };
            node.append(button);
            node.append(child.FirstName + " " + child.LastName);
            $("#childrenList").append(node);
            children_edit_list.push(child.Id);
        }
    });
}

function ClearFields() {

    $("#firstname").val("");
    $("#lastname").val("");
    $("#gender").val("");
    $("#birthdate").datepicker("setDate", null),
    $("#email").val("");
    $("#ismember").val("");
    $("#address").val("");
    $("#city").val("");
    $("#province_state").val("");
    $("#country").val("");
    $("#postalcode").val("");
    parents_edit_list.length = 0;
    children_edit_list.length = 0;
    $("#parentsList").empty();
    $("#childrenList").empty();
}