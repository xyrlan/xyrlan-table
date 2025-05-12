import { XyrlanTable } from "xyrlan-table";

import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  const orderColumns = [
    { name: "Id", uid: "id" },
    {
      name: "post ID",
      uid: "postId",
      sortable: true,
    },
    { name: "Name", uid: "name" },
    { name: "Email", uid: "email" },
    { name: "Body", uid: "body" },
    { name: "Ações", uid: "actions" },
  ];

  return (
    <DefaultLayout>
      <XyrlanTable
        baseUrl="https://jsonplaceholder.typicode.com"
        columns={orderColumns}
        endpoint="/comments"
        initialVisibleColumns={[
          "id",
          "postId",
          "name",
          "email",
          "body",
          "actions",
        ]}
        searchFields={["name", "email"]}
      />
    </DefaultLayout>
  );
}
