export const isMerchant = (user) => user?.role_id === "2";

export const isCarWash = (user) => user?.carwash === 1;

export const isRestaurant = (user) => user?.package_name === "restaurant";

export const canUserBackDate = (user) => {
  if (!isRestaurant(user)) {
    return true;
  }

  return isMerchant(user);
};

export const canViewPages = (user, pages) => {
  if (isMerchant(user)) {
    return true;
  }

  return true;

  const canViewThisPage = user?.access_group_pages?.find(
    (item) => item?.accessible_page?.name == pages
  );

  return canViewThisPage ? true : false;
};
