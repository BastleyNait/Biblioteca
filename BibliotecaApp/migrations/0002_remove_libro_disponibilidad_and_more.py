# Generated by Django 5.0.6 on 2024-06-13 21:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('BibliotecaApp', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='libro',
            name='disponibilidad',
        ),
        migrations.RemoveField(
            model_name='usuario',
            name='nombreUsuario',
        ),
        migrations.RemoveField(
            model_name='usuario',
            name='tipoUsuario',
        ),
        migrations.AddField(
            model_name='alumno',
            name='estado',
            field=models.IntegerField(default=1),
        ),
        migrations.AddField(
            model_name='libro',
            name='estado',
            field=models.IntegerField(default=1),
        ),
        migrations.AddField(
            model_name='usuario',
            name='estado',
            field=models.IntegerField(default=1),
        ),
    ]
