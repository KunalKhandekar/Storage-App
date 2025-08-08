export const canPerform = (actorRole, targetRole) => {
  const hierarchy = ["User", "Manager", "Admin", "SuperAdmin"];
  return hierarchy.indexOf(actorRole) > hierarchy.indexOf(targetRole);
};