from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from items_service.settings import MEDIA_URL
from items_app.models import Item, Image
from items_app.serializers import (
    ItemSerializer,
    ImageSerializer,
    MultipleImageSerializer
)


def index(request):
    return render(request, "index.html")


def detail(request, pk):
    context = {"id": pk}
    return render(request, "detail.html", context=context)


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer

    @action(detail=False, methods=["POST"], url_path="upload-images")
    def multiple_upload(self, request, *args, **kwargs):
        serializer = MultipleImageSerializer(data=request.data)
        if serializer.is_valid():
            images = serializer.validated_data.get("images")
            item = serializer.validated_data.get("item")

            if images:
                res_images = []
                for image in images:
                    created_image = Image.objects.create(item_id=item, image=image)
                    res_images.append({
                        "id": created_image.id,
                        "image": MEDIA_URL + str(created_image.image),
                        "item": created_image.item_id
                    })
                res = {"images": res_images}

            return Response(res, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
