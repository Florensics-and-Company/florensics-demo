// import { HStack } from "@chakra-ui/react";
import { BellRing, Check } from "lucide-react";
import * as React from "react";
import { ClientOnly } from "remix-utils/client-only";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import MapView from "react-native-maps";
import { HStack } from "@chakra-ui/react";
import { MapWindow } from "~/components/MapWindow.client";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ messages: [] });
};

const default_messages = [
  {
    title: "Perigo de incêndio.",
    description: "Detetado sinal alarmante pelo dispositivo 0",
  },
];

type CardProps = React.ComponentProps<typeof Card>;

export default function Dashboard({ ...props }: CardProps) {
  useEffect(() => {
    const interval = setInterval(() => {
      fetch("/status").then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            setStatus(data);
            if (data.alert) {
              setNot(true);
              const audio = new Audio(
                "https://www.myinstants.com/media/sounds/tethys.mp3",
              );
              audio.play();
            }else{setNot(false)}
          });
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const [status, setStatus] = useState(null);
  const [notifications, setNot] = useState(false);

  const { messages } = useLoaderData<typeof loader>();
  return (
    <div
      style={{ width: "100%", height: "100%", overflow: "hidden" }}
      className="flex flex-col md:flex-row"
    >
      <Card
        style={{ float: "left" }}
        className={cn("minW-[300px] block")}
        {...props}
      >
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
          <CardDescription>
            {notifications? (
              default_messages.length == 1 ? (
                <>{"Tem " + default_messages.length + " notificação."}</>
              ) : (
                <>{"Tem " + default_messages.length + " notificações."}</>
              )
            ) : (
              "Sem novas notificações."
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className={notifications?"grid  bg-slate-100 rounded":"grid " }>
          <div>
          {notifications&&default_messages.map((notification, index) => (
              <div
                key={index}
                className=" grid grid-cols-[25px_1fr] items-start last:mb-0 last:pb-0"
              >
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-red-700" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none font-bold">
                    {notification.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {notification.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            {/* <Check className="mr-2 h-4 w-4" /> Mark all as read */}
          </Button>
        </CardFooter>
      </Card>

      <ClientOnly>
        {() => {
          return <MapWindow status={status} />;
        }}
      </ClientOnly>
    </div>
  );
}
