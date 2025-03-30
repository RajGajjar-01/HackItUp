# Smart Kitchen Backend

Express backend API for the AI-Powered Smart Kitchen & Waste Minimizer system for restaurants.

## Features

- Authentication and user management
- Inventory tracking and management
- Recipe creation and management
- Waste recording and analysis
- Sales data tracking and analytics
- Integration with AI services via FastAPI

## Tech Stack

- Node.js with Express
- PostgreSQL database with Prisma ORM
- JWT authentication
- Integration with Python FastAPI for AI services

## Setup

### Prerequisites

- Node.js (v14+)
- PostgreSQL database
- Python FastAPI service for AI functionality (optional)

### Installation

1. Clone the repository
2. Install dependencies:

```
npm install
```

3. Configure your environment variables in `.env` file:

```
DATABASE_URL="postgresql://user:password@localhost:5432/smart_kitchen_db"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
FASTAPI_BASE_URL="http://localhost:8000"
```

4. Run Prisma migrations:

```
npx prisma migrate dev
```

5. Seed the database with sample data (optional, but recommended for testing):

```
npm run db:seed
```

6. Start the development server:

```
npm run dev
```

## Database Seeding

The seed script creates sample data for testing purposes:

- Two restaurants with unique names and contact information
- Three users per restaurant (owner, manager, staff) with password "password123"
- 30 inventory items per restaurant with varied quantities and expiry dates
- 15 recipes per restaurant with 2-5 random ingredients each
- 20 waste records per restaurant
- 50 sales records per restaurant spanning the last 90 days

To run the seed script:

```
npm run db:seed
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login existing user
- `GET /api/auth/me` - Get current user information

### Inventory

- `GET /api/inventory` - Get all inventory items
- `GET /api/inventory/expiring` - Get soon-to-expire items
- `GET /api/inventory/:id` - Get a specific inventory item
- `POST /api/inventory` - Add a new inventory item
- `PUT /api/inventory/:id` - Update an inventory item
- `DELETE /api/inventory/:id` - Delete an inventory item

### Recipes

- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/available` - Get recipes with available ingredients
- `GET /api/recipes/:id` - Get a specific recipe
- `POST /api/recipes` - Create a new recipe
- `PUT /api/recipes/:id` - Update a recipe
- `DELETE /api/recipes/:id` - Delete a recipe

### Waste Management

- `GET /api/waste` - Get all waste records
- `GET /api/waste/analytics` - Get waste analytics
- `GET /api/waste/:id` - Get a specific waste record
- `POST /api/waste` - Create a new waste record

### Sales

- `GET /api/sales` - Get all sales data
- `GET /api/sales/analytics` - Get sales analytics
- `POST /api/sales` - Record a new sale

### AI Services

- `POST /api/ai/inventory/image` - Process inventory image with AI
- `POST /api/ai/inventory/spoilage` - Detect food spoilage
- `GET /api/ai/predictions` - Get AI-based predictions
- `POST /api/ai/recipes` - Generate AI recipe suggestions
- `POST /api/ai/waste` - Analyze waste with AI

## AI Integration

The backend communicates with a FastAPI service for AI functionality:

1. Computer vision for inventory detection
2. Spoilage detection
3. Sales prediction
4. Waste analysis
5. Recipe generation

## Development

```
npm run dev
```

## Production

```
npm start
```
