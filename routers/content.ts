import { Elysia, t } from "elysia";
import { db } from "../db";
import { contentAccess, contents, users, type AddContent } from "../db/schema";
import { eq, and, gt, isNull, or, not } from "drizzle-orm/expressions";
import { generateUsername } from "../utils/randomUsername";

export const contentsRouter = new Elysia({ prefix: "/contents" })
  .get(
    "/nfts/:userId",
    async ({ params }) => {
      return await db.query.contents.findMany({
        where: not(eq(contents.creatorId, params.userId)),
        with: {
          accesses: true,
          creator: true,
        },
      });
    },
    {
      params: t.Object({
        userId: t.String(),
      }),
    }
  )
  .get(
    "/get-user-nfts/:userId",
    async ({ params }) => {
      return await db.query.contents.findMany({
        where: eq(contents.creatorId, params.userId),
        with: {
          accesses: true,
          creator: true,
        },
      });
    },
    {
      params: t.Object({
        userId: t.String(),
      }),
    }
  )
  .post(
    "/",
    async ({ body }) => {
      try {
        const result = await db.transaction(async (tx) => {
          const newCt: AddContent = {
            id: crypto.randomUUID(),
            creatorId: body.creatorId,
            title: body.title,
            tokenId: body.tokenId,
            description: body.description,
            priceETH: body.priceETH,
            priceUSD: body.priceUSD,
            coverImage:
              "https://g-fvxujch8ow7.vusercontent.net/placeholder.svg",
            creatorAddress: body.creatorAddress,
          };

          const newContent = await tx
            .insert(contents)
            .values(newCt)
            .returning();

          return { data: newContent[0], ok: true };
        });

        return result;
      } catch (error) {
        console.error("Error in content creation transaction:", error);
        return { data: null, ok: false };
      }
    },
    {
      body: t.Object({
        creatorId: t.String(),
        title: t.String(),
        description: t.String(),
        priceUSD: t.String(),
        priceETH: t.String(),
        tokenId: t.String(),
        creatorAddress: t.String(),
      }),
    }
  )
  .post(
    "/purchase/:id",
    async ({ params: { id }, body }) => {
      const content = await db
        .select()
        .from(contents)
        .where(eq(contents.id, id));

      console.log("CONTENT", content);

      if (!content[0]) {
        return { data: null, message: "Content not found" };
      }

      if (!content[0]) throw new Error("Content not found");

      const newAccess = await db
        .insert(contentAccess)
        .values({
          id: crypto.randomUUID(),
          contentId: id,
          userId: body.userId,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        })
        .returning();

      return newAccess[0];
    },
    {
      body: t.Object({
        userId: t.String(),
      }),
    }
  )
  .get(
    "/:id/access",
    async ({ params: { id }, query }) => {
      const access = await db
        .select()
        .from(contentAccess)
        .where(
          and(
            eq(contentAccess.contentId, id),
            eq(contentAccess.userId, query.user),
            eq(contentAccess.isActive, true),
            or(
              isNull(contentAccess.expiresAt),
              gt(contentAccess.expiresAt, new Date())
            )
          )
        );

      return access.length > 0; // Return true if access exists
    },
    {
      query: t.Object({
        user: t.String(),
      }),
    }
  )
  .get("/detail/:id", async ({ params }) => {
    const content = await db.query.contents.findMany({
      where: eq(contents.id, params.id),
      with: {
        accesses: true,
        creator: true,
      },
    });

    return content[0];
  });

// extend rent
// pdfs only
// outright buy allows download
// rent only view on app
