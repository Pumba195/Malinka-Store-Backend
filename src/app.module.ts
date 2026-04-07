import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './authorization/auth.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    ProductsModule,
    CartModule,
    MongooseModule.forRoot(process.env['MONGO_DB_LOGIN']!),
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
