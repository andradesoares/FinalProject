
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login_view"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("review", views.review, name="review"),
    path("reviews", views.reviews, name="reviews"),
    path("rating", views.rating, name="rating"),
    path("ratings", views.ratings, name="ratings"),
    path("addlibrary", views.addlibrary, name="addlibrary"),
    path("status", views.status, name="status"),
    path("mylibrary/<str:user>", views.mylibrary, name="mylibrary"),
    path("books/<str:idBook>", views.book, name="book"),
]
