# Ratto - Wishlist Manager

A full-stack application built with Django and React to manage wishlists of items to purchase.

## Features

- User authentication and account management.
- Create, edit, and delete wishlists.
- Manage your wishlist's items and sort and filter them by name or price.
- Add items to wishlists with details like price, priority, and links.
- Manage the purchase status of items.

## Tech Stack

### Backend

- Django
- Django Rest Framework (DRF)
- PostgreSQL

### Frontend

- Next.js

## Installation

### Prerequisites
- Python 3.13+
- Node.js 20+
- pnpm
- PostgreSQL

### Backend Setup

1. Clone the repository
   ```
   git clone https://github.com/capaths/ratto.git
   cd ratto
   ```

2. Create and activate a virtual environment
   ```
   python -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies
   ```
   pip install -r requirements.txt
   ```

4. Set up environment variables
   - Create a `.env` file in the root directory
   - Add the following content:
     ```
     DEBUG=True
     ```

5. Run migrations
   ```
   python manage.py migrate
   ```

6. Start the Django server
   ```
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory
   ```
   cd frontend
   ```

2. Install dependencies
   ```
   pnpm install
   ```

3. Start the development server
   ```
   pnpm start
   ```
