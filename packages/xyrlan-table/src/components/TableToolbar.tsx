// src/components/TableToolbar.tsx
import React, { Dispatch } from "react";
import { Input } from "@heroui/input";
import { FilterIcon, Columns3, SearchIcon } from "lucide-react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { CheckboxGroup, Checkbox } from "@heroui/checkbox";
import { Select, SelectItem } from "@heroui/select";
import { Switch } from "@heroui/switch";
import { Button } from "@heroui/button";
import { Column, FilterableColumn } from "../GenericTable.types";
import { Action, State } from "../hooks/useTableState";
import { Key } from "@react-types/shared";

type VisibleColumns = Set<Key> | "all";

interface TableToolbarProps<T> {
  state: State;
  filterableColumns: FilterableColumn<T>[];
  visibleColumns: Set<Key> | undefined;
  setVisibleColumns: VisibleColumns | undefined;
  dispatch: Dispatch<Action> | undefined;
  debouncedSearch: ((v: string) => void) | undefined;
  total: number;
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
  total,
  columns,
  addNewItem,
  addNewItemComponent,
  selectionMode,
}: TableToolbarProps<T>) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 flex-grow">
        <div className="flex flex-col gap-2 items-center">
            <Switch
              defaultSelected={selectionMode}
              size="sm"
              onValueChange={() => dispatch?.({
                type: "SET_SELECTION_MODE",
                payload: !selectionMode,
              })}
            />
            <span className="text-xs check">Modo selecionar</span>
          </div>

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
          <Popover
            classNames={{
              content:
                "min-w-[300px] flex flex-col items-start gap-4 py-4 px-4",
            }}
            size="sm"
          >
            <PopoverTrigger>
              <Button size="sm" startContent={<FilterIcon size={18} />} variant="flat">
                Filtros
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              {filterableColumns.map((column) => (
                <CheckboxGroup
                  key={column.uid as string}
                  classNames={{
                    label: "capitalize text-sm",
                  }}
                  label={column.name}
                  value={
                    state.filterParams[column.uid as string]
                      ? Array.from(state.filterParams[column.uid as string])
                      : Array.from(
                        column.filterOptions.map(
                          (option: any) => option.value,
                        ),
                      )
                  }
                  onChange={(value) => {
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
                    <Checkbox
                      key={option.value}
                      value={option.value}
                      classNames={{
                        label: "text-sm ",
                      }}>
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
      <div className="flex justify-between items-center">
        <span className="text-default-400 text-small">
          Total {total} registros
        </span>

        <Select
          className="max-w-48"
          classNames={{
            label: "text-default-400 text-small",
          }}
          label="Linhas por página"
          labelPlacement="outside-left"
          selectedKeys={[state.rowsPerPage.toString()]}
          selectionMode="single"
          size="sm"
          onChange={(e) =>
            dispatch?.({
              type: "SET_ROWS_PER_PAGE",
              payload: Number(e.target.value),
            })
          }
        >
          {["5", "10", "15", "20", "25", "30", "35", "40", "50", "60", "70", "80", "90", "100"].map(
            (size) => (
              <SelectItem key={size.toString()}>
                {size}
              </SelectItem>
            ),
          )}
        </Select>
      </div>
    </div>
  );
}
