# Generated by Django 3.1.3 on 2021-01-28 01:47

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0008_question_timer'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='userprofile', to=settings.AUTH_USER_MODEL),
        ),
    ]