# Items Service API

API service for managing items and images written on DRF

## Check it out!

[Items Service project deployed to Heroku](https://items-service.herokuapp.com/)

```shell
git clone https://github.com/DHushchyk/items_service.git
cd items_service
python3 -m venv venv
source venv\Scripts\activate (on Windows)
source venv\bin\activate (on Mac)
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Features

* Managing items and images directory from website
* Creating items and getting list of them via API /api/items/
* Creating images for items and getting list of them via API /api/images/
* Updating and deleting on detail endpoints for items and images
* Multiple uploading images via API /api/images/upload-images/
* Powerful admin panel for advanced managing