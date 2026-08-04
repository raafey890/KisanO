import { User } from './user.types';
import { TokenPair } from './token.types';

export interface AuthResponse extends TokenPair {
  user: User;
}
