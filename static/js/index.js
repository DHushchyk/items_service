import {
    csrftoken, itemsURL, imagesURL, imagesUploadURL
} from "./utils.js";

function addItemImages () {
    let createdItem = {};

    const inputTitle = document.getElementById("itemTitle");
    const inputPrice = document.getElementById("itemPrice");
    const inputAuthor = document.getElementById("itemAuthor");
    const title = inputTitle.value;
    const price = inputPrice.value;
    const author = inputAuthor.value;
    const inputImages = document.getElementById("itemImages");

    fetch(itemsURL, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "X-CSRFToken": csrftoken
        },
        body: JSON.stringify({"title": title, "price": price, "author": author})
    }).then(response => {
        if (response.status !== 201) {
            return Promise.reject(response);
        } else {
            inputTitle.value = "";
            inputPrice.value = "";
            inputAuthor.value = "";
            return response.json();
        }
    }).then(json => {
        createdItem.title = json.title;
        createdItem.price = json.price;
        createdItem.author = json.author;
        createdItem.created_at = json.created_at;
        createdItem.images = [];

        let images = inputImages.files;
        if (images.length > 0) {
            const itemId = json.id;
            const formData = new FormData();

            for (let i = 0; i < images.length; i++) {
                formData.append("images", images[i]);
            }
            formData.append("item", itemId);

            fetch(imagesUploadURL, {
                method: "POST",
                headers: {"X-CSRFToken": csrftoken},
                body: formData,
            }).then(response => response.json()).then(json => {
                let imageLinks = [];
                for (let i = 0; i < json.images.length; i++) {
                    imageLinks.push({
                        "id": json.images[i].id,
                        "image": json.images[i].image,
                        "item": json.images[i].item,
                    });
                }
                createdItem.images = imageLinks;
                document.getElementById("itemImages").value = "";
                itemToHTML(createdItem);
            });
        } else {itemToHTML(createdItem)}
    }).catch(err => err.json()).then(errJson => {
            if (errJson) {
                alert(JSON.stringify(errJson, null, 2));
            }
        }
    );
}

document.getElementById("addItemImagesButton").addEventListener("click", addItemImages);

function getAllItems() {
    fetch(itemsURL).then(response => response.json()).then(json => {
        json.forEach(item => itemToHTML(item));
    });
}

window.addEventListener("DOMContentLoaded", getAllItems);

function itemToHTML({id, title, price, images, author, created_at}) {
    const itemsList = document.getElementById("items");
    const currentURL = document.baseURI
    let mainImage = "";
    if (images.length !== 0) {
        mainImage = `<img src="${images[0].image}" class="card-img-top" width="220" height="220" alt="Item">`;
    }

    itemsList.insertAdjacentHTML("beforeend", `
        <div class="col-sm-3">
            <div class="card" style="width: 18rem;">
                ${mainImage}
                <div class="card-body">
                    <h5 class="card-title">${title}</h5
                    <h6 class="card-subtitle text-capitalize">${price} $</h6>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">Created by ${author}</li>
                    <li class="list-group-item">${created_at}</li>
                </ul>
                <div class="card-body">
                    <a href="${currentURL}/item/${id}" class="card-link">More about...</a>
                </div>  
            </div>
            <br><br>
        </div>`
    );
}
