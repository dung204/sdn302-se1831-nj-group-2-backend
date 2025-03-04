import { z } from 'zod';

import { commonQueryDto } from '@/base/common/dtos';
import { SearchUtils, SortingUtils } from '@/base/common/utils';

export const userQueryDto = commonQueryDto
  .extend({
    sorting: SortingUtils.getSortingValueSchema([
      'id',
      'firstName',
      'lastName',
      'username',
      'citizenNumber',
      'phoneNumber',
      'availableTime',
      'createTimestamp',
      'deleteTimestamp',
    ]),
    search: SearchUtils.getSearchValueSchema([
      'firstName',
      'lastName',
      'username',
      'citizenNumber',
      'phoneNumber',
    ]),
  })
  .transform((payload) => {
    const searchTransformed = SearchUtils.transformSearch(payload);
    const sortingTransformed = SortingUtils.transformSorting(payload);

    return {
      ...payload,
      search: searchTransformed.search,
      sorting: sortingTransformed.sorting,
    };
  });

export type UserQueryDto = z.infer<typeof userQueryDto>;
