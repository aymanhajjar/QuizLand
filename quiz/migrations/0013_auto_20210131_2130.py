# Generated by Django 3.1.5 on 2021-01-31 19:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0012_auto_20210128_0401'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='question',
            name='choices',
        ),
        migrations.RemoveField(
            model_name='question',
            name='timer',
        ),
        migrations.AddField(
            model_name='choices',
            name='thequestion',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='choices', to='quiz.question'),
        ),
    ]