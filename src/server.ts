import app from './app';
import mongoose from 'mongoose';
import { config } from './config';

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    app.listen(config.port, () => {
      console.log(`Server is running on port http://localhost:${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
