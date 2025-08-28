import app from './app';
import mongoose from 'mongoose';
import { config } from './config';

async function main() {
  try {
    const PORT = process.env.PORT || 5000;
    await mongoose.connect(config.database_url as string);
    app.listen(PORT,'0.0.0.0', () => {
      console.log(`Server is running on port http://localhost:${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
