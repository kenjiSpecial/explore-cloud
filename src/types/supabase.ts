/**
 * This file was auto-generated by swagger-to-ts.
 * Do not make direct changes to the file.
 */

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface definitions {
  blog: {
    /**
     * Note:
     * This is a Primary Key.<pk/>
     */
    id: number;
    /**
     * Note:
     * This is a Foreign Key to `users.id`.<fk table='users' column='id'/>
     */
    user_id: string;
    post: { text: string, id: string }[];
    updated_at: string;
  };
  users: {
    /**
     * Note:
     * This is a Primary Key.<pk/>
     */
    id: string;
  };
}
