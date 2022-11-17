const host = window.location.protocol + "//" + window.location.host;
const api = host + "/api/";
const itemsURL = api + "items/";
const imagesURL = api + "images/";
const imagesUploadURL = imagesURL + "upload-images/";
const csrftoken = getCookie("csrftoken");

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export {
    csrftoken, itemsURL, imagesURL, imagesUploadURL
}