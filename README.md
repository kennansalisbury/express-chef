# Express Auth

This is boilerplate code for user auth created for use in my future projects. Node/express app with basic local user authentication, Facebook OAuth, and GitHub OAuth.

## What it includes

* OAuth for Facebook and Github
* Passport and passport-local for authentication
* Sequelize user model / migration
* Settings for PostgreSQL
* Sessions to keep user logged in between pages
* Flash messages for errors and successes
* Passwords that are hashed with BCrypt
* EJS Templating and EJS Layouts

### User Model

| Column Name | Data Type | Notes | 
| ---------------- | ------------- | ----------------------------- |
| id | Integer | Serial Primary Key |
| createdAt | Date | Auto-generated |
| updatedAt | Date | Auto-generated |
| firstname | String | Required |
| lastname | String | - |
| username | String | - |
| email | String | Must be unique / used for login |
| password | String | Stored as a hash |
| photoURL | String | Profile Picture |
| admin | Boolean | Defaults to false |
| bio | Text | - |
| birthday | Date | - |
| facebookId | String | - |
| facebookToken | String | - |
| githubId | String | - |
| githubToken | String | - |


### Default Routes

| Method | Path | Location | Purpose |
| ------ | --------------- | -------------- | ----------------- |
| GET | / | index.js | homepage |
| GET | * | index.js | Render error page |
| GET | /auth/login | auth.js | Login form |
| GET | /auth/signup | auth.js | Signup form |
| POST | /auth/login | auth.js | Login user |
| POST | /auth/signup | auth.js | Creates user |
| GET | /auth/logout | auth.js | Removes session info |
| GET | /profile | profile.js | Regular user profile |
| GET | /profile/admin | profile.js | Admin profile |
| GET | /profile/repos | profile.js | Grab user's GH repos |


## Steps To Use

#### 1. Clone with different name

```
git clone <repo_link> <new_name>
```

#### 2. npm install node modules in package.json

```
npm install
```
(or `npm i`)

#### 3. Customize title with project name

Remove/update defaults. Ex:

* Title in `layout.ejs`
* Logo in navbar
* Description of repo link in `package.json`
* New README for project
* Footer

#### 4. Create new database

```
createdb <new_db_name>
```

#### 5. Update `config.json`

* Change database name
* Other settings likely already correct (check username, password, dialect)

#### 6. Check models and migrations for relevance to project

i.e. update database fields based on what the project requires or does not require

#### 7. Run the migrations

```
sequelize db:migrate
```

#### 8. Add a `.env` file with:

* SESSION_SECRET: any string (can be random - usually a hash in production)
* BASE_URL
* FACEBOOK_CLIENT_ID
* FACEBOOK_SECRET
* GITHUB_CLIENT_ID
* GITHUB_SECRET

> Note: create new apps on Facebook and Github for new projects

> Note: if NOT using OAuth - switch to directions on `master` branch for directions on local auth

#### 9. Run server; make sure it works

```
nodemon
```

or

```
node index.js
```

#### 10. Create new repo on Github

* delete old remote to origin (`git remote remove origin`)
* add new repo link as remote (`git remote add origin <new_link>`)
* add, commit, push

> Note: don't make commits from the new project to your auth boilerplate. Keep it PRISTINE for other future projects.