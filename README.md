# Quizland Capstone Project

## Overview

---

    Capstone project for CS50W course from HarvardX. I decided to make a website that allows users to create and take quizzes, and added a scoreboard to give users a sense of competitiveness.

## Idea and implementation

---

The website is fairly complex, featuring a databse to store quizzes and users, a back-end that uses Django, and a front-end implemented using HTML, CSS and JavaScript. The project includes a main app called "quiz" and a "media" folder to store the user images.

> ### The Database
>
> For the database, I created the following tables:

- A "quiz" table which is used to store the name of the quiz, its description, the total points, the number of questions, the date posted and the time limit if there is any. It also links the quiz to its owner which is a User model.
- A "question" table to store the actual text of the question, and its points. It takes a Quiz model as a foreign key.
- A "choices" table to store the choices of every question. All choices are linked to a foreign key which is the Question model they correspond to. They also have a boolean "iscorrect" field to return if a choice is correct or not.
- A "quizzestaken" table to show what quizzes have been taken by which users. This is used to prevent the user from taking the same quiz twice.
- A "profile" table to store information about the user, like the number of followers and followings, the number of quizzes taken and the total points they have earned. Each profile is linked to a User model.
- Added a "ppic" field to the User model to store the profile pictures of users.

> ### Pages and URLs
>
> The website features about 10 different HTML pages and many URLs each having a different purpose:

- A "layout.html" page that implements the inital layout that will be used on all pages, and includes all necessary files and libraries.
- A "homepage.html" that serves as the homepage of the website, and shows some of the latest quizzes posted, and the daily scoreboard which shows the top 8 users of the website according to earned points.
- A "login.html" and "register.html" which show the user the corresponding forms to allow him/her to log in or sign up for the website.
- An "explore.html" page that shows all the quizzes posted on the webiste, ordered by descending post date and making use of Django's pagination feature and AJAX to only show a specific number of quizzes as the user scrolls down.
- A "followed.html" page that shows quizzes from users the logged-in user has followed.
- A "create.html" page which contains a dynamic form to allow the user to create his own quizzes.
- A "quizpage.html" which allows the user to take a chosen quiz. The quiz gets dynamically loaded from the server as the user progresses. At the end, the result is shown and stored to the database.
- A "profile.html" page to show the requested user profile, containing buttons to follow or unfollow a user, or edit the profile if the visitor is its owner.
- An "edit.html" page to allow the user to make changes to his/her profile.

Different URLs are stored in the urls.py file, which defines the paths the user can follow to access a certain page.

For example, a user can visit "/login" to enter the login page. He can also visit "profile/{username}" to visit a specific user's profile, and so on.

> ### Functions and views
>
> Different functions are defined in views.py to give the users different functionalities like logging-in, signing up and returning pages and JSON reponses. Some of the most important functions include:

- `home(request)`: returns the homepage after querying the databse for the latest 5 quizes using a syntax like `quiz.objects.all().order_by('-date')[:5]`, it also returns the top 8 users for the scoreboard using a similar syntax.
- `explore(request)`: gets all the quizzes from the database and uses Django's pagination to show only 5 quizes per page. When the user requests the next page using an AJAX call, the function detects the ajax call using `if is_ajax()` and returns the next 5 quizzes or a 404 error if there are no more pages using `raise Http404`
- `create(request)`: returns the "create.html" page if the request is of type 'GET', otherwise, reads the 'POST' data submitted by the form and stores it. The data is divided into the main quiz info, which is directely stored into the database using `quiz.objects.create()`, the questions and the choices. Using 2 for loops, the questions and choices are stored respectively by turn into the database.
- `quizpage(request, quizname)`: if the request is of type 'GET', this function returns the main quiz page which contains the information about the quiz and allows the user to start it. Once the user submits the results, the function stores the total returned by the AJAX call into the database and updates the points earned in the "quizzestaken" model. It then returns the questions of the quiz in a JSON format to AJAX call to process and show the results. Most of the computation of the quiz results is done on the client-side using JavaScript.
- `quiztaken(request, quizname)`: this function is called as soon as the user starts the quiz by an AJAX POST request, so that it can update the "quizzestaken" model with the relevant details. This prevents the user from retaking the quiz by reloading or leaving the page.
- `questionget (request, quizname, qnumber)`: This is one of the main function used in the quiz. As the user clicks 'Next' in the quiz, this function gets called by an AJAX request so that it can return the next question. It takes as arguments the name of the quiz and the number of the question requested, which will be used to get the corresponding question from the database and return it to the user in JSON format.
- `search(request)`: this function returns the search results as the user types in a query in the search bar. It can search either by quizname or username, and returns the filtered quizzes in JSON format. The function first searches by quizname, if no results were found, it would then search by username. It can also search by usernames if the query lenght is more than 2 characters.
- `follow(request, targetuser)`: The follow and unfollow functions take as an argument the target user's username, and update the corresponding profile in the database to include or remove the requesting user, using functions like `.add(user)` or `.remove(user)`.

The remaining functions provide similar functionalities in a similar way.

> ### JavaScript
>
> JavaScript is the most important element of this website, since it handles all the interactions between the user and the quizzes.

To make asynchronous calls to the database, JQuery and AJAX were used.

The most important functionality JS offers in this project is the ability to dynamically load the questions as the user progresses in the quiz. This would be better than loading all the questions at once and including them in the HTML.

It is also used to compute the final result of the quiz. When the quiz starts, all of its details are requested from the server by an AJAX call, which then plugs-in the information on the page. This includes the number of questions, the timer if there is any and the name of the quiz. A 'for' loop then iterates over the number of questions to append an empty result line to the final results page.

After filling in the necessary information and defining the variables, questions are requested one by one also using AJAX and filled-in in a pre-set HTML div. For each question, its choices are also requested and loaded, but here comes the important part. Each choice has a value of "iscorrect" to it. As the user chooses one of the choices, a JS function gets called using `onkeyup()` which checks if the chosen radio button is the correct choice. If it is, the points of the question are added to an array which stores the points the user has earned on each question. Otherwise, if the choice is wrong, it stores a value of 0.

At the end, a function adds all of the values in the array to get the final result. After requesting and getting the questions from the server by AJAX on the results page, to show if a question has been answered correctly or not, a function loops over the points array and check if an answer is correct or not then shows it on the page. If a value of 0 is detected, then the choice was obviously wrong, otherwise it would be correct.

Some of the most important functions used:

- `startquiz(i)`: triggered by the start button on the initial quiz page, and takes as argument the name of the quiz which it will then use to request to needed information from the server and store them in variables. It then starts the timer and calls the function that loads the first question.
- `showqsteps ()`: for each question in the quiz, this function appends a step at the bottom of the page using a 'for' loop.
- `showq(n)`: this function switches tabs, or more specifically loads the requested question. It takes as an argument 'n' which is the step requested, '1' for example if the user wants to go to the next step. It checks if the 'tab' requested is the final tab, if not, it will request a question from the server and plug-in the information on the page. If the final tab is requested, it would return a page which asks the user to submit the quiz, and shows which questions were answered and which were not. When the user clicks submit, a function posts the results and requests the next page, which is the final page + 1. In this case, the results returned are shown to the user.

Similar functions were used for the 'create' page and to implement other functionalities.

> ### How to run

After installing the required libraries mentioned in the 'requirements.txt' file, you would just have to run `python manage.py runserver` on the main directory of the project and access the shown URL in a browser.

The password to all the accounts is '123'

> ### End Notes

To end, I want to thank all the CS50 staff for putting together such an amazing course!
