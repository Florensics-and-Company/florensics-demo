import { json, LoaderFunctionArgs } from "@remix-run/node";

import { prisma } from "~/db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const searchParams = new URL(request.url).searchParams;
  const flameBinaryString = searchParams.get("flame");
  const flameAnalogString = searchParams.get("flame_anal");

  const tempString = searchParams.get("temp");
  const humString = searchParams.get("hum");
  const gasString = searchParams.get("gas");

  // Validate and convert to floats
  const temp = tempString ? parseFloat(tempString) : undefined;
  const hum = humString ? parseFloat(humString) : undefined;
  const gas = gasString ? parseFloat(gasString) : undefined;
  const flame = flameAnalogString ? parseFloat(flameAnalogString) : undefined;

  // Check if they are valid floats (not NaN)
  const validTemp = temp !== undefined && !isNaN(temp) ? temp : undefined;
  const validHum = hum !== undefined && !isNaN(hum) ? hum : undefined;
  const validGas = gas !== undefined && !isNaN(gas) ? gas : undefined;
  const validFlame = flame !== undefined && !isNaN(flame) ? flame : undefined;

  // Handle flameBinary
  const flameBinary = flameBinaryString === "true" ? true : flameBinaryString === "false" ? false : undefined;

  const newData = {
    alert: flameBinary,
    temp: validTemp,
    hum: validHum,
    flameBinary: flameBinary,
    gas: validGas,
    flame: validFlame,
  };

  await prisma.sensor.upsert({
    create: {
      id: "0",
      ...newData,
    },
    update: { ...newData },
    where: { id: "0" },
  });

  return json({});
};
