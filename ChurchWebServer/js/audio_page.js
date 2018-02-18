$(document).ready(function() {

	//Load files from music folder
	$.ajax({
		context: this,
		url: "/getAudioFiles",
		method: "GET",
		success: function(data) {
			var files = data.split(";");
			for(i = 0; i < files.length; i++) {
				var node = document.createElement("a");
				node.download = "download" + i;
				node.classList.add("downloadLink");
				node.href = files[i].replace("/home/phil", "");
				node.append(files[i].substring(files[i].lastIndexOf("/") + 1));
				$("#downloadFiles").append(node);
			}
		},
	});
});