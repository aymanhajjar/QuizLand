from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("", views.home, name="home"),
    path("explore", views.explore, name="explore"),
    path("profile/<str:username>", views.showprofile, name="profile"),
    path("create", views.create, name="create"),
    path("edit", views.editprof, name="edit"),
    path("followed", views.followed, name="followed"),
    path("quiz/<str:quizname>", views.quizpage, name="quiz"),
    path("quizget/<str:quizname>", views.quizget, name="quizget"),
    path("getq/<str:quizname>/<int:qnumber>", views.questionget, name="qget"),
    path("getresults/<str:quizname>", views.getresults, name="resget"),
    path("profile/<str:targetuser>/follow", views.follow, name="follow"),
    path("profile/<str:targetuser>/unfollow", views.unfollow, name="unfollow"),
    path("search", views.search, name="search"),
    path("quiztaken/<str:quizname>", views.quiztaken, name="quiztaken"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)