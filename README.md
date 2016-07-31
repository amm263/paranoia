# Paranoia
This is a simple blog engine focused on privacy. It uses Express, the Node.js web application framework, Mongodb and few other dependency specified in the *packages.json* file. Access to the blog is restricted with a password mechanism. 

To access the content of the blog, visitors must authenticate through a GET request, submitting a password or shared secret. 
Such as requesting *example.com/mysecret*. 
All unauthorized users are redirected to a default page. 

The intention is to allow access to only known users and forbid strangers or web crawlers, without a need for a user/password login system. Hence the name *paranoia*.


##Features
* Secret GET wall
* Add new Secrets
* Track Visits
* Add new Posts
* First time installation
* Admin Login
* Change password

##Todo
* UI/frontend
* Edit/Delete Posts
* Markdown formatting
* Automated backup
* Post Categories
* Pages
* Drafts
* Add more users
* Reviewer user role (can read Posts/Drafts)
* Editor user role (can edit Posts/Drafts)
* Admin user role (godmode)

## changelog
* 31-Jul-2016 Fixed some bugs, added ajax filled tables to display visits.
* 12-Jul-2016 Backend skeleton/proof of concept. 

