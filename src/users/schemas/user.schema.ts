import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * UserDocument type: Combines TypeScript class definition with Mongoose Document properties (e.g. _id, save(), toObject()).
 */
export type UserDocument = User & Document;

/**
 * @Schema(): Decorator that maps the TypeScript class to a MongoDB collection.
 * timestamps: true automatically adds createdAt and updatedAt fields.
 */
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true }) // @Prop(): Defines a field rule/constraint in the Mongoose schema
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true }) // Unique constraint ensures no duplicate emails
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [String], default: ['user'] }) // Array of string roles with a default value
  roles: string[];
}

// SchemaFactory.createForClass generates the Mongoose Schema definition object from the decorated class
export const UserSchema = SchemaFactory.createForClass(User);

