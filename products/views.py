from rest_framework import generics
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer


class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all().order_by("-created_at")
    serializer_class = ProductSerializer


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all().order_by("name")
    serializer_class = CategorySerializer