import { ActionError, defineAction } from "astro:actions";
import { CONTACT_API, CONTACT_API_KEY } from "astro:env/server";
import { z } from "astro/zod";

export const server = {
  contact: defineAction({
    accept: "form",
    input: z.object({
      email: z.string().email(),
      message: z.string().min(1).max(1000),
    }),
    async handler(input, context) {
      const apiUrl = import.meta.env.CONTACT_API ?? CONTACT_API;
      const apiKey = import.meta.env.CONTACT_API_KEY ?? CONTACT_API_KEY;

      if (!apiUrl || !apiKey) {
        console.error("Missing CONTACT_API or CONTACT_API_KEY");
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to send message",
        });
      }

      const formattedMessage = `brandonma.dev Contact\nFrom: ${input.email}\n\n${input.message}`;

      const res = await fetch(`${apiUrl}/notifications/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": apiKey,
        },
        body: JSON.stringify({
          message: formattedMessage,
        }),
      });

      if (!res.ok) {
        console.error(await res.text());
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to send message, please try again later",
        });
      }

      return { success: true };
    },
  }),
};
