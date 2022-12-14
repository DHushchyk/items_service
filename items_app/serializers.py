from rest_framework import serializers

from items_app.models import ItemModel, ImageModel


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageModel
        fields = "__all__"


class ItemSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)

    class Meta:
        model = ItemModel
        fields = ("id", "title", "price", "author", "images", "created_at")


class MultipleImageSerializer(serializers.Serializer):
    item = serializers.IntegerField()
    images = serializers.ListField(child=serializers.ImageField())
