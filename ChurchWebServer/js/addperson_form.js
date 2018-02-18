$(document).ready(function () {
    
    $("#personform").load("person_form.html");
    $("#childSelectList").select2({ dropdownAutoWidth: true, width: 'auto' });
    $("#parentSelectList").select2({ dropdownAutoWidth: true, width: 'auto' });

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

    $("#savePerson").click(function () {
        if (!Validate()) {
            return;
        }

        var person = {
            Person: {
                FirstName: $("#firstname").val(),
                LastName: $("#lastname").val(),
                Gender: $("#gender").val() == "Homme" ? 0 : 1,
                BirthDate: $("#birthdate").datepicker("getDate"),
                Email: $("#email").val(),
                Address: {
                    StreetAddress: $("#address").val(),
                    City: $("#city").val(),
                    ProvinceState: $("#province_state").val(),
                    Country: $("#country").val(),
                    PostalCode: $("#postalcode").val()
                },
                IsMember: $("#ismember").val() == "Oui"
            },
            Parents: parents_edit_list,
            Children: children_edit_list,
        };
        $.ajax({
            context: this,
            url: "addPerson",
            data: JSON.stringify(person),
            contentType: "application/json",
            method: "POST",
        })
        .done(function (data) {
            alert("Le profile a été créé!");
            ClearFields();
        })
        .fail(function (error, b, c) {
            alert("Une erreur est survenue lors de l'enregistrement:\n" + error.responseText);
        });
    });

    $.ajax({
        context: this,
        url: "/getPersonList",
        method: "POST",
        success: function (data) {
            var personList = JSON.parse(data);
            for (i = 0; i < personList.length; ++i) {
                var person = personList[i];
                var node = document.createElement("option");
                node.append(person.FirstName + " " + person.LastName);
                node.value = JSON.stringify(person);
                $("#parentSelectList").append(node);
                $("#childSelectList").append(node.cloneNode(true));
            }
        },
    });
});

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