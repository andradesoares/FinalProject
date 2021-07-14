import json
from django.core import serializers
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseBadRequest
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_protect
from django.core.exceptions import ObjectDoesNotExist, ValidationError

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


from .models import User, Rate, Review, Status


def index(request):
    reviews = Review.objects.all().order_by('-id')[:5]
    status = Status.objects.all().order_by('-id')[:5]
    rate = Rate.objects.all().order_by('-id')[:5]
    return render(request, "index.html", {
        "reviews": reviews, 
        "status": status,
        "rate":rate, 
    })

def book(request, idBook):
    return render(request, "book.html", {"singleBook": idBook})

def login_view(request):
    # Attempt to sign user in

    # Get data
    data = json.loads(request.body)

    username = data.get("username", "")
    password = data.get("password", "")
    user = authenticate(request, username=username, password=password)
    # Check if authentication successful
    if user is not None:
        login(request, user)
        return JsonResponse({"message": "Log in successful."})
    else:
        return JsonResponse({"error": "Log in unsuccessful. Please try again."})




def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    # Get data
    data = json.loads(request.body)

    username = data.get("username", "")
    email = data.get("email", "")
    password = data.get("password", "")
    confirmation = data.get("confirmation", "")


    if password != confirmation:
        return JsonResponse({"error": "Passwords must match."})

        # Attempt to create new user
    try:
        user = User.objects.create_user(username, email, password)
        user.save()
    except IntegrityError:
        return JsonResponse({"error": "Username already taken."})

    login(request, user)
    return JsonResponse({"message": "Register successful."})

def review(request):
    # Get data
    data = json.loads(request.body)

    reviewBody = data.get("reviewBody", "")
    bookId = data.get("bookId", "")
    bookTitle = data.get("bookTitle", "")

    review = Review(book=bookId, user_id=request.user, review=reviewBody, title=bookTitle)
    try:
        review.full_clean()
        review.save()
    except ValidationError:
        print(ValidationError)
    return JsonResponse({"review": reviewBody, "user":request.user.username}, status=201)

def reviews(request):
    # Get data
    data = json.loads(request.body)

    bookId = data.get("bookId", "")

    reviews = Review.objects.filter(book=bookId).order_by("-timestamp")

    reviews_json = serializers.serialize('json', reviews, use_natural_foreign_keys=True)

    return HttpResponse(reviews_json, content_type="text/json-comment-filtered")

def rating(request):
    # Get data
    data = json.loads(request.body)

    ratingValue = data.get("rating", "")
    bookId = data.get("bookId", "")
    bookTitle = data.get("bookTitle", "")

    if request.user.is_authenticated:
        try:
            rating = Rate.objects.get(book=bookId, user_id=request.user)
            rating.rate = ratingValue
            rating.title = bookTitle
            rating.save()
            return JsonResponse({"rating":rating.rate}, status=201)
        except Rate.DoesNotExist:
            rate = Rate(book=bookId, user_id=request.user, rate=ratingValue, title=bookTitle)
            rate.save()
            return JsonResponse({"rating":"Rating sent successfully."}, status=201)
    else:            
        return JsonResponse({"rating":"Rating sent successfully."}, status=201)
    

def ratings(request):
    # Get data
    data = json.loads(request.body)

    bookId = data.get("bookId", "")
    if request.user.is_authenticated:
        try:
            rating = Rate.objects.get(book=bookId, user_id=request.user)
            return JsonResponse({"rating":rating.rate}, status=201)
        except Rate.DoesNotExist:
            return JsonResponse({"rating":0}, status=201)
    else:            
        return JsonResponse({"rating":0}, status=201)


def addlibrary(request):
    # Get data
    data = json.loads(request.body)

    status = data.get("status", "")
    bookId = data.get("bookId", "")
    bookTitle = data.get("bookTitle", "")
    if request.user.is_authenticated:
        try:
            library = Status.objects.get(book=bookId, user_id=request.user)
            library.status = status
            library.save()
            return JsonResponse({"status":library.status}, status=201)
        except Status.DoesNotExist:
            library = Status(book=bookId, user_id=request.user, status=status, title=bookTitle)
            library.save()
            return JsonResponse({"status":"Status sent successfully."}, status=201)
    else:
        return JsonResponse({"status":"Status sent successfully."}, status=201)

def status(request):
    # Get data
    data = json.loads(request.body)

    bookId = data.get("bookId", "")
    if request.user.is_authenticated:
        try:
            library = Status.objects.get(book=bookId, user_id=request.user)
            return JsonResponse({"status":library.status}, status=201)
        except Status.DoesNotExist:
            return JsonResponse({"rating":0}, status=201)
    else:
        return JsonResponse({"rating":0}, status=201)
        
def mylibrary(request, user):

    try:
        user_id = User.objects.get(username=user)
        reviews = Review.objects.filter(user_id=user_id).order_by("-timestamp")
        status_wishlist = Status.objects.filter(user_id=user_id, status="wishlist")
        status_toread = Status.objects.filter(user_id=user_id, status="toread")
        status_reading = Status.objects.filter(user_id=user_id, status="reading")
        status_read = Status.objects.filter(user_id=user_id, status="read")
        rate = Rate.objects.filter(user_id=user_id)
        return render(request, "login.html", {
            "reviews": reviews, 
            "status_wishlist": status_wishlist,
            "status_toread": status_toread, 
            "status_reading": status_reading, 
            "status_read": status_read, 
            "rate":rate, 
        })
    except User.DoesNotExist:
            return JsonResponse({"error":"error"}, status=201)