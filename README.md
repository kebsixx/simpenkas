# Simpenkas Dashboard

Simpenkas Dashboard is a financial management application that helps you track income, expenses, and manage your financial data efficiently.

## Table of Contents
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication and authorization
- Income and expense tracking
- Financial reports and analytics
- Data visualization
- Export functionality for reports
- Responsive design for desktop and mobile

## Requirements

- Node.js (v14.0.0 or higher)
- npm or yarn
- MongoDB (v4.0 or higher)
- Git

## Installation

Follow these steps to set up the project locally:

1. Clone the repository:

```bash
git clone https://github.com/yourusername/simpenkas-dashboard.git
```

2. Navigate to the project directory:

```bash
cd simpenkas-dashboard
```

3. Install dependencies:

```bash
npm install
```

or if you're using yarn:

```bash
yarn install
```

## Configuration

1. Create a `.env` file in the root directory based on the `.env.example` file:

```bash
cp .env.example .env
```

2. Update the `.env` file with your configuration values:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/simpenkas
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## Usage

### Development Mode

To run the application in development mode:

```bash
npm run dev
```

or with yarn:

```bash
yarn dev
```

The application will be available at `http://localhost:3000` (or the port you specified in your .env file).

### Production Mode

To build and run the application in production mode:

1. Build the application:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

## API Documentation

The API documentation is available at `/api/docs` when the server is running. It provides detailed information about all available endpoints, request parameters, and response formats.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

For any questions or support, please open an issue in the GitHub repository or contact the maintainers.
