from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.http import Http404
from django.core.paginator import Paginator
from django.contrib.auth.decorators import login_required
from django.http import Http404
from django.db.models import Q
from .models import *

# Create your views here.

def login_view (request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("home"))
        else:
            return render(request, "login.html", {
                "messagetext": "Invalid username and/or password."
            })
    else:
        return render(request, "login.html")

def logout_view (request):
    logout(request)
    return HttpResponseRedirect(reverse("home"))

def register (request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "register.html", {
                "messagetext": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "register.html", {
                "messagetext": "Username already taken."
            })
        login(request, user)

        thisuser = User.objects.get(username=request.user.username)
        userprof = profile.objects.create(owner=thisuser)
        userprof.save()

        return HttpResponseRedirect(reverse("home"))
    else:
        return render(request, "register.html")

def home (request):
    if request.user.is_authenticated:
        thisuser = User.objects.get(username=request.user.username)
        userinfo = profile.objects.get(owner=thisuser)
    else:
        thisuser = User.objects.none()
        userinfo = profile.objects.none()

    allquizzes = quiz.objects.all()
    latestquizzes = allquizzes.order_by('-date')[:5]

    allusersprofiles = profile.objects.all()
    orderedprofiles = allusersprofiles.order_by('-points')[:8]

    return render (request, "homepage.html", {
        "thisuserinfo": userinfo,
        "thisuser": thisuser,
        "quizzes": latestquizzes,
        "scoreprofs": orderedprofiles,
    })

def explore (request):
        if request.user.is_authenticated:
            thisuser = User.objects.get(username=request.user.username)
            userinfo = profile.objects.get(owner=thisuser)
        else:
            thisuser = User.objects.none()
            userinfo = profile.objects.none()

        allquizzes = quiz.objects.all()
        latestquizzes = allquizzes.order_by('-date')

        paginatedquizzes = Paginator(latestquizzes, per_page=5)

        page_num = int(request.GET.get("page", 1))

        if page_num > paginatedquizzes.num_pages:
            raise Http404

        quizzes = paginatedquizzes.page(page_num)
        
        if is_ajax(request):
            return render (request, "explore_quiz.html", {
                "quizzes": quizzes,
            })

        return render (request, "explore.html", {
                "thisuserinfo": userinfo,
                "thisuser": thisuser,
                "quizzes": quizzes,
            })

def showprofile (request, username):
    if request.user.is_authenticated:
        thisuser = User.objects.get(username=request.user.username)
        userinfo = profile.objects.get(owner=thisuser)
    else:
        thisuser = User.objects.none()
        userinfo = profile.objects.none()

    profileuser = User.objects.get(username=username)
    profuserinfo = profile.objects.get(owner=profileuser)
    quizcount = quiz.objects.filter(owner=profileuser).count()
    userquizzes = quiz.objects.filter(owner=profileuser).order_by('-date')
    noftaken = quizzestaken.objects.filter(takenby=profileuser).count()

    followercount = profuserinfo.followers.count()
    followingcount = profuserinfo.following.count() 

    if request.user in profuserinfo.followers.all():
        followed = True
    else:
        followed = False

    return render (request, 'profile.html', {
        "thisuserinfo": userinfo,
        "profuserinfo": profuserinfo,
        "thisuser": thisuser,
        "profuser": profileuser,
        "quizcount": quizcount,
        "userquizzes": userquizzes,
        "followingcount": followingcount,
        "followercount": followercount,
        "noftaken": noftaken,
        "followed": followed
    })

def create (request):
    if request.method == 'POST':
        owner = request.user
        quizname = request.POST['name']
        quizdesc = request.POST['desc']
        try:
            timer = request.POST['timer']
        except:
            timer = 0
        totalpoints = request.POST['totalpoints']
        nofq = request.POST['nofq']

        newquiz = quiz.objects.create(owner=owner, name=quizname, description=quizdesc, totaltime=timer, totalpoints=totalpoints, n_ofquestions=nofq)
        newquiz.save()

        i=1
        for i in range(1, int(nofq)+1):
            qname = request.POST['question'+str(i)]
            points = request.POST['pointfield'+str(i)] 
            newq = question.objects.create(quiz=newquiz, points=points, text=qname)
            newq.save()
            ++i
            for j in range(1, 5):
                try:
                    choicetext = request.POST['choice'+str(j)+'q'+str(i)]
                    if j==1:
                        iscorrect = True
                    else:
                        iscorrect = False
                    newchoice = choices.objects.create(choice=choicetext, iscorrect=iscorrect, thequestion=newq)
                except:
                    choicetext = ''
                

        userinfo = profile.objects.get(owner=owner)
        return render (request, "create.html", {
            "thisuserinfo": userinfo,
            "thisuser": owner,
        })    

    else:
        thisuser = User.objects.get(username=request.user.username)

        userinfo = profile.objects.get(owner=thisuser)

        return render (request, "create.html", {
            "thisuserinfo": userinfo,
            "thisuser": thisuser,
            
        })

@login_required(login_url='/login')
def editprof (request):
    thisuser = User.objects.get(username=request.user.username)
    userinfo = profile.objects.get(owner=thisuser)

    if request.method == "GET":

        userinfo = profile.objects.get(owner=thisuser)

        return render(request, "edit.html", {
            "thisuser": thisuser,
            "userinfo": userinfo,
        })

    elif request.method == 'POST':
        username = request.POST['username']
        ppic = request.FILES['updatepic'] if 'updatepic' in request.FILES else False

        if len(username)>20:
           return render(request, "edit.html", {
        "thisuser": thisuser,
        "userinfo": userinfo,
        "usermsg": 'This username is too long choose a shorter one!',
        }) 

        if username == request.user.username:
            pass
        elif len(User.objects.filter(username=username)) > 0:
           return render(request, "edit.html", {
        "thisuser": thisuser,
        "userinfo": userinfo,
        "usermsg": 'This username is already taken, please choose another one!',
        })  

        if ppic:
            if ppic.size > 5242880:
                return render(request, "edit.html", {
            "thisuser": thisuser,
            "userinfo": userinfo,
            "picmsg": 'Your picture cannot be bigger than 5MB!',
        })   

    userinfo = profile.objects.get(owner=thisuser)
    if ppic:
        thisuser.ppic = ppic
    thisuser.username = username
    thisuser.save()

    return render (request, "edit.html", {
        "thisuser": thisuser,
        "userinfo": userinfo,
        "successmsg": 'Updated Successfully!'
    })   
    
def followed(request):
    thisuser = User.objects.get(username=request.user.username)

    userinfo = profile.objects.get(owner=thisuser)

    followedusers = profile.objects.filter(followers=thisuser)

    allquizzes = quiz.objects.none()

    for followeduser in followedusers:
        allquizzes |= quiz.objects.filter(owner=followeduser.owner)

    latestquizzes = allquizzes.order_by('-date')

    paginatedquizzes = Paginator(latestquizzes, per_page=5)

    page_num = int(request.GET.get("page", 1))

    if page_num > paginatedquizzes.num_pages:
        raise Http404

    quizzes = paginatedquizzes.page(page_num)
    
    if is_ajax(request):
        return render (request, "explore_quiz.html", {
            "quizzes": quizzes,
        })

    return render (request, "followed.html", {
            "thisuserinfo": userinfo,
            "thisuser": thisuser,
            "quizzes": quizzes,
        })

def quizpage(request, quizname):
    thisquiz = quiz.objects.get(name=quizname)
    if request.user.is_authenticated:
        thisuser = User.objects.get(username=request.user.username)
        userinfo = profile.objects.get(owner=thisuser)
    else:
        thisuser = User.objects.none()
        userinfo = profile.objects.none()

    if request.method == "POST":
        total = request.POST['total']
        questionsofquiz = question.objects.filter(quiz=thisquiz)
        qchoices = choices.objects.none()
        

        taken = quizzestaken.objects.get(quiztaken=thisquiz, takenby=request.user)
        taken.pointseanred = total
        taken.save()
        userinfo.points += int(total)
        userinfo.save()
        avg = int(thisquiz.totalpoints)/2

        
        serialq = questionresserial(questionsofquiz, many=True)

        return JsonResponse(serialq.data, safe=False)

    else:
        if request.user.is_authenticated:
            takenquiz = quizzestaken.objects.filter(quiztaken=thisquiz, takenby=thisuser).count()

            if takenquiz == 0:
                taken = False
                result = 0
            else:
                taken = True
                result = quizzestaken.objects.get(quiztaken=thisquiz, takenby=thisuser).pointseanred
        else:
            taken = False
            result = 0

        return render (request, "quizpage.html", {
            "thisuserinfo": userinfo,
            "thisuser": thisuser,
            "quiz": thisquiz,
            "taken": taken,
            "result": result
        })

    
def quizget (request, quizname):
    thisquiz = quiz.objects.get(name=quizname)
    return JsonResponse(thisquiz.serialize())
    
def questionget (request, quizname, qnumber):
    thisquiz = quiz.objects.get(name=quizname)
    questions = question.objects.filter(quiz=thisquiz)

    try:
        thisq = questions[qnumber-1]
    except:
        thisq = question.objects.none()

    qchoices = choices.objects.filter(thequestion=thisq)
    serialq = questionserial(thisq)
    return JsonResponse(serialq.data, safe=False)

def getresults(request, quizname):
    thisquiz = quiz.objects.get(name=quizname)
    questionsofquiz = question.objects.filter(quiz=thisquiz)
    qserial = questionresserial(questionsofquiz, many=True)
    return JsonResponse(qserial.data, safe=False)

@login_required(login_url='/login')   
def follow(request, targetuser):
    targetus = User.objects.get(username=targetuser)
    targetuserprofile = profile.objects.get(owner=targetus)
    thisuserusername = request.POST['thisuser']
    thisuser = User.objects.get(username=thisuserusername)
    targetuserprofile.followers.add(thisuser)
    targetuserprofile.save()
    thisuserprofile = profile.objects.get(owner=thisuser)
    thisuserprofile.following.add(targetus)
    thisuserprofile.save()
    serialprof = serialfollows(targetuserprofile)
    return JsonResponse(serialprof.data, safe=False)

@login_required(login_url='/login')
def unfollow(request, targetuser):
    targetus = User.objects.get(username=targetuser)
    targetuserprofile = profile.objects.get(owner=targetus)
    thisuserusername = request.POST['thisuser']
    thisuser = User.objects.get(username=thisuserusername)
    targetuserprofile.followers.remove(thisuser)
    targetuserprofile.save()
    thisuserprofile = profile.objects.get(owner=thisuser)
    thisuserprofile.following.remove(targetus)
    thisuserprofile.save()
    serialprof = serialfollows(targetuserprofile)
    return JsonResponse(serialprof.data, safe=False)
    
def search(request):
    query = request.GET['q']

    results = quiz.objects.filter(name__startswith=query)

    if results.count() == 0:
        results = quiz.objects.filter(owner__username__startswith=query)
    elif len(query) > 2:
        results = quiz.objects.filter(Q(name__startswith=query) | Q(owner__username__startswith=query))
    qs = results.order_by('name', 'owner')
    return JsonResponse([result.serialize() for result in qs], safe=False)

def quiztaken(request, quizname):
    thisuser = User.objects.get(username=request.user.username)
    userinfo = profile.objects.get(owner=thisuser)
    thisquiz = quiz.objects.get(name=quizname)
    taken = quizzestaken.objects.create(quiztaken=thisquiz, takenby=request.user, pointseanred=0)

    taken = True
    result = 0

    return HttpResponse()

def is_ajax(request):
    return request.META.get("HTTP_X_REQUESTED_WITH") == "XMLHttpRequest"