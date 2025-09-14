import app from './app';
import mongoose from 'mongoose';
import { config } from './config';

async function main() {
  try {
    const PORT = parseInt(process.env.PORT || '5000', 10);
    await mongoose.connect(config.database_url as string);

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
}

main();
