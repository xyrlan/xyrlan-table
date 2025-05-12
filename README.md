# Xyrlan Table

**Xyrlan Table** é uma biblioteca de tabela dinâmica reutilizável para aplicações React com foco em produtividade e integração com APIs baseadas em paginação, ordenação e filtros — ideal para projetos com Next.js, Prisma e SWR.

## ✨ Funcionalidades

- Ordenação por colunas
- Paginação e controle de página
- Filtros dinâmicos e busca full-text
- Seleção de múltiplos itens
- Renderização customizada de células
- Mutação integrada com SWR
- Suporte a botão de "Adicionar novo item"
- Integração simples com API RESTful ou função personalizada

---

## 📦 Instalação

```bash
npm install xyrlan-table
# ou
yarn add xyrlan-table
```

## ✨ Features

✅ Ordenação por coluna

✅ Paginação automática

✅ Busca global e filtros

✅ Suporte a seleção múltipla

✅ Renderização customizada de células

✅ Integração com qualquer API REST

✅ Compatível com Next.js


## 🧱 Requisitos

```bash
npm install react react-dom tailwindcss framer-motion
```
Configure também o TailwindCSS e envolva sua aplicação com o HeroUIProvider:

## 🧱 Basic Usage

```tsx
import { XyrlanTable } from 'xyrlan-table';
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  const columns = [
    { name: "ID", uid: "id" },
    { name: "Post ID", uid: "postId", sortable: true },
    { name: "Name", uid: "name" },
    { name: "Email", uid: "email" },
    { name: "Body", uid: "body" },
    { name: "Ações", uid: "actions" },
  ];

  return (
    <DefaultLayout>
      <XyrlanTable
        baseUrl="https://jsonplaceholder.typicode.com"
        columns={columns}
        endpoint="/comments"
        initialVisibleColumns={["id", "postId", "name", "email", "body", "actions"]}
        searchFields={["name", "email"]}
      />
    </DefaultLayout>
  );
}
```

## 🧱 Props

| Prop                    | Type                                                                                | Default                       | Description                            |
| ----------------------- | ----------------------------------------------------------------------------------- | ----------------------------- | -------------------------------------- |
| `endpoint`              | string                                                                              | **Required**                  | API endpoint for default data provider |
| `columns`               | `Column<T>[]`                                                                       | **Required**                  | Column definitions                     |
| `initialVisibleColumns` | `(keyof T   "actions")[]`                                                           | **Required**                  | Initially visible columns              |
| `searchFields`          | `(keyof T)[]`                                                                       | **Required**                  | Fields for full-text search            |
| `baseUrl`               | string                                                                              | `process.env.NEXT_PUBLIC_URL` | Base URL for API requests              |
| `dataProvider`          | `(params: any) => Promise<{ items: T[]; totalCount: number }>`                      | Optional                      | Custom data fetching function          |
| `renderCellMap`         | ` Partial<Record<keyof T | "actions", (item: T, mutate?: any) => React.ReactNode>>` | Optional                      | Custom cell renderer                   |
| `addNewItem`            | boolean                                                                             | Optional                      | Show "Add New" button                  |
| `addNewItemComponent`   | `React.ReactNode | ((mutate: any) => React.ReactNode)`                              | Optional                      | Custom "Add New" component             |

## Data Handling

The component sends requests with the following query parameters structure:
```ts
{
  queryCriteria: {
    page: number,
    pageSize: number,
    orderBy: Record<string, 'asc' | 'desc'>,
    includes: Record<string, boolean>,
    params: Record<string, any>
  }
}
```

Example Next.js API handler with Next.js + Prisma:
```ts
export async function GET(request: NextRequest) {
  const queryCriteria = JSON.parse(request.nextUrl.searchParams.get("queryCriteria") || "{}");
  
  const page = queryCriteria.page || 1;
  const pageSize = queryCriteria.pageSize || 10;
  const skip = (page - 1) * pageSize;

  // Your data fetching logic here
  const [data, total] = await Promise.all([ 
    prisma.entity.findMany({
      where: queryCriteria.params,
      take: pageSize,
      skip,
      orderBy: queryCriteria.orderBy,
      include: queryCriteria.includes,
    }),
    prisma.entity.count({ where: queryCriteria.params })
  ]);

  return NextResponse.json({
    data,
    paging: {
      totalCount: total,
      page,
      pageSize
    }
  });
}
```

## Custom Cell Rendering
If you want to customize only the "actions" or "status" column, just do:
```tsx
<XyrlanTable
  renderCellMap={{
    status: (user) => (
      <Chip color={user.status === "active" ? "success" : "danger"}>
        {user.status}
      </Chip>
    ),
    actions: (user) => <MyActions user={user} />,
  }}
/>
```
If renderCellMap is not passed, all columns fall back to defaultRenderCell.