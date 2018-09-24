function mypath() {
    return location.pathname.replace("/index.html", "");
}

function quip() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", mypath() + "/qotd", true);
    xmlhttp.onload = function(e) {
        document.getElementById("quip").innerHTML= xmlhttp.responseText;
    }
    xmlhttp.send();
};

function imageLocate(photoid, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", mypath() + "/flickr/locate?id="+photoid, true);
    xhr.timeout = 3000;
    xhr.onload = function(e) {
        if(xhr.readyState === 4 && xhr.status === 200) {
            window.flickrimg_geolocation = JSON.parse(xhr.responseText);
            callback();
        }
    }
    xhr.onerror = function (e) {
        console.error(xhr.statusText);
    };
    xhr.ontimeout = function (e) {
        console.error("timed out: "+xhr.statusText);
    };
    xhr.send(null);
}

function resetImageStyleProperties() {
    var measureElt = document.getElementById("scmeasurement");
    measureElt.style.visibility="hidden";
    var warningElt = document.getElementById("radiation-warning");
    warningElt.style.visibility="hidden";
    var imgElt = document.getElementById("flickr-image");
    if (imgElt != null) {
        imgElt.style.outline = "none";
    }
}

function setImageBorderStyles(value) {
    var measureElt = document.getElementById("scmeasurement");
    var warningElt = document.getElementById("radiation-warning");
    var imgElt = document.getElementById("flickr-image");
    if (value != undefined) {
        imgElt.style.outline = "yellow inset thin";
        if (window.flickrimg_measurement.unit === "cpm" && window.flickrimg_measurement.value > 100) {
            imgElt.style.outline = "red inset thin";
        }
        var measurementDate = new Date(Date.parse(window.flickrimg_measurement.ts)).toDateString();
        var text = window.flickrimg_measurement.value + " "+window.flickrimg_measurement.unit + " on "+measurementDate;
        measureElt.innerText=text;
        measureElt.style.visibility="visible";
        warningElt.style.visibility="visible";
    }
}

function getNearbyMeasurement() {
    var xhr = new XMLHttpRequest();
    window.flickrimg_measurement = {};
    var latitude = window.flickrimg_geolocation.latitude;
    var longitude = flickrimg_geolocation.longitude;
    xhr.open("GET", mypath() + "/sc/measurement?lat="+latitude+"&lon="+longitude, true);
    xhr.timeout = 2000;
    xhr.onload = function(e) {
        if(xhr.readyState === 4 && xhr.status === 200) {
            window.flickrimg_measurement = JSON.parse(xhr.responseText);
            console.log(window.flickrimg_measurement);
            setImageBorderStyles(window.flickrimg_measurement.value);
        }
    }
    xhr.onerror = function (e) {
        console.error(xhr.statusText);
    };
    xhr.ontimeout = function (e) {
        console.error("timed out: "+xhr.statusText);
    };
    xhr.send(null);
}


function locateAndTag(photoId) {
    imageLocate(photoId, getNearbyMeasurement);
}

var refreshTimeoutID;

function reloadImage(imgjson) {
    clearTimeout(refreshTimeoutID);
    imgWebUrl = "https://www.flickr.com/photos/"+imgjson.owner+"/"+imgjson.id;
    // format of this url is https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_[mstzb].jpg
    var imgElt = document.getElementById("image");
    var width = imgElt.offsetWidth
                var imgUrlExt = ""; // defaults to the medium, 500 on longest side
    switch(true) {
    case width < 480:
        imgUrlExt = "_n";
        break;
    case width < 800:
        imgUrlExt = "_z";
        break;
    case width < 1600:
        imgUrlExt = "_b";
        break;
    }
    var imgDate = new Date(Date.parse(imgjson.datetaken)).toDateString();
    imgurl = "https://farm"+imgjson.farm+".staticflickr.com/"+imgjson.server+"/"+imgjson.id+"_"+imgjson.secret+imgUrlExt+".jpg"
             imgElt.innerHTML='<a href="'+imgWebUrl+'"><img class="flickr-wrapper" id="flickr-image" src="'+imgurl+'" style="width: '+width+'px; height=auto"></a><figcaption class="flickr-title">'+imgjson.title+'&mdash;'+imgDate+'</figcaption>';
    locateAndTag(imgjson.id);
    refreshTimeoutID = setTimeout(flickrimg, 20000);
}

function flickrimg() {
    resetImageStyleProperties();
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", mypath() + "/flickr", true);
    xmlhttp.timeout = 2000;
    xmlhttp.onload = function(e) {
        if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            reloadImage(JSON.parse(xmlhttp.responseText));
        } else {
            console.error(xmlhttp.statusText);
        }
    };
    xmlhttp.onerror = function (e) {
        console.error(xmlhttp.statusText);
    };
    xmlhttp.ontimeout = function (e) {
        console.error(xmlhttp.statusText);
    };
    xmlhttp.send(null);
};

function setUser() {
    var username = document.getElementById("flickr-username").value
                   var xhr = new XMLHttpRequest();
    xhr.open("GET", mypath() + "/flickr/setuser?username="+username, true);
    xhr.onload = function(e) {
        if(xhr.readyState === 4 && xhr.status === 200) {
            console.log("Flickr username set to "+username);
            console.log(xhr.responseText);
            // flickrimg();
            reloadImage(JSON.parse(xhr.responseText));
            document.getElementById("image-wrapper-div").style.visibility = "visible";
        }
    }
    xhr.send();
};
