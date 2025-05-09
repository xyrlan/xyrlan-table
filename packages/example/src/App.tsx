import { XyrlanTableProvider, XyrlanTable } from 'xyrlan-table';

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

export default function App() {
  return (
    <div className="p-4">
      <XyrlanTableProvider>
        <XyrlanTable
          columns={orderColumns}
          endpoint="/comments"
          baseUrl="https://jsonplaceholder.typicode.com/"
          searchFields={["name", "email"]}
          initialVisibleColumns={[
            "id",
            "postId",
            "name",
            "email",
            "body",
            "actions",
          ]}
        />
      </XyrlanTableProvider>
      <p>teste</p>
    </div>
  );
}
