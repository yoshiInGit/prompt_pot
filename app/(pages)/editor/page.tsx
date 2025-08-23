import Editor from "./Editor";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const id = typeof params.id === "string" ? params.id : undefined;

  return <Editor id={id} />;
}
