import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  AspectRatio,
} from "@acme/ui";
import type { InferSelectModel } from "drizzle-orm";
import type { message } from "@acme/db";
import moment from "moment";

export interface MessageCardInput {
  message: InferSelectModel<typeof message>;
  imageSrc?: string;
}

export const MessageCard: React.FC<MessageCardInput> = ({
  message,
  imageSrc,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{message.sender}</CardTitle>
        <CardDescription>
          {message.printedAt ? (
            <p>Printed {moment(message.printedAt).fromNow()}</p>
          ) : (
            <p>Pending print</p>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{message.body}</p>
        {imageSrc && (
          <div className="mx-auto mt-3 max-w-[400px] overflow-hidden rounded-md">
            <AspectRatio ratio={1}>
              <img
                src="https://picsum.photos/400/400"
                className="h-full w-full object-fill"
              />
            </AspectRatio>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
