import { z } from 'zod';

export type SearchCondition = {
  field: string;
  value: string;
};

type PayloadWithRawSearch = {
  search: string | string[];
  [key: string]: unknown;
};

export class SearchUtils {
  /**
   * Generates a Zod schema for validating search values
   * @param allowedFields - Allowed fields for searching
   */
  public static getSearchValueSchema(allowedFields: [string, ...string[]]) {
    const fields = [...new Set(allowedFields)]; // Remove duplicates

    const singleValueSchema = z
      .string()
      // refine: Custom validation function
      .refine((val) =>
        // Check if the value is in the format "field:value" => ex: "name:John"
        new RegExp(`^(${fields.join('|')})+:.+$`, 'g').test(val),
      );

    return singleValueSchema
      .or(z.array(singleValueSchema)) // Allow multiple search values
      .optional()
      .default([]);
  }

  /**
   * Transforms search string format "field:value" into SearchCondition object
   * @template TPayload - The type of the payload that extends {@link PayloadWithRawSearch}
   * @param {TPayload} payload - The payload containing the search information
   * @param {string | string[]} payload.search - The search information, either as a comma-separated string or an array of strings
   *
   * @param Đầu vào: Một object chứa search (dữ liệu tìm kiếm dạng "field:value") và payload (các dữ liệu khác).
   * @returns Đầu ra: Object mới, trong đó search là một mảng chứa các phần tử có dạng { field: string, value: string }
   */
  public static transformSearch<TPayload extends PayloadWithRawSearch>({
    search,
    ...payload
  }: TPayload): Omit<TPayload, 'search'> & { search: SearchCondition[] } {
    // Convert search string to array of SearchCondition objects
    // ex: "name:John,age:25" -> ["name:John", "age:25"]
    const searchValues =
      typeof search === 'string' ? search.split(',') : search || []; // nếu search là undefined -> gán search = []

    // "name:John,address:123 Main St" -> [{ field: 'name', value: 'John' }, { field: 'address', value: '123 Main St' }]
    return {
      ...payload,
      search: searchValues.map((val) => {
        const [field, ...values] = val.split(':');
        return {
          field,
          value: values.join(':'), // Rejoin in case value contains ':'
        } as SearchCondition;
      }),
    };
  }
}
