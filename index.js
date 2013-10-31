var key = "AI39si7IuhI3ub6YnNfbfA3f3TukUtKRL_Tq8YqUfHRmwMR37MpzV3mGXYOldcrPPUyJLLHnfVtlh3v5Qq70zvOjvFyMFBn5Pw";
var button = document.getElementById("record");


function randomName (ext) {
	return (Math.random() * 1e8).toString(16) + (ext || "");
}

button.onclick = function () {
	var activity = new MozActivity({
	  name: "pick",

	  // Provide the data required by the filters of the activity
	  data: {
	    type: "video/*"
	  }
	});

	activity.onsuccess = onSuccess;
	activity.onerror = function() {
		console.log("Error in activity");
		console.dir(this.error.name);
		console.log(this.error.type)
	};
}

function onSuccess (e) {
	console.log("Video success");
	var video = this.result;
	console.log(video.type);
	console.log(video.blob);

	uploadYoutube(video.blob);
}

function xmlString (title, description, keywords) {
	title = title || "test";
	description = description || "test";
	keywords = keywords || "skate";

	var content = [
		'<?xml version="1.0"?>',
		'<entry xmlns="http://www.w3.org/2005/Atom"',
		'  xmlns:media="http://search.yahoo.com/mrss/"',
		'  xmlns:yt="http://gdata.youtube.com/schemas/2007">',
		'  <media:group>',
		'    <media:title type="plain">'+title+'</media:title>',
		'    <media:description type="plain">',
			description,
		'    </media:description>',
		'    <media:category',
		'      scheme="http://gdata.youtube.com/schemas/2007/categories.cat">People',
		'    </media:category>',
		'    <media:keywords>'+keywords+'</media:keywords>',
		'  </media:group>',
		'</entry>'
	];

	return content.join("\n");
}

function uploadYoutube (file) {
	var name = randomName(".3gp")
	var xhr = new XMLHttpRequest({mozSystem: true});

	xhr.open("POST", "http://uploads.gdata.youtube.com/feeds/api/users/default/uploads", true);
	//xhr.setRequestHeader("Authorization", "Bearer "); TRY WITHOUT
	xhr.setRequestHeader("GData-Version", "2");
	xhr.setRequestHeader("X-GData-Key", "key=" + key);
	xhr.setRequestHeader("Slug", name);
	xhr.setRequestHeader("Content-Type", "multipart/related; boundary=\"f93dcbA3\"");

	var content = [
		"--f93dcbA3",
		"Content-Type: application/atom+xml; charset=UTF-8",
		xmlString(), //PUT XML 
		"--f93dcbA3",
		"Content-Type: video/3gpp",
		"Content-Transfer-Encoding: binary"
	];

	var reader = new FileReader();

	reader.onloadend = function (bin) {	
		console.log("Got BINARY");

		content.push(reader.result);
		content.push("--f93dcbA3");

		var data = content.join("\n");
		xhr.setRequestHeader("Content-Length", data.length);
		xhr.setRequestHeader("Connection", "close");

		console.log("\n\n\n\n\n\n\n");
		console.log(data);
		console.log("\n\n\n\n\n\n\n");

		xhr.send(data);
	}

	reader.readAsBinaryString(file);

	xhr.onreadystatechange = function (e) {
		console.log("\n\nSTATE CHANGE")
		console.log(xhr.readyState);
		console.log(xhr.statusText);
		console.log(xhr.responseText);
		console.log("--------------\n\n")

		var headers = xhr.getAllResponseHeaders();
		console.log(headers);
	};
}