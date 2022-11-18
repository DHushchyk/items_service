import {
    csrftoken, itemsURL, imagesURL, imagesUploadURL
} from "./utils.js";

const itemId = document.getElementById("itemId").innerHTML;
const itemURL = itemsURL + `${itemId}/`;

function getItemDetails() {
    fetch(itemURL).then(response => {
        return response.json();
    }).then(json => {
        singleItemToHTML(json);
        if (json.images.length !== 0) {
            json.images.forEach(image => imageToHTML(image));
        }
    });
}

window.addEventListener("DOMContentLoaded", getItemDetails);

function singleItemToHTML({id, title, price, images, author, created_at}) {
    const item = document.getElementById("sampleItem");
    const itemTitle = document.getElementById("newItemTitle");
    const itemPrice = document.getElementById("newItemPrice");
    const itemAuthor = document.getElementById("newItemAuthor");
    itemTitle.value = title;
    itemPrice.value = price;
    itemAuthor.value = author;

    item.insertAdjacentHTML("beforeend", `
        <div id="singleItem">
            <h1>${title} (id: ${id})</h1>
            <h3>price: ${price} $</h3>
            <h3>author: ${author}</h3>
            <h3>creation date: ${created_at}</h3><br>
        </div>
    `);
}


function imageToHTML(image) {
    const imageList = document.getElementById("images");
    const imageLink = image.image;
    const imageId = image.id;

    imageList.insertAdjacentHTML("beforeend", `
        <div class="col-sm-3" id="image${imageId}">
            <div class="card" style="width: 18rem;">
                <img src="${imageLink}" class="card-img-top" width="220" height="220" alt="Item">
                <div class="card-body">
					<button class="btn btn-danger" id="deleteImageButton${imageId}">Delete</button>
                </div>  
            </div>
            <br><br>
        </div>
    `);

    document.getElementById(`deleteImageButton${imageId}`).addEventListener("click", () => {
        deleteImage(imageId);
    });
}

function updateItem() {
    const inputTitle = document.getElementById("newItemTitle");
    const inputPrice = document.getElementById("newItemPrice");
    const inputAuthor = document.getElementById("newItemAuthor");
    const title = inputTitle.value;
    const price = inputPrice.value;
    const author = inputAuthor.value;

    fetch(itemURL, {
        method: "PUT",
        headers: {
            "Content-type": "application/json",
            "X-CSRFToken": csrftoken
        },
        body: JSON.stringify({"title": title, "price": price, "author": author})
        }
    ).then(response => {
        if (response.status !== 200) {
            return Promise.reject(response);
        } else {
            return response.json();
        }
    }).then(json => {
        document.getElementById("singleItem").remove();
        singleItemToHTML(json);
    }).catch(err => err.json()).then(errJson => {
            if (errJson) {
                alert(JSON.stringify(errJson, null, 2));
            }
        }
    );
}

document.getElementById("updateItemButton").addEventListener("click", updateItem);

function deleteItem() {
    let confirmDelete = confirm("Do you want to delete this item?")
    if (confirmDelete) {
        fetch(itemURL, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        }).then(response => {if (response.status === 204) {
            alert("Item deleted succsesfull!");
        }})
    }
    location.replace("/");
}

document.getElementById("deleteItemButton").addEventListener("click", deleteItem);

function addImageToSingleItem() {
    const inputImages = document.getElementById("newItemImages");
    let images = inputImages.files;
    const formData = new FormData();
    formData.append("item", itemId);

    if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
            formData.append("images", images[i]);
        }
    }

    fetch(imagesUploadURL, {
        method: "POST",
        headers: {"X-CSRFToken": csrftoken},
        body: formData,
    }).then(response => {
        if (response.status !== 200) {
            return Promise.reject(response);
        }
        return response.json();
    }).then(json => {
         let imageLinks = [];
         for (let i = 0; i < json.images.length; i++) {
             imageLinks.push({
                 "id": json.images[i].id,
                 "image": json.images[i].image,
                 "item": json.images[i].item,
             });
         }
         imageLinks.forEach(image => imageToHTML(image))
         document.getElementById("newItemImages").value = "";
    }).catch(err => err.json()).then(errJson => {
        if (errJson) {
            alert(JSON.stringify(errJson, null, 2));
        }
    })
}

document.getElementById("addImageToSingleItemButton").addEventListener("click", addImageToSingleItem);

function deleteImage(id) {
    let confirmDelete = confirm("Do you want to delete this image?")
    const imageURL = imagesURL + `${id}/`
    const image = document.getElementById(`image${id}`)
    if (confirmDelete) {
        fetch(imageURL, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        }).then(response => {if (response.status === 204) {image.remove()}})
    }
}

