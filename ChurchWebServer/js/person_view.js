$(document).ready(function () {
    $.ajax({
        context: this,
        url: "/getPersonList",
        method: "POST",
    })
    .done(function (data) {
        var dataList = [];
        var personList = JSON.parse(data);
        for (i = 0; i < personList.length; ++i) {
            dataList.push($.map(personList[i], function (value, index) {
                    return [value];
            }));
        }

        var dataTable = $("#person_table").DataTable({
            data: dataList,
            columns: [
                {
                    targets: -1,
                    data: null,
                    defaultContent: "<button>Modifier</button>"
                },
                {
                    targets: 0,
                    title: "Prénom"
                },
                {
                    targets: 1,
                    title: "Nom"
                },
                {
                    targets: 2,
                    title: "Date de naissance",
                    render: function (d) {
                        var date = new Date(d);
                        return date.getFullYear() + "-" + PadWithZeroes(date.getMonth() + 1, 2) + "-" + PadWithZeroes(date.getDate(), 2);
                    }
                },
                {
                    targets: 3,
                    title: "Genre",
                    render: function (val) {
                        return val == 0 ? "Masculin" : "Feminin";
                    }
                },
                {
                    targets: 4,
                    title: "Courriel"
                },
                {
                    targets: 5,
                    title: "Ville",
                    render: function (val) {
                        return val.City;
                    }
                },
                {
                    targets: 6,
                    title: "Membre",
                    render: function (val) {
                        return val ? "Oui" : "Non";
                    }
                },
                {
                    targets: 7,
                    title: "Date d'ajout",
                    render: function (d) {
                        var date = new Date(d);
                        return PadWithZeroes(date.getFullYear(), 4) + "-" + PadWithZeroes(date.getMonth() + 1, 2) + "-" + PadWithZeroes(date.getDate(), 2);
                    }
                }
            ],
            language: {
                processing: "Traitement en cours...",
                search: "Rechercher&nbsp;:",
                lengthMenu: "Afficher _MENU_ &eacute;l&eacute;ments",
                info: "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
                infoEmpty: "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
                infoFiltered: "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
                infoPostFix: "",
                loadingRecords: "Chargement en cours...",
                zeroRecords: "Aucun &eacute;l&eacute;ment &agrave; afficher",
                emptyTable: "Aucune donnée disponible dans le tableau",
                paginate: {
                    first: "Premier",
                    previous: "Pr&eacute;c&eacute;dent",
                    next: "Suivant",
                    last: "Dernier"
                },
                aria: {
                    sortAscending: ": activer pour trier la colonne par ordre croissant",
                    sortDescending: ": activer pour trier la colonne par ordre décroissant"
                }
            }
        });

        $("#person_table tbody").on("click", "button", function () {

            var selected = parent.document.getElementsByClassName("selected");
            while (selected.length) {
                selected[0].classList.remove("selected");
            }
            parent.document.getElementById("modifyProfile").classList.add("selected");

            var data = dataTable.row($(this).parents("tr")).data();
            window.location = "EditPerson.html?action=modify&personid=" + data[0];
        });
    });
});