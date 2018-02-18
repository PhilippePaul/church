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

        $("#person_table").DataTable({
            data: dataList,
            columns: [
                {
                    title: "Id",
                    visible: false
                },
                { title: "Prénom" },
                { title: "Nom" },
                {
                    title: "Date de naissance",
                    render: function (d) {
                        var date = new Date(d);
                        return date.getFullYear() + "-" + PadWithZeroes(date.getMonth() + 1, 2) + "-" + PadWithZeroes(date.getDate(), 2);
                    }
                },
                {
                    title: "Genre",
                    render: function (val) {
                        return val == 0 ? "Masculin" : "Feminin";
                    }
                },
                { title: "Courriel" },
                {
                    title: "Ville",
                    render: function (val) {
                        return val.City;
                    }
                },
                {
                    title: "Membre",
                    render: function (val) {
                        return val ? "Oui" : "Non";
                    }
                },
                {
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
    });
});