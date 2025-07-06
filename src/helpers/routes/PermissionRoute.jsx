export const hasPermission = (permissions, page) => {
  return permissions.some((permission) => {
    if (permission.page === page) return true;
    if (permission.sub) {
      return permission.sub.some((sub) => sub.page === page);
    }
    return false;
  });
};

export const updatePageVisibility = async (pages, userPermissions = []) => {
  let permissionList = userPermissions;

  if (userPermissions instanceof Promise) {
    permissionList = await userPermissions;
  }

  return pages
    .map((page) => {
      if (page.children && Array.isArray(page.children)) {
        page.children = page.children.filter((child) =>
          hasPermission(permissionList, child.segment)
        );
      }
      page.visible = hasPermission(permissionList, page.segment);
      return page;
    })
    .filter((page) => page.visible);
};
