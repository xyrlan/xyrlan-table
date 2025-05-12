import { HeroUIProvider } from "@heroui/system";
import GenericTable from "./src/GenericTable";
import { useTable, UseTableOptions } from "./src/hooks/useTable";

export default function XyrlanTable<T extends object>(props: UseTableOptions<T>) {
  const {
    headerColumns,
    sortedItems,
    selectedKeys,
    selectionMode,
    sortDescriptor,
    isLoading,
    topContent,
    bottomContent,
    setSelectedKeys,
    setSortDescriptor,
    mutate,
  } = useTable(props);

  return (
      <GenericTable<T>
        columns={headerColumns}
        items={sortedItems}
        selectedKeys={selectedKeys}
        selectionMode={selectionMode}
        sortDescriptor={sortDescriptor}
        isLoading={isLoading}
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
        topContent={topContent}
        bottomContent={bottomContent}
        mutate={mutate}
        renderCell={props.renderCellMap}
      />
  );
}
