import { getDb, type Database } from ".";

export abstract class BaseRepository {
  protected get db(): Database {
    return getDb();
  }
}
