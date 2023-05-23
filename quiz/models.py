from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.humanize.templatetags import humanize
from django.utils import timezone
from django.core import serializers
from rest_framework import serializers
# Create your models here.

class User(AbstractUser):
    ppic = models.ImageField(upload_to='gallery', default="gallery/default.jpg", blank=True)

class quiz(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="quizzes")
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    totalpoints = models.IntegerField(default=0)
    n_ofquestions = models.IntegerField(default=0)
    date = models.DateTimeField(default=timezone.now)
    totaltime = models.IntegerField(default=0)

    def __str__(self):
        return self.name

    def get_date(self):
        return humanize.naturaltime(self.date)
    
    def serialize(self):
        return {
            'name': self.name,
            'points': self.totalpoints,
            'nofq': self.n_ofquestions,
            'time': self.totaltime,
            'description': self.description,
            'owner': self.owner.username,
            'date': self.date
        }

class serialquiz(serializers.ModelSerializer):
    class Meta:
        model = quiz
        fields = ('name', 'totalpoints', 'n_ofquestions', 'totaltime')

class quizzestaken(models.Model):
    quiztaken = models.ForeignKey(quiz, on_delete=models.CASCADE, related_name="quiztaken")
    takenby = models.ForeignKey(User, on_delete=models.CASCADE, related_name="takenquizzes", null=True)
    pointseanred = models.IntegerField(default=0)

class question (models.Model):
    quiz = models.ForeignKey(quiz, on_delete=models.CASCADE, related_name="questions")
    points = models.FloatField()
    text = models.TextField()

    def __str__(self):
        return self.text

    def serialize(self):
        return {
            'text': self.text,
            'points': self.points
        } 

class questionserial(serializers.ModelSerializer):
    choices = serializers.SerializerMethodField()

    class Meta:
        model = question
        fields = ('text', 'points', 'choices')

    def get_choices(self, instance):
        choicesofq = choices.objects.filter(thequestion=instance)
        randchoices = choicesofq.order_by('?')
        serialchoices = choiceserial(randchoices, many=True)
        return serialchoices.data

class questionresserial(serializers.ModelSerializer):
    correctchoice = serializers.SerializerMethodField()

    class Meta:
        model = question
        fields = ('text', 'points', 'correctchoice')

    def get_correctchoice(self, instance):
        choiceofq = choices.objects.get(thequestion=instance, iscorrect=True)
        return choiceofq.choice

class choices (models.Model):
    choice = models.TextField()
    iscorrect = models.BooleanField(default=False)
    thequestion = models.ForeignKey(question, on_delete=models.CASCADE, related_name="choices", null=True)

    def __str__(self):
        return self.choice

    def serialize(self):
        return {
            'text': self.choice,
            'iscorrect': self.iscorrect
        } 

class choiceserial(serializers.ModelSerializer):
    class Meta:
        model = choices
        fields = ('choice', 'iscorrect')

class profile (models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="userprofile")
    points = models.IntegerField(default=0)
    quizzes_taken = models.IntegerField(default=0)
    followers = models.ManyToManyField(User, related_name="followed_profiles", blank=True)
    following = models.ManyToManyField(User, related_name="following_profiles", blank=True)

    def __str__(self):
        return self.owner.username

class serialfollows(serializers.ModelSerializer):
    followercount = serializers.SerializerMethodField()
    followingcount = serializers.SerializerMethodField()

    class Meta:
        model = profile
        fields = ('followercount', 'followingcount')

    def get_followercount(self, instance):
        count = instance.followers.count()
        return count

    def get_followingcount(self, instance):
        count = instance.following.count()
        return count
