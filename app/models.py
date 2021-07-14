from django.contrib.auth.models import AbstractUser
from django.db import models


class UserManager(models.Manager):
    def get_by_natural_key(self, username):
        return self.get(username=username)

class User(AbstractUser):
    def natural_key(self):
        return (self.username)
    pass


class Rate(models.Model):
    id = models.AutoField(primary_key=True)
    book = models.CharField(max_length=256, blank=False)
    title = models.CharField(max_length=256, blank=False)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_rate")
    rate = models.IntegerField()


class Review(models.Model):
    id = models.AutoField(primary_key=True)
    book = models.CharField(max_length=256, blank=False)
    title = models.CharField(max_length=256, blank=False)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_review")
    review = models.CharField(max_length=512, blank=False)
    timestamp = models.DateTimeField(auto_now_add=True)


class Status(models.Model):
    id = models.AutoField(primary_key=True)
    book = models.CharField(max_length=256, blank=False)
    title = models.CharField(max_length=256, blank=False)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_status")
    status =  models.CharField(max_length=32, blank=False)
