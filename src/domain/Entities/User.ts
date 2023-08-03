export class User {
  [x: string]: any;
  constructor(
    public name: string,
    public email: string,
    public password: string,
    public bio?: string | null,
    public picture?: string | null,
    public site?: string | null,
    public site_admin?: boolean
  ) {}
}