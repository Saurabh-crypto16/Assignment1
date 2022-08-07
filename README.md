# Assignment1

Project Url - https://assignemnt-skrate.herokuapp.com/
<br>
Video Url - https://drive.google.com/file/d/1gdPSwnbEInSzpPtNG0iUihtBLnhohODc/view?usp=sharing
<br>
Log File Url - https://drive.google.com/file/d/1_egUdLit0k49cWMvf2ZOlWrEGv0y9_9X/view?usp=sharing
<br>
API Documentation URL - https://assignemnt-skrate.herokuapp.com/doc

Steps to run:
1. Open postman or insomnia
2. copy the project url provided above and use it as base url to run all the routes 

Steps to install:

1. Clone the repo using  ```git clone https://github.com/Saurabh-crypto16/Assignment1.git```
2. Open the project in VS Code and install all the dependencies using ```npm install```
3. Create a .env file and save PORT variable and MONGOURI variable to connect to database
4. Once the dependencies are installed start the server using  ```npm start```

## Routes

<!-- eslint-disable no-undef -->

``` js
POST  /users/new
Description : To create a new user
returns : Bearer Token
```
<!-- eslint-disable no-undef -->

``` js
POST  /tickets/new
Description : To create a new ticket
returns : Ticket Id
```

<!-- eslint-disable no-undef -->

``` js
GET  /tickets/all
Description : To get all the tickets
returns : Json response containing all the ticket details
```

<!-- eslint-disable no-undef -->

``` js
GET  /tickets/all
Description : To get all the tickets
returns : Json response containing all the ticket details
```

<!-- eslint-disable no-undef -->

``` js
GET  /tickets/
Description :
/tickets/?status=open/close returns tickets according to status
/tickets/?title= searches for the particular title
/tickets/?priority=low/medium/high returns ticket according to priority
returns : Json response containing corresponding tickets details
```


<!-- eslint-disable no-undef -->

``` js
POST  /tickets/delete
Description : To delete a ticket
returns : ID of the deleted ticket
```

<!-- eslint-disable no-undef -->

``` js
POST  /tickets/markAsClosed
Description : change status of the ticket based on the given business logic
returns : Appropriate response message
```
