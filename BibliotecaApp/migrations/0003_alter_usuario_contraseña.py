# Generated by Django 5.0.6 on 2024-06-14 03:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('BibliotecaApp', '0002_remove_libro_disponibilidad_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usuario',
            name='contraseña',
            field=models.CharField(max_length=128),
        ),
    ]
