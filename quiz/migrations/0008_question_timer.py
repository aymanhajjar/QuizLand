# Generated by Django 3.1.3 on 2021-01-27 19:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0007_quiz_description'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='timer',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
