export class UserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserError";
  }

  public static UserAlreadyExists() {
    return new UserError("User already exists!");
  }

  public static UserNotFound() {
    return new UserError("User not found!");  
  }

  public static UserNotExists() {
    return new UserError("Email or password incorrect!");
  } 
}