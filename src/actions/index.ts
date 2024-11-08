import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";

export const server = {
  contact: defineAction({
    accept: "form",
    input: z.object({
      email: z.string().email(),
      message: z.string().min(1).max(1000),
      topic: z.string().optional(),
    }),
    async handler(input, context) {
      if (input.topic) {
        const userAgent = context.request.headers.get("user-agent");
        console.warn(
          "Received topic field honeypot in contact form, user-agent:",
          userAgent
        );
        return { success: true };
      }

      const apiUrl =
        import.meta.env.CONTACT_API ?? context.locals.runtime.env.CONTACT_API;
      const apiKey =
        import.meta.env.CONTACT_API_KEY ??
        context.locals.runtime.env.CONTACT_API_KEY;

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
