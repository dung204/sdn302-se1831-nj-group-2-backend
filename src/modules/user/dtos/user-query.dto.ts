import { z } from 'zod';

import { commonQueryDto } from '@/base/common/dtos';
import { SortingUtils } from '@/base/common/utils';
import { Role } from '@/modules/user/enums';

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
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    citizenNumber: z.string().optional(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    role: z
      .union([
        z
          .enum([Role.OWNER, Role.BRANCH_ADMIN, Role.STAFF, Role.GUEST])
          .transform((value) => value.split(',')),
        z.array(
          z.enum([Role.OWNER, Role.BRANCH_ADMIN, Role.STAFF, Role.GUEST]),
        ),
      ])
      .optional(),
    branch: z.string().optional(),
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
