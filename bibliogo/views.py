from django.shortcuts import redirect, render
from django.contrib.auth import login, logout, authenticate
from .forms import LogInForm
from django.contrib.auth.decorators import login_required
# Create your views here.
@login_required
def table(request):
    return render(request, 'table.html')
@login_required
def form(request):
    return render(request, 'form.html')

# login 



def user_login(request):
    if request.method == "GET":
        return render(request, 'login.html', {
            'form': LogInForm
        })
    else:
        user = authenticate(
            request, username=request.POST['username'], password=request.POST['password']
        )
        if user is None:
            print("El usuario o la contraseña son incorrectos")
            return render(request, 'login.html', {
                'form': LogInForm,
                'error': 'El usuario o la contraseña son incorrectos'
            })
        else:
            print('estas siendo redirigido')
            login(request, user)
            return redirect('home')


def user_logout(request):
    logout(request)
    return redirect('login')