# Wishlist Manager

A web application that allows users to create and manage wishlists by simply adding product links. The system automatically scrapes product information including name, description, and price.

## Features

- **User Authentication**: Sign up and log in with email.
- **Wishlist Management**: Create, edit, and delete multiple wishlists.
- **Product Scraping**: Automatically extract product details from URLs based on site's JSON-LDs and HTML meta tags, or using custom scrapers.
- **Custom scraping**: With some Python, you can create your own scrapers for sites where default scrapers are not
  enough. Check the [Custom Scrapers](#custom-scrapers) section for more information.

### Planned Features

- **Periodic Scraping:** Track prices periodically to know when a product is on discount.

## Tech Stack

- **Backend**: Django with Django REST Framework
- **Frontend**: React.js
- **Database**: SQLite
- **Authentication**: JWT-based authentication

## Run Development Servers

### Prerequisites
- Python 3.13+
- Node.js 22+
- pnpm
- Poetry

### Backend Setup

- Clone the repository:
   ```bash
   git clone https://github.com/pankandev/ratto.git
   cd ratto
   ```
- Set up Python poetry:
   ```bash
   poetry install
   poetry env activate
   ```
- Run database migrations:
   ```bash
   python manage.py migrate
   ```
- Run Django development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
- Install dependencies:
   ```bash
   cd frontend/app
   pnpm install
  ```
- Start development server:
   ```bash
   pnpm start 
   ```

## Usage

1. Visit http://localhost:8000/
2. Register a new account or log in with your email.
3. Create a new wishlist.
4. Add products to your wishlist from the add product modal by pasting product URLs.
5. View and manage your wishlists and products.

## Custom Scrapers

You can also create your own scrapers that can be used to extract product information from specific sites. This can be
done by creating a Python class inside the `custom_scrapers` directory that inherits `BaseSiteScraper` at
`wishlists.scrapers.base_site_scraper`. For more information, see the documentation of that class.

## API Documentation

The API endpoints are available at `/api/v1/` and include:

- `/api/v1/auth/` - Account management.
- `/api/v1/wishlists/` - Wishlist management.
- `/api/v1/products/` - Product management.
