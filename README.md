
## Description
    With this application you are able to rate review, and add books to a library. It uses the google book API to get all necessary informations about the books. There are three main pages the first one its home where you can see the latests activities. There is the book itself page, there you can rate, add a review and add the book to your library. The last page is where you can visit the librarys form the others users of the site and see the activity. This application heavily uses the fetch API to make the requests to the application backend and to the google API.

## Files
    0001_initial.py: first migration
    0002_auto_20201002_1750.py: migration to create the rate, review and status table
    __init__py: marks a python directory
     book.js: handles the ajax request regarding the books features
    index.js: handles the ajax request regarding login, logout and register
    style.css: applies style to the applcation
    book.html: its the page where the informations about the book its shown, and whre the user its able to  with each book
    index.html: its the front page of the application
    login.html: its the user library page of the application
    latyout.html: provides the base to all the pages
    models.py: file create to register the tables
    urls.py: manages the urls of the the django project
    views.py manages the backend of the django project
    settings.py: stores the general setting to the django project
    manage.py: executes tasks of the django project
   
    

## Justification
    On this project I tried to apply all the tools shown throughout the course. I also made use of an API, something that was taught on the course, but that was not used on any project.