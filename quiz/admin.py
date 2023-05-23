from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(User)
admin.site.register(quiz)
admin.site.register(question)
admin.site.register(profile)
admin.site.register(choices)
admin.site.register(quizzestaken)