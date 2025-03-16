
# Simpenkas







Simpenkas is a web application built with Laravel and Filament.


## Installation Guide


Follow these steps to clone and set up the Simpenkas project on your local machine:








### Prerequisites


- PHP 8.1 or higher
- Composer
- Node.js and npm
- MySQL or another database supported by Laravel
- Git


### Step 1: Clone the Repository


```bash
git clone https://github.com/kebsixx/simpenkas.git
```


### Step 2: Navigate to the Project Directory


```bash
cd simpenkas
```


### Step 3: Install PHP Dependencies


```bash
composer install
```


### Step 4: Install JavaScript Dependencies














```bash
npm install
```


### Step 5: Create Environment File


Copy the example environment file:


```bash
cp .env.example .env
```


### Step 6: Generate Application Key


```bash
php artisan key:generate
```


### Step 7: Configure Database

Edit the `.env` file and set your database connection details:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=simpenkas
DB_USERNAME=root
DB_PASSWORD=
```

### Step 8: Run Migrations

```bash
php artisan migrate
```

### Step 9: Seed the Database (Optional)

```bash
php artisan db:seed
```

### Step 10: Build Assets

```bash
npm run dev
```

### Step 11: Start the Development Server

```bash
php artisan serve
```

The application will be available at http://localhost:8000

## Usage

After installation, you can access the application in your web browser. The Filament admin panel is available at http://localhost:8000/admin.

## License


This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
