var children = [];
var parents = [];

$(document).ready(function () {
    
    $("#personform").load("person_form.html");
    $("#childSelectList").select2({ dropdownAutoWidth: true, width: 'auto' });
    $("#parentSelectList").select2({ dropdownAutoWidth: true, width: 'auto' });

    $("#addChild").click(function () {
        var person = JSON.parse($("#childSelectList").val());
        if (children.indexOf(person.Id) != -1 || parents.indexOf(person.Id) != -1) {
            alert(person.FirstName + " " + person.LastName + "a déjà ajouté(e).");
        }
        else {
            children.push(person.Id);
            var node = document.createElement("div");
            var button = document.createElement("button");
            button.append("-");
            button.onclick = function () {
                var index = children.indexOf($(this).parent().val());
                if (index != -1) {
                    children.splice(index, 1);
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
        if (parents.indexOf(person.Id) != -1 || children.indexOf(person.Id) != -1) {
            alert(person.FirstName + " " + person.LastName + " a déjà ajouté(e).");
        }
        else {
            parents.push(person.Id);
            var node = document.createElement("div");
            var button = document.createElement("button");
            button.append("-");
            button.onclick = function () {
                var index = parents.indexOf($(this).parent().val());
                if (index != -1) {
                    parents.splice(index, 1);
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
                    ProvinceState: $("province_state").val(),
                    Country: $("#country").val(),
                    PostalCode: $("#postalcode").val()
                },
                IsMember: $("#ismember").val() == "Oui"
            },
            Parents: parents,
            Children: children,
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