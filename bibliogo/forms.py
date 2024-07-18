from typing import Any
from django import forms
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import User



class LogInForm(AuthenticationForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.update({
            'class': 'form-control',
            'required': '',
            'name': 'username',
            'id': 'username',
            'type': 'text',
            'placeholder': 'Nombre de usuario',
            'maxlength': '30',
            'minlength': '6',
        })
        self.fields['password'].widget.attrs.update({
            'class': 'form-control',
            'required': '',
            'name': 'password1',
            'id': 'password1',
            'type': 'password',
            'placeholder': 'Contraseña',
            'maxlength': '22',
            'minlength': '8'
        })

    username = forms.CharField(max_length=20, label=False)

    class Meta:
        model = User
        fields = ('username', 'password', )