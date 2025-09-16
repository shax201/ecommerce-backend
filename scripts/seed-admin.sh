#!/bin/bash

# Admin Seeding Script
# This script seeds the database with admin users and permissions

echo "🚀 Starting Admin Seeding Process..."
echo "====================================="

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ Error: bun is not installed. Please install bun first."
    echo "   Visit: https://bun.sh/docs/installation"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found. Make sure to set up your environment variables."
    echo "   Create a .env file with DATABASE_URL=mongodb://localhost:27017/ecommerce"
fi

# Run the admin seed script
echo "🔧 Running admin seed script..."
bun run seed:admin

# Check if the command was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Admin seeding completed successfully!"
    echo "====================================="
    echo "✅ Admin users created with full permissions"
    echo "✅ Default permissions and roles created"
    echo ""
    echo "🔐 Default Admin Credentials:"
    echo "   Super Admin: admin@ecommerce.com / Admin123!@#"
    echo "   Manager: manager@ecommerce.com / Manager123!@#"
    echo "   Viewer: viewer@ecommerce.com / Viewer123!@#"
    echo ""
    echo "⚠️  Important: Change these passwords after first login!"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. Start your backend: bun dev"
    echo "   2. Start your frontend: cd front-end && bun dev"
    echo "   3. Login to admin panel and change passwords"
else
    echo ""
    echo "❌ Admin seeding failed!"
    echo "====================================="
    echo "Please check the error messages above and try again."
    echo ""
    echo "Common issues:"
    echo "  - MongoDB not running"
    echo "  - Incorrect DATABASE_URL in .env"
    echo "  - Database connection issues"
    exit 1
fi
