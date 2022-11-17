import datetime
import io
import tempfile
from urllib.parse import urljoin

from unittest import mock

from PIL import Image
from django.test import TestCase
from django.urls import reverse, reverse_lazy
from rest_framework.test import APIClient

from rest_framework import status

from items_app.models import ItemModel, ImageModel
from items_app.serializers import ImageSerializer, ItemSerializer

BASE_URL = "http://127.0.0.1:8000/"
ITEMS_URL = urljoin(BASE_URL, "api/items/")
IMAGES_URL = urljoin(BASE_URL, "api/images/")
UPLOAD_IMAGES_URL = urljoin(IMAGES_URL, "upload-images/")

TEST_FILES_PATH = "items_app/tests/test_images/"


def get_image(count=1):
    images = []
    for _ in list(range(count)):
        file = io.BytesIO()
        image = Image.new('RGBA', size=(100, 100), color=(155, 0, 0))
        image.save(file, 'png')
        file.name = 'test.png'
        file.seek(0)
        images.append(file)
    return images


def create_sample_item(client, title="Test_item_1", price=22.50, author="admin"):
    payload = {"title": title, "price": price, "author": author}

    return client.post(ITEMS_URL, payload)


def create_images(client, images_list, item=1):
    payload = {"item": item, "images": images_list}
    return client.post(UPLOAD_IMAGES_URL, payload, format="multipart")


class ItemsAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_item(self):
        res = create_sample_item(self.client)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    def test_create_images(self):
        item_res = create_sample_item(self.client)
        item_id = item_res.data["id"]

        sample_image_res = create_images(self.client, get_image(), item_id)
        multiple_images = create_images(self.client, get_image(3), item_id)

        self.assertEqual(sample_image_res.status_code, status.HTTP_200_OK)
        self.assertEqual(multiple_images.status_code, status.HTTP_200_OK)

    def test_create_images_bad_request(self):
        item_res = create_sample_item(self.client)
        item_id = item_res.data["id"]
        res = create_images(self.client, [], item_id)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_items(self):
        create_sample_item(self.client)
        create_sample_item(self.client, title="Test_item_2")
        create_sample_item(self.client, title="Test_item_3")

        res = self.client.get(ITEMS_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 3)

    def test_list_images(self):
        create_sample_item(self.client)
        create_images(self.client, get_image(3))

        res = self.client.get(IMAGES_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 3)


class TemplatesViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_index_url_accessible_by_name(self):
        res = self.client.get(reverse("items_app:index"))
        self.assertEqual(res.status_code, 200)

    def test_detail_url_accessible_by_name(self):
        item_res = create_sample_item(self.client)
        item_id = item_res.data["id"]

        res = self.client.get(reverse_lazy("items_app:detail", args=[item_id]))
        self.assertEqual(res.status_code, 200)
