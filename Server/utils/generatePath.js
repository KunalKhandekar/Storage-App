export const generatePath = (pathArray = []) => {
  const nestedDirectory = pathArray.length >= 2 ? pathArray.slice(1) : [];
  let path = "/root";
  nestedDirectory.forEach((dir) => {
    path += `/${dir.name}`;
  });
  return path;
};

export const generateBreadCrumb = (pathArray = []) => {
  return pathArray.map((dir) => {
    return { _id: dir._id, name: dir.name };
  });
};
