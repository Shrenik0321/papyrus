import { Forbidden } from "@/components/Forbidden";

export default function NotFound() {
  return <Forbidden statusCode={404} />;
}
