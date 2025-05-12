export class QueryParamsBuilder<T> {
  private static buildFilterParams(filterParams: any[]): any {
    return filterParams.reduce((acc: any, item: any) => {
      // Verifica se o campo é aninhado usando "_"
      if (item.field.includes("_")) {
        const keys = item.field.split("_");

        // Inicializa o objeto de referência para modificar
        let currentLevel = acc;

        // Itera por todas as chaves, exceto a última (que vai receber o valor)
        keys.forEach((key: string, index: number) => {
          if (index === keys.length - 1) {
            // Se o valor for array, adiciona "in" na última chave
            if (Array.isArray(item.value)) {
              currentLevel[key] = { in: item.value };
            } else {
              currentLevel[key] = item.value;
            }
          } else {
            // Se não existir o nível atual, inicializa como objeto
            currentLevel[key] = currentLevel[key] || {};
            // Move para o próximo nível
            currentLevel = currentLevel[key];
          }
        });

      } else {
        // Caso o campo não seja aninhado, verifica se é um array e aplica "in"
        if (Array.isArray(item.value)) {
          acc[item.field] = { in: item.value };
        } else {
          acc[item.field] = item.value;
        }
      }

      return acc;
    }, {});
  }

  private static buildSearchParam(searchParam: any): any {
    return { ...searchParam, mode: "insensitive" };
  }

  private static buildSearchFields<T>(searchFields: (keyof T & string)[], searchParam: any) {
    return searchFields.map((field) => {
      const keys = field.split("_");
      let condition: any = { contains: searchParam.contains, mode: "insensitive" };

      for (let i = keys.length - 1; i >= 0; i--) {
        condition = { [keys[i]]: condition };
      }

      return condition;
    });
  }

  static buildQueryParams<T>(
    filterParams?: { [key: string]: any }[],
    searchParam?: any,
    searchFields?: (keyof T & string)[],
  ): any {
    const conditions: any[] = [];
  
    if (searchParam) {
      if (!searchFields || searchFields.length === 0) {
        throw new Error(
          "searchFields must be provided when searchParam is used.",
        );
      }
      const orConditions = this.buildSearchFields(searchFields, searchParam);

      conditions.push({ OR: orConditions });
    }
  
    if (filterParams) {
      const filters = this.buildFilterParams(filterParams);

      conditions.push(filters);
    }
  
    return conditions.length > 1 ? { AND: conditions } : conditions[0] || {};
  }
}
