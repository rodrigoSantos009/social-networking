export class Post {
  constructor(
    public user_id: string,
    public image?: string | null,
    public description?: string | null
  ) {}
}