# Generated by Django 3.1.3 on 2021-01-27 17:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0004_choices_iscorrect'),
    ]

    operations = [
        migrations.AddField(
            model_name='quiz',
            name='n_ofquestions',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='quiz',
            name='totalpoints',
            field=models.IntegerField(default=0),
        ),
    ]