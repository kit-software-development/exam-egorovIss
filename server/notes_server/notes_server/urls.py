"""notes_server URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin

import core_user.views
import notes.views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^register/', core_user.views.register),
    url(r'^api/sync-test/', notes.views.sync_test),
    url(r'^add_note/', notes.views.add_note),
    url(r'^auth_user/', core_user.views.auth_user),
    url(r'^get_public/', notes.views.get_public),
    url(r'^delete_note/', notes.views.delete)

]
