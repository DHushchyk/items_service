import os
import uuid

from django.db import models

from django.contrib.auth.models import AbstractUser
from django.utils.text import slugify


def item_image_file_path(instance, filename):
    _, extension = os.path.splitext(filename)
    filename = f"{slugify(instance.item.title)}-{uuid.uuid4()}{extension}"

    return os.path.join("uploads/items/", filename)


class ItemModel(models.Model):
    title = models.CharField(max_length=255, unique=True)
    price = models.DecimalField(max_digits=9, decimal_places=2)
    author = models.CharField(max_length=255)
    created_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.title


class ImageModel(models.Model):
    item = models.ForeignKey(ItemModel, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(blank=True, upload_to=item_image_file_path)

    def __str__(self):
        return f"{self.item} - {self.image}"
