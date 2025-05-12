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

## 🧱 Requisitos

```bash
npm install react react-dom tailwindcss framer-motion
```
Configure também o TailwindCSS e envolva sua aplicação com o HeroUIProvider:


🧱 Requisitos
Certifique-se de configurar o TailwindCSS e envolver sua aplicação com o HeroUIProvider.

tailwind.config.js
js
Copiar
Editar
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
};
No seu App:
tsx
Copiar
Editar
import { HeroUIProvider } from "@heroui/system";

function App() {
  return (
    <HeroUIProvider>
      <YourAppRoutes />
    </HeroUIProvider>
  );
}
✅ Exemplo básico
tsx
Copiar
Editar
import { XyrlanTable } from "xyrlan-table";

const columns = [
  { key: "name", label: "Nome" },
  { key: "email", label: "Email" },
];

export default function Example() {
  return (
    <XyrlanTable
      endpoint="/api/companies"
      columns={columns}
      initialVisibleColumns={["name", "email"]}
      searchFields={["name", "email"]}
    />
  );
}
🔌 Formato da API esperada
A API que alimenta a tabela deve retornar dados no seguinte formato:

json
Copiar
Editar
{
  "data": [
    { "id": 1, "name": "Empresa 1", "email": "empresa1@email.com" },
    ...
  ],
  "paging": {
    "totalCount": 42,
    "page": 1,
    "pageSize": 10
  }
}
⚙️ Props disponíveis (UseTableOptions<T>)
Propriedade	Tipo	Descrição
endpoint	string	Rota da API para o provedor padrão
dataProvider	(params) => Promise<{ items: T[], totalCount: number }>	Provider customizado opcional
baseUrl	string	Base da URL (padrão: process.env.NEXT_PUBLIC_URL)
renderCell	(item, columnKey, mutate) => ReactNode	Personalização de células
columns	Column<T>[]	Colunas da tabela
initialVisibleColumns	`(keyof T	"actions")[]`
searchFields	(keyof T)[]	Campos usados na busca textual
addNewItem	boolean	Exibir botão de "novo item"
addNewItemComponent	`ReactNode	(mutate) => ReactNode`

🧠 Exemplo de uso com renderização customizada
tsx
Copiar
Editar
<XyrlanTable
  endpoint="/api/companies"
  columns={[
    { key: "name", label: "Nome" },
    { key: "email", label: "Email" },
    { key: "actions", label: "Ações" },
  ]}
  initialVisibleColumns={["name", "email", "actions"]}
  searchFields={["name", "email"]}
  renderCell={(item, columnKey) => {
    if (columnKey === "actions") {
      return <button onClick={() => alert(item.id)}>Editar</button>;
    }
    return item[columnKey];
  }}
/>
📦 Build
A biblioteca é empacotada com tsup:

bash
Copiar
Editar
npm run build
📄 Licença
MIT © Xyrlan

yaml
Copiar
Editar

---

Este `README.md` já está formatado para o GitHub, com destaque de código e uma seção completa de documentação. Deseja que eu te ajude a publicar no npm agora?






