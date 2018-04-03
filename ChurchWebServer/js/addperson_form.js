$(document).ready(function () {
    
    $("#personform").load("person_form.html");
    $("#childSelectList").select2({ dropdownAutoWidth: true, width: 'auto' });
    $("#parentSelectList").select2({ dropdownAutoWidth: true, width: 'auto' });



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