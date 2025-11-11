import { json, LoaderFunctionArgs } from "@remix-run/node";

import { prisma } from "~/db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json(await prisma.sensor.findUnique({ where: { id: "0" } }));
};
