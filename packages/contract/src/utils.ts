import z from "zod";

export const uuidV7Schema = z.uuid({ version: "v7" });
