import { User } from "../domain/Entities/User";

declare global {
  namespace Express {
    interface Request {
      user?: Partial<User>
    }
  }
}