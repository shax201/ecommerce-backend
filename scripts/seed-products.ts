import { seedProducts } from '../src/seed/seedProducts';

console.log('🚀 Running product seeding script...');

seedProducts()
  .then(() => {
    console.log('\n🎉 Product seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Product seeding failed:', error);
    process.exit(1);
  });
