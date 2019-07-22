import orderBy from "lodash/orderBy";

export const arrayPagination = (array, page, pageSize, sort) => {
  const sortedArray = orderBy([...array], [sort.key], [sort.sortDirection.toLowerCase()]);
  const startIndex = (page - 1) * pageSize;
  let finishIndex = page * pageSize;
  finishIndex = finishIndex > sortedArray.length ? sortedArray.length : finishIndex;
  return sortedArray.slice(startIndex, finishIndex);
};
