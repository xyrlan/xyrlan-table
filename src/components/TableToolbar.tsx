// src/components/TableToolbar.tsx
import React, { Dispatch } from "react";
import { Input } from "@heroui/input";
import { FilterIcon, Columns3, SearchIcon } from "lucide-react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { CheckboxGroup, Checkbox } from "@heroui/checkbox";
import { Button } from "@heroui/button";
import { Column } from "../GenericTable.types";
import { Action, State } from "../hooks/useTableState";
import { Key } from "@react-types/shared";

type VisibleColumns = Set<Key> | "all";


interface TableToolbarProps {
  state: State;
  filterableColumns: Column[];
  visibleColumns: Set<Key> | undefined;
  setVisibleColumns: VisibleColumns | undefined;
  dispatch: Dispatch<Action> | undefined;
  debouncedSearch: ((v: string) => void) | undefined;
  columns: Column[];
  addNewItem?: boolean;
  addNewItemComponent?: React.ReactNode | ((mutate: any) => React.ReactNode);
  selectionMode: boolean;
}

export function TableToolbar<T>({
  state,
  filterableColumns,
  visibleColumns,
  setVisibleColumns,
  dispatch,
  debouncedSearch,
  columns,
  addNewItem,
  addNewItemComponent,
  selectionMode,
}: TableToolbarProps) {
  return (
    <div className="flex gap-3 flex-grow">
      <Input
        isClearable
        className="w-full sm:max-w-[25%]"
        placeholder="Pesquisar..."
        size="sm"
        startContent={<SearchIcon />}
        onClear={() => dispatch?.({ type: "CLEAR_FILTER" })}
        onValueChange={(value) => {
          debouncedSearch?.(value);
          dispatch?.({ type: "SET_PAGES", payload: 1 });
        }}
      />

      {filterableColumns.length > 0 && (
        <Popover>
          <PopoverTrigger>
            <Button size="sm" startContent={<FilterIcon size={18} />} variant="flat">
              Filtros
            </Button>
          </PopoverTrigger>
          <PopoverContent className="min-w-[300px] flex flex-col gap-4">
            {filterableColumns.map((column) => (
              <CheckboxGroup
                key={column.uid as string}
                label={column.name}
                value={
                  state.filterParams[column.uid as string]
                    ? Array.from(state.filterParams[column.uid as string])
                    : Array.from(
                      column?.filterOptions?.reduce<Set<any>>(
                        (acc: Set<any>, option: any) => acc.add(option.value),
                        new Set<any>(), // inicializa com um Set vazio
                      ) ?? new Set<any>(), // se não tiver nenhum valor, retorna um Set vazio
                      (option: any) => option.value,
                    )
                }
                onChange={(value: any[]) => {
                  dispatch?.({
                    type: "SET_FILTER_PARAM",
                    payload: {
                      field: column.uid as string,
                      value: new Set(value),
                    },
                  });
                  dispatch?.({ type: "SET_PAGES", payload: 1 });
                }}
              >
                {column?.filterOptions?.map((option: any) => (
                  <Checkbox key={option.value} value={option.value}>
                    {option.label ?? option.value}
                  </Checkbox>
                ))}
              </CheckboxGroup>
            ))}
          </PopoverContent>
        </Popover>
      )}

      <Dropdown>
        <DropdownTrigger className="hidden sm:flex">
          <Button size="sm" startContent={<Columns3 size={18} />} variant="flat">
            Colunas
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          disallowEmptySelection
          aria-label="Table Columns"
          closeOnSelect={false}
          selectedKeys={visibleColumns}
          selectionMode="multiple"
          onSelectionChange={setVisibleColumns as any}
        >
          {columns.map((column) => (
            <DropdownItem key={column.uid as string}>{column.name}</DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
{/* 
      {addNewItem &&
        (React.isValidElement(addNewItemComponent)
          ? addNewItemComponent
          : typeof addNewItemComponent === "function"
            ? addNewItemComponent()
            : null)} */}
    </div>
  );
}
