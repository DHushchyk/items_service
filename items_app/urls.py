from django.urls import path, include
from rest_framework import routers

from items_app.views import index, detail, ItemViewSet, ImageViewSet

router = routers.DefaultRouter()
router.register("items", ItemViewSet)
router.register("images", ImageViewSet)

urlpatterns = [
    path("api/", include(router.urls)),
    path("", index, name="index"),
    path("item/<int:pk>/", detail, name="detail")
]

app_name = "items_app"
