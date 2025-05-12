import * as react_jsx_runtime from 'react/jsx-runtime';
import React$1, { PropsWithChildren } from 'react';
import { Key } from '@react-types/shared';

interface Column<T = any> {
    uid: keyof T | "actions";
    name: string;
    sortable?: boolean;
    filterable?: boolean;
    filterOptions?: {
        value: any;
        label?: string;
    }[];
}
interface RenderProps<T> {
    columns: Column[];
    items: T[];
    renderCell?: Partial<Record<keyof T | "actions", (item: T, mutate?: any) => React.ReactNode>>;
}
interface SelectionProps {
    selectedKeys: "all" | Set<Key>;
    selectionMode: boolean;
    onSelectionChange: (keys: Set<Key>) => void;
}
interface SortingProps {
    sortDescriptor: {
        column: string;
        direction: "ascending" | "descending";
    };
    onSortChange: (sortDescriptor: any) => void;
}
interface PaginationProps {
    totalCount: number;
    rowsPerPage: number;
    page: number;
    setPage: (n: number) => void | undefined;
}
interface ToolbarProps {
    filterableColumns?: Column[];
    mutate?: () => void;
}
interface GenericTableProps<T> extends RenderProps<T>, Partial<SelectionProps>, Partial<SortingProps>, Partial<PaginationProps>, Partial<ToolbarProps> {
    isLoading: boolean;
}

interface UseTableOptions<T> {
    /** Rota a usar com o provedor padrão (default) */
    endpoint: string;
    /** DataProvider customizado (substitui `endpoint`) */
    dataProvider?: (params: any) => Promise<{
        items: T[];
        totalCount: number;
    }>;
    /** Base URL para o endpoint padrão */
    baseUrl?: string;
    /** RenderCell customizado (substitui `renderCell` padrão) eg. renderCell={(item, columnKey, mutate) => <CustomCell item={item} columnKey={columnKey} mutate={mutate} />} */
    renderCellMap?: Partial<Record<keyof T | "actions", (item: T, mutate?: any) => React$1.ReactNode>>;
    /** Configuração de colunas e visibilidade */
    columns: Column<T>[];
    initialVisibleColumns: (keyof T | "actions")[];
    /** Campos para busca full-text */
    searchFields: (keyof T)[];
    /** Adicionar botão de "novo item" */
    addNewItem?: boolean;
    addNewItemComponent?: React$1.ReactNode | ((mutate: any) => React$1.ReactNode);
}

declare function XyrlanTable<T extends object>(props: UseTableOptions<T>): react_jsx_runtime.JSX.Element;

/**
 * Renderizador padrão de células para a tabela, usado quando `renderCell` customizado não é fornecido.
 */
declare function defaultRenderCell<T extends Record<string, any>>(item: T, columnKey: keyof T): react_jsx_runtime.JSX.Element;

declare const XyrlanTableProvider: ({ children }: PropsWithChildren) => react_jsx_runtime.JSX.Element;

export { type Column, type GenericTableProps, XyrlanTable, XyrlanTableProvider, defaultRenderCell };
