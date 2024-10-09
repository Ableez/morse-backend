import { Elysia, t } from "elysia";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm/expressions";

export const usersRouter = new Elysia({ prefix: "/users" })
  .post(
    "/create",
    async ({ body }) => {
      try {
        const userAlreadyExists = await db
          .select()
          .from(users)
          .where(eq(users.id, body.id))
          .limit(1);

        if (userAlreadyExists.length > 0) {
          return { status: "error", message: "User already exists" };
        }

        const newUser = await db
          .insert(users)
          .values({
            id: body.id,
            username: body.username,
            email: body.email || null,
            profileImage: body.profileImage || null,
            walletAddress: body.primary_web3_wallet_id,
          })
          .returning();

        return { status: "success", user: newUser[0] };
      } catch (error) {
        console.error("Error creating user:", error);
        return { status: "error", message: "Failed to create user" };
      }
    },
    {
      body: t.Object({
        id: t.String(),
        username: t.String(),
        email: t.String(),
        profileImage: t.String(),
        primary_web3_wallet_id: t.Optional(t.String()),
      }),
    }
  )
  .put(
    "/update/:id",
    async ({ params, body }) => {
      try {
        const updatedUser = await db
          .update(users)
          .set({
            username: body.username,
            email: body.email || null,
            profileImage: body.profileImage || null,
            updatedAt: new Date(),
          })
          .where(eq(users.id, params.id))
          .returning();

        if (updatedUser.length === 0) {
          return { status: "error", message: "User not found" };
        }

        return { status: "success", user: updatedUser[0] };
      } catch (error) {
        console.error("Error updating user:", error);
        return { status: "error", message: "Failed to update user" };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        username: t.String(),
        email: t.String(),
        profileImage: t.Optional(t.String()),
      }),
    }
  )
  .delete(
    "/delete/:id",
    async ({ params }) => {
      try {
        const deletedUser = await db
          .delete(users)
          .where(eq(users.id, params.id))
          .returning();

        if (deletedUser.length === 0) {
          return { status: "error", message: "User not found" };
        }

        return { status: "success", message: "User deleted successfully" };
      } catch (error) {
        console.error("Error deleting user:", error);
        return { status: "error", message: "Failed to delete user" };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  );
