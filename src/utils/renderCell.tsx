import React from "react";

/**
 * Renderizador padrão de células para a tabela, usado quando `renderCell` customizado não é fornecido.
 */
export function defaultRenderCell<T extends Record<string, any>>(
  item: T,
  columnKey: keyof T
) {
  const value = item[columnKey];

  return (
    <span className="text-sm text-default-800 break-all">
      {typeof value === "object" ? JSON.stringify(value) : String(value ?? "")}
    </span>
  );
}
